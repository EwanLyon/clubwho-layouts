import * as nodecgApiContext from './nodecg-api-context';
import * as net from 'net';
import livesplitCore from 'livesplit-core';
import fs from 'fs';
import { parseString } from 'xml2js';

import { Commands, Events, Getters, Split, Timer } from '../types/livesplit';

const nodecg = nodecgApiContext.get();

const PIPE_NAME = 'LiveSplit';
const PIPE_PATH = '\\\\.\\pipe\\';

const client = net.connect(PIPE_PATH + PIPE_NAME);

const Events = ["start", "split", "pause", "reset", "resume", "scroll_down", "scroll_up", "skip_split", "switch_comparison_next", "switch_comparison_previous", "undo_all_pauses", "undo_split"];
// const timeComparison = 'RealTime';
// NodeCG Reps
// const stateRep = nodecg.Replicant('livesplit:state', {persistent: false});
const splitsRep = nodecg.Replicant<Split[]>('livesplit:splitIndex', { defaultValue: [], persistent: false });
const currentSplitRep = nodecg.Replicant<number>('livesplit:currentSplit', { defaultValue: 0, persistent: false });
const splitsFileLocRep = nodecg.Replicant<string>('livesplit:splitsFileLocations', { defaultValue: '' });
const timerRep = nodecg.Replicant<Timer>('livesplit:timer', {
	defaultValue: {
		state: 'NotRunning',
		milliseconds: 0,
		splitMilliseconds: 0
	},
	persistent: false
});

let lastData: string;

/* LOCAL LIVESPLIT */
/* We don't want to constantly be polling for the time so we run (another) livesplit timer */
// Sets up the timer with a single split.
const liveSplitRun = livesplitCore.Run.new();
liveSplitRun.pushSegment(livesplitCore.Segment.new('finish'));
const timer = livesplitCore.Timer.new(liveSplitRun) as livesplitCore.Timer;
timer.initializeGameTime();

function tick() {
	if (timerRep.value.state === 'Running') {
		// Calculates the milliseconds the timer has been running for and updates the replicant.
		const time = timer.currentTime().realTime() as livesplitCore.TimeSpanRef;
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

		if (dataStr.startsWith("split") || dataStr === 'skip_split') {
			currentSplitRep.value++;
			if (dataStr.split(' ').length > 1) {
				getSplitInformation(parseInt(dataStr.split(' ')[1]) - 1).then(split => {
					splitsRep.value[currentSplitRep.value - 1] = split;
				})
			}

			if (currentSplitRep.value >= splitsRep.value.length) {
				timerRep.value.state = 'Ended';
				timer.split();
			}
		}

		nodecg.sendMessage(`livesplit:${dataStr.split(' ')[0]}`);

		switch (dataStr as Events) {
			case 'start':
				timer.initializeGameTime();
				timer.start();
				timerRep.value.state = 'Running';
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
				splitsRep.value[currentSplitRep.value] = {
					...splitsRep.value[currentSplitRep.value],
					delta: undefined,
					state: undefined,
					time: undefined,
					splitTime: undefined
				}
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

// @ts-ignore
function sendLivesplitCommand(cmd: Commands) {
	client.write(`${cmd}\r\n`)
}

async function getLivesplitData(cmd: Getters): Promise<string> {
	client.write(`${cmd}\r\n`);

	return new Promise(resolve => {
		setTimeout(() => {
			resolve(lastData);
		}, 5)
	});
}

async function getSplitInformation(splitIndex: number): Promise<Split> {
	const currentSplitInfo = splitsRep.value[splitIndex];
	const delta = await getLivesplitData('getdelta')
	const normalisedTime = delta.replace('+', '').replace('−', '-');
	const currentDelta = timeStrToMS(normalisedTime);
	const previousDelta = splitsRep.value[splitsRep.value.length - 1]?.time ?? 0;

	let splitState: Split['state'] = 'best';
	if (currentDelta < 0) {
		// Ahead
		splitState = currentDelta < previousDelta ? 'aheadGaining' : 'aheadLosing';
	} else {
		// Behind
		splitState = currentDelta < previousDelta ? 'behindGaining' : 'behindLosing';
	}

	const splitTime = calcSplitTime(splitIndex);

	if (currentSplitInfo.bestSplit?.realTime && splitTime < currentSplitInfo.bestSplit?.realTime) {
		splitState = 'best';
	}

	return {
		...currentSplitInfo,
		index: splitIndex,
		state: splitState,
		time: {
			realTime: timerRep.value.milliseconds,
			gameTime: timerRep.value.milliseconds,
		},
		delta: normalisedTime,
		splitTime: splitTime,
	};
}

function calcSplitTime(splitIndex: number) {
	if (splitIndex === 0) {
		return timerRep.value.milliseconds;
	}

	return timerRep.value.milliseconds - (splitsRep.value[splitIndex - 1].time?.realTime ?? -timerRep.value.milliseconds);
}

function timeStrToMS(time: string) {
	const ts = time.split(':');
	if (ts.length === 2) {
		ts.unshift('00'); // Adds 0 hours if they are not specified.
	} else if (ts.length === 1) {
		ts.unshift('00');
		ts.unshift('00');
	}

	if (time[0] === '-') {
		return -Date.UTC(1970, 0, 1, Math.abs(Number(ts[0])), Math.abs(Number(ts[1])), Math.abs(Number(ts[2])));
	} else {
		return Date.UTC(1970, 0, 1, Math.abs(Number(ts[0])), Math.abs(Number(ts[1])), Math.abs(Number(ts[2])));
	}
}

/* SPLITS PARSING */
nodecg.listenFor('livesplit:loadSplits', parseSplitsFile);

function parseSplitsFile(fileLocation: string) {
	splitsFileLocRep.value = fileLocation;
	let splitsArr: Split[] = [];
	parseString(fs.readFileSync(fileLocation).toString(), (err, lssFile) => {
		if (err) {
			nodecg.log.error('[LiveSplit] Error reading splits file: ' + err.message);
			return;
		}
		
		splitsArr = lssFile.Run.Segments[0].Segment.map((segment: Record<any, any>, i: number) => {
			const split: Split = {
				index: i,
				bestRun: { 
					// gameTime: timeStrToMS(segment.SplitTimes[0]?.SplitTime[0]?.GameTime[0]),,
					realTime: timeStrToMS(segment.SplitTimes[0]?.SplitTime[0]?.RealTime[0]),
				},
				bestSplit: {
					// gameTime: timeStrToMS(segment.BestSegmentTime[0]?.GameTime[0]),
					realTime: timeStrToMS(segment.BestSegmentTime[0]?.RealTime[0]),
				}
			}
			return split;
		});

		splitsRep.value = splitsArr;
	});
}

function resetSplits() {
	const newSplits: Split[] = [...splitsRep.value].map(split => {
		return {
			index: split.index,
			bestRun: split.bestRun,
			bestSplit: split.bestSplit,
		}
	});

	splitsRep.value = newSplits;
}

if (splitsFileLocRep.value !== '') parseSplitsFile(splitsFileLocRep.value)
