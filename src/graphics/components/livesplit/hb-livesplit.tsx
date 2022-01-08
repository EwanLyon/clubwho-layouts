import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { Timer, Split as ISplit } from '../../../types/livesplit';

import { HBSplit } from './hb-split';

gsap.registerPlugin(ScrollToPlugin);

const HBLiveSplitContainer = styled.div`
	display: flex;
	height: 100%;
	padding: 5% 0;
	width: 1920px;
	position: relative;
	justify-content: space-between;
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
	color: #ffffff;
`;

const Timer = styled.div`
	font-weight: bold;
	font-size: 90px;
	margin-bottom: -32px;
`;

const SplitTimer = styled.div`
	font-size: 50px;
`;

const SplitsContainer = styled.div`
	/* width: 1720px; */
	display: flex;
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

const hbSplits = [
	{ name: 'Sunlight', img: '../shared/split-images/heavenlybodies/Sunlight.svg' },
	{ name: 'Data', img: '../shared/split-images/heavenlybodies/Data.svg' },
	{ name: 'Vision', img: '../shared/split-images/heavenlybodies/Vision.svg' },
	{ name: 'Minerals', img: '../shared/split-images/heavenlybodies/Minerals.svg' },
	{ name: 'Oxygen', img: '../shared/split-images/heavenlybodies/Oxygen.svg' },
	{ name: 'Energy', img: '../shared/split-images/heavenlybodies/Energy.svg' },
	{ name: 'Evacuation', img: '../shared/split-images/heavenlybodies/Evacuation.svg' },
];

export const HBLiveSplit: React.FC<Props> = (props: Props) => {
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

	const splits = hbSplits.map((split, i) => {
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
			<HBSplit
				id={`split-${i}`}
				key={split.name}
				name={split.name}
				eventImg={split.img}
				split={splitsRep[i]}
				current={currentSplitRep === i}
				liveDelta={liveDelta}
			/>
		);
	});

	return (
		<HBLiveSplitContainer className={props.className} style={props.style}>
			<SplitsContainer ref={splitsContainerRef}>
				{splits}
				<div style={{ minWidth: 500 }} />
			</SplitsContainer>
			<TimerBox>
				<Timer>{`${msToTimeStr(timerRep.milliseconds)}.${Math.floor((timerRep.milliseconds % 1000) / 100)}`}</Timer>
				<SplitTimer>{`${msToTimeStr(timerRep.splitMilliseconds)}.${Math.floor(
					(timerRep.splitMilliseconds % 1000) / 100
				)}`}</SplitTimer>
			</TimerBox>
		</HBLiveSplitContainer>
	);
};
