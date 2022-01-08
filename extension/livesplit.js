"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("./nodecg-api-context"));
const net = tslib_1.__importStar(require("net"));
const livesplit_core_1 = tslib_1.__importDefault(require("livesplit-core"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const xml2js_1 = require("xml2js");
const nodecg = nodecgApiContext.get();
const PIPE_NAME = 'LiveSplit';
const PIPE_PATH = '\\\\.\\pipe\\';
const client = net.connect(PIPE_PATH + PIPE_NAME);
const Events = ["start", "split", "pause", "reset", "resume", "scroll_down", "scroll_up", "skip_split", "switch_comparison_next", "switch_comparison_previous", "undo_all_pauses", "undo_split"];
const timeComparison = 'RealTime';
// NodeCG Reps
const splitsRep = nodecg.Replicant('livesplit:splitIndex', { defaultValue: [], persistent: false });
const currentSplitRep = nodecg.Replicant('livesplit:currentSplit', { defaultValue: 0, persistent: false });
const splitsFileLocRep = nodecg.Replicant('livesplit:splitsFileLocations', { defaultValue: '' });
const timerRep = nodecg.Replicant('livesplit:timer', {
    defaultValue: {
        state: 'NotRunning',
        milliseconds: 0,
        splitMilliseconds: 0
    },
    persistent: false
});
const runMetadataRep = nodecg.Replicant('livesplit:runMetadata');
let lastData;
/* LOCAL LIVESPLIT */
/* We don't want to constantly be polling for the time so we run (another) livesplit timer */
// Sets up the timer with a single split.
const liveSplitRun = livesplit_core_1.default.Run.new();
liveSplitRun.pushSegment(livesplit_core_1.default.Segment.new('finish'));
const timer = livesplit_core_1.default.Timer.new(liveSplitRun);
timer.initializeGameTime();
function tick() {
    if (timerRep.value.state === 'Running') {
        // Calculates the milliseconds the timer has been running for and updates the replicant.
        const time = timer.currentTime().realTime();
        const ms = Math.floor((time.totalSeconds()) * 1000);
        timerRep.value.milliseconds = ms;
        timerRep.value.splitMilliseconds = calcSplitTime(currentSplitRep.value);
    }
}
setInterval(tick, 100);
/* LIVESPLIT SERVER */
client.on('connect', () => {
    nodecg.log.info('[LiveSplit] Connected!');
});
client.on('data', (data) => {
    const dataStr = data.toString().trim();
    nodecg.log.info(`[LiveSplit] Command/Data: ${dataStr}`);
    // LiveSplit event
    if (Events.includes(dataStr) || dataStr.startsWith("reset") || dataStr.startsWith("split")) {
        // Reset
        if (dataStr.startsWith("reset")) {
            nodecg.sendMessage('livesplit:reset', dataStr.split(' ')[1]);
            currentSplitRep.value = 0;
            resetSplits();
            timerRep.value.state = 'NotRunning';
            timer.reset(false);
            timerRep.value.milliseconds = 0;
            timerRep.value.splitMilliseconds = 0;
            return;
        }
        // Split
        if (dataStr.startsWith("split") || dataStr === 'skip_split') {
            currentSplitRep.value++;
            if (dataStr.split(' ').length > 1) {
                getSplitInformation(parseInt(dataStr.split(' ')[1]) - 1).then(split => {
                    splitsRep.value[currentSplitRep.value - 1] = split;
                });
            }
            // Finish!
            if (currentSplitRep.value >= splitsRep.value.length) {
                timerRep.value.state = 'Ended';
                runMetadataRep.value.successfulAttempts++;
                timer.split();
            }
        }
        nodecg.sendMessage(`livesplit:${dataStr.split(' ')[0]}`);
        switch (dataStr) {
            case 'start':
                timer.initializeGameTime();
                timer.start();
                timerRep.value.state = 'Running';
                runMetadataRep.value.attempts++;
                break;
            case 'pause':
                timerRep.value.state = 'Paused';
                timer.pause();
                break;
            case 'resume':
                timerRep.value.state = 'Running';
                timer.resume();
                break;
            case 'undo_split':
                currentSplitRep.value--;
                splitsRep.value[currentSplitRep.value] = Object.assign(Object.assign({}, splitsRep.value[currentSplitRep.value]), { delta: undefined, state: undefined, time: undefined, splitTime: undefined });
                break;
            default:
                break;
        }
    }
    // Data
    lastData = dataStr;
});
client.on('end', () => {
    nodecg.log.info('[LiveSplit] Disconnected');
});
client.on('error', (err) => {
    nodecg.log.error('[LiveSplit] Connection error: ' + err.message);
});
// @ts-ignore
function sendLivesplitCommand(cmd) {
    client.write(`${cmd}\r\n`);
}
async function getLivesplitData(cmd) {
    client.write(`${cmd}\r\n`);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(lastData);
        }, 5);
    });
}
async function getSplitInformation(splitIndex) {
    var _a, _b;
    const currentSplitInfo = splitsRep.value[splitIndex];
    const delta = await getLivesplitData('getdelta');
    const normalisedTime = delta.replace('+', '').replace('−', '-');
    const currentDelta = timeStrToMS(normalisedTime);
    const previousDelta = (_b = (_a = splitsRep.value[splitsRep.value.length - 1]) === null || _a === void 0 ? void 0 : _a.time) !== null && _b !== void 0 ? _b : 0;
    let splitState = 'best';
    if (currentDelta < 0) {
        // Ahead
        splitState = currentDelta < previousDelta ? 'aheadGaining' : 'aheadLosing';
    }
    else {
        // Behind
        splitState = currentDelta < previousDelta ? 'behindGaining' : 'behindLosing';
    }
    const splitTime = calcSplitTime(splitIndex);
    if (currentSplitInfo.bestSplit && splitTime < currentSplitInfo.bestSplit) {
        splitState = 'best';
    }
    return Object.assign(Object.assign({}, currentSplitInfo), { index: splitIndex, state: splitState, time: timerRep.value.milliseconds, delta: normalisedTime, splitTime: splitTime });
}
function calcSplitTime(splitIndex) {
    var _a;
    if (splitIndex === 0) {
        return timerRep.value.milliseconds;
    }
    return timerRep.value.milliseconds - ((_a = splitsRep.value[splitIndex - 1].time) !== null && _a !== void 0 ? _a : -timerRep.value.milliseconds);
}
function timeStrToMS(time) {
    const ts = time.split(':');
    if (ts.length === 2) {
        ts.unshift('00'); // Adds 0 hours if they are not specified.
    }
    else if (ts.length === 1) {
        ts.unshift('00');
        ts.unshift('00');
    }
    if (time[0] === '-') {
        return -Date.UTC(1970, 0, 1, Math.abs(Number(ts[0])), Math.abs(Number(ts[1])), Math.abs(Number(ts[2])), (Math.abs(Number(ts[2])) % 1) * 1000);
    }
    else {
        return Date.UTC(1970, 0, 1, Math.abs(Number(ts[0])), Math.abs(Number(ts[1])), Math.abs(Number(ts[2])), (Math.abs(Number(ts[2])) % 1) * 1000);
    }
}
/* SPLITS PARSING */
nodecg.listenFor('livesplit:loadSplits', parseSplitsFile);
function parseSplitsFile(fileLocation) {
    splitsFileLocRep.value = fileLocation;
    let splitsArr = [];
    xml2js_1.parseString(fs_1.default.readFileSync(fileLocation).toString(), (err, lssFile) => {
        if (err) {
            nodecg.log.error('[LiveSplit] Error reading splits file: ' + err.message);
            return;
        }
        // Get all split times
        splitsArr = lssFile.Run.Segments[0].Segment.map((segment, i) => {
            var _a;
            const segmentHistory = segment.SegmentHistory[0].Time.map((time) => {
                return timeStrToMS(time[timeComparison][0]);
            });
            const split = {
                index: i,
                bestRun: timeStrToMS((_a = segment.SplitTimes[0]) === null || _a === void 0 ? void 0 : _a.SplitTime[0][timeComparison][0]),
                // gameTime: timeStrToMS(segment.SplitTimes[0]?.SplitTime[0]?.GameTime[0]),
                bestSplit: timeStrToMS(segment.BestSegmentTime[0][timeComparison][0]),
                // gameTime: timeStrToMS(segment.BestSegmentTime[0]?.GameTime[0]),
                splitHistory: segmentHistory
            };
            return split;
        });
        // Get attempt history
        const previousRuns = lssFile.Run.AttemptHistory[0].Attempt.map((attempt) => {
            let finished = false;
            const startTime = new Date(attempt['$']['started']);
            const endTime = new Date(attempt['$']['ended']);
            let time = endTime.getTime() - startTime.getTime();
            if (timeComparison in attempt) {
                finished = true;
                time = timeStrToMS(attempt[timeComparison][0]);
            }
            return {
                start: new Date(attempt['$']['started']),
                end: new Date(attempt['$']['ended']),
                time: time,
                finished: finished
            };
        });
        // Get run info
        runMetadataRep.value = {
            attempts: lssFile.Run.AttemptCount[0],
            category: lssFile.Run.CategoryName,
            pb: splitsArr[splitsArr.length - 1].bestRun,
            sumOfBest: splitsArr.reduce((a, b) => { var _a; return a + ((_a = b.bestSplit) !== null && _a !== void 0 ? _a : 0); }, 0),
            previousRuns: previousRuns,
            successfulAttempts: previousRuns.reduce((a, b) => b.finished ? a + 1 : a, 0)
        };
        splitsRep.value = splitsArr;
        nodecg.log.info(`[LiveSplit] Parsing ${fileLocation} successful!`);
    });
}
function resetSplits() {
    const newSplits = [...splitsRep.value].map(split => {
        return {
            index: split.index,
            bestRun: split.bestRun,
            bestSplit: split.bestSplit,
            splitHistory: split.splitHistory
        };
    });
    splitsRep.value = newSplits;
}
if (splitsFileLocRep.value !== '')
    parseSplitsFile(splitsFileLocRep.value);
