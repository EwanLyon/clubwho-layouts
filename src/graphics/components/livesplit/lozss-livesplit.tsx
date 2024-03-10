import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useReplicant } from '@nodecg/react-hooks';
import gsap from 'gsap';

import { Timer, Split as ISplit } from '../../../types/livesplit';

import { LoZSSCell } from './lozss-cell';

const LozSSLiveSplitContainer = styled.div`
	display: flex;
	height: 100%;
	width: 1920px;
	position: relative;
`;

const CurrentSplitBox = styled.div`
	height: 100%;
	width: 412px;
	padding: 40px 0px 14px 14px;
	box-sizing: border-box;
	font-family: ElMessiri;
	display: flex;
`;

const TimerBox = styled.div`
	/* width: 200px; */
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-end;
	padding-right: 30px;
	box-sizing: border-box;
	font-family: RobotoMono;
	color: #ac4414;
	flex-grow: 1;
`;

const Timer = styled.div`
	font-weight: bold;
	font-size: 90px;
`;

const SplitTextContainter = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	align-items: center;
	justify-content: space-around;
`;

const SplitTimer = styled.div`
	font-size: 25px;
	font-family: RobotoMono;
`;

const SplitTitle = styled.div`
	font-size: 30px;
	font-weight: bold;
`;

const SplitInfo = styled.div`
	display: flex;
	flex-direction: column;
	width: 60%;
	font-size: 20px;

	& > div {
		display: flex;
		justify-content: space-between;
	}
`;

const SplitInfoLabel = styled.span`
	font-weight: bold;
`;

const SplitImage = styled.img`
	image-rendering: pixelated;
`;

const SplitsContainer = styled.div`
	width: 1160px;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	overflow-x: scroll;

	&::-webkit-scrollbar {
		display: none;
	}
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

function padTimeNumber(num: number): string {
	return num.toString().padStart(2, '0');
}

function msToTimeStr(ms: number): string {
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor((ms / (1000 * 60)) % 60);
	const hours = Math.floor(ms / (1000 * 60 * 60));
	if (minutes === 0) {
		return seconds.toString();
	} else if (hours === 0) {
		return `${minutes}:${padTimeNumber(seconds)}`;
	} else {
		return `${hours}:${padTimeNumber(minutes)}:${padTimeNumber(seconds)}`;
	}
}

function msToTimeStrPadSeconds(ms: number): string {
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor((ms / (1000 * 60)) % 60);
	const hours = Math.floor(ms / (1000 * 60 * 60));
	if (hours === 0) {
		return `${minutes}:${padTimeNumber(seconds)}`;
	} else {
		return `${hours}:${padTimeNumber(minutes)}:${padTimeNumber(seconds)}`;
	}
}

export const lozSplits = [
	{ name: 'Sailcloth', img: '../shared/split-images/lozss/Sailcloth.png' },
	{ name: 'Surface', img: '../shared/split-images/lozss/Emerald Tablet.png' },
	{ name: 'Slingshot', img: '../shared/split-images/lozss/Slingshot.png' },
	{ name: 'Beetle', img: '../shared/split-images/lozss/Beetle.png' },
	{ name: 'Skyview', img: '../shared/split-images/lozss/Goddess Crest.png' },
	{ name: 'Eldin', img: '../shared/split-images/lozss/Ruby Tablet.png' },
	{ name: 'Earth Temple', img: '../shared/split-images/lozss/Scaldera.png' },
	{ name: 'Lanaryu', img: '../shared/split-images/lozss/Amber Tablet.png' },
	{ name: 'Hook Beetle', img: '../shared/split-images/lozss/Hook Beetle.png' },
	{ name: 'Gust Bellows', img: '../shared/split-images/lozss/Gust Bellows.png' },
	{ name: 'Mining', img: '../shared/split-images/lozss/Minecart.png' },
	{ name: 'Imprisoned 1', img: '../shared/split-images/lozss/Imprisoned First.png' },
	{ name: "Farore's Courage", img: '../shared/split-images/lozss/Mark of Farore.png' },
	{ name: 'Dragon Scale', img: '../shared/split-images/lozss/Water Dragon Scale.png' },
	{ name: 'Skyview 2', img: '../shared/split-images/lozss/Air Potion.png' },
	{ name: 'Whip', img: '../shared/split-images/lozss/Whip.png' },
	{ name: 'Ancient Cistern', img: '../shared/split-images/lozss/Blessed Idol.png' },
	{ name: 'Clawshot', img: '../shared/split-images/lozss/Double Clawshots.png' },
	{ name: 'Bow', img: '../shared/split-images/lozss/Bow.png' },
	{ name: 'Sandship', img: '../shared/split-images/lozss/Sandship.png' },
	{ name: 'Fireshield Earrings', img: '../shared/split-images/lozss/Fireshield Earrings.png' },
	{ name: 'Enter Fire Sanctuary', img: '../shared/split-images/lozss/Scrapper.png' },
	{ name: 'Mogma Mitts', img: '../shared/split-images/lozss/Mogma Mitts.png' },
	{ name: 'Fire Sanctuary', img: '../shared/split-images/lozss/Mysterious Crystals.png' },
	{ name: 'Master Sword', img: '../shared/split-images/lozss/True Master Sword.png' },
	{ name: 'Thunderhead', img: '../shared/split-images/lozss/Levias.png' },
	{ name: 'Thunder Dragon', img: '../shared/split-images/lozss/Thunder Dragon.png' },
	{ name: 'Tadtones', img: '../shared/split-images/lozss/Tadtones.png' },
	{ name: 'Bokoblin Base', img: '../shared/split-images/lozss/Bokoblin Leader.png' },
	{ name: 'Stone of Trials', img: '../shared/split-images/lozss/Stone of Trials.png' },
	{ name: 'Sky Keep', img: '../shared/split-images/lozss/Triforce.png' },
	{ name: 'Demise', img: '../shared/split-images/lozss/Demise.png' },
];

export const LoZSSLiveSplit: React.FC<Props> = (props: Props) => {
	const [splitsRep] = useReplicant<ISplit[], ISplit[]>('livesplit:splitIndex', []);
	const [timerRep] = useReplicant<Timer, undefined>('livesplit:timer', undefined);
	const [currentSplitRep] = useReplicant<number, number>('livesplit:currentSplit', 0);
	const splitsContainerRef = useRef<HTMLDivElement>(null);
	// console.log(splitsRep)
	useEffect(() => {
		gsap.to(splitsContainerRef.current, {
			duration: 1,
			scrollTo: { x: `#split-${splitsRep[currentSplitRep]?.index}`, offsetX: 860 },
		});
	}, [splitsRep]);

	if (!timerRep) {
		return <></>;
	}

	const splits = lozSplits.map((split, i) => {
		let liveDelta: string | undefined = undefined;
		if (currentSplitRep === i) {
			const currentSplitValue = splitsRep[currentSplitRep];
			// If split time is above the best split time display the delta live
			if (
				currentSplitValue?.bestRun &&
				currentSplitValue?.bestSplit &&
				(currentSplitValue.bestSplit < timerRep.splitMilliseconds ||
					timerRep.milliseconds > currentSplitValue?.bestRun)
			) {
				const timeDiff = timerRep.milliseconds - currentSplitValue.bestRun;
				liveDelta = `${msToTimeStr(Math.abs(timeDiff))}.${Math.floor((Math.abs(timeDiff) % 1000) / 100)}`;
				liveDelta = timeDiff < 0 ? `-${liveDelta}` : `+${liveDelta}`;
			}
		}
		return (
			<LoZSSCell
				id={`split-${i}`}
				key={split.name}
				name={split.name}
				cellImg={split.img}
				split={splitsRep[i]}
				current={currentSplitRep === i}
				liveDelta={liveDelta}
			/>
		);
	});

	console.log(splitsRep[currentSplitRep]);
	const splitAverage = splitsRep[1].splitHistory.reduce((a, b) => a + b, 0) / splitsRep[currentSplitRep].splitHistory.length;

	return (
		<LozSSLiveSplitContainer className={props.className} style={props.style}>
			<CurrentSplitBox>
				<SplitImage src={lozSplits[currentSplitRep].img} />
				<SplitTextContainter>
					<SplitTitle>{lozSplits[currentSplitRep].name}</SplitTitle>
					<SplitTimer>{`${msToTimeStr(timerRep.splitMilliseconds)}.${Math.floor(
						(timerRep.splitMilliseconds % 1000) / 100
					)}`}</SplitTimer>
					<SplitInfo>
						<div>
							<SplitInfoLabel>Best</SplitInfoLabel><span>{msToTimeStr(splitsRep[currentSplitRep].bestSplit)}</span>
						</div>
						<div>
							<SplitInfoLabel>Average</SplitInfoLabel><span>{msToTimeStrPadSeconds(splitAverage)}</span>
						</div>
					</SplitInfo>
				</SplitTextContainter>
			</CurrentSplitBox>
			<SplitsContainer ref={splitsContainerRef}>{splits}</SplitsContainer>
			<TimerBox>
				<Timer>{msToTimeStr(timerRep.milliseconds)}</Timer>
			</TimerBox>
		</LozSSLiveSplitContainer>
	);
};
