import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { Timer, Split as ISplit } from '../../../types/livesplit';

import { Split } from './split';

gsap.registerPlugin(ScrollToPlugin);

const LiveSplitContainer = styled.div`
	display: flex;
	height: 50%;
`;

const TimerBox = styled.div`
	width: 200px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	font-family: roboto-mono;
	background: #0f033b;
	color: #ffffff;
	border-left: #ffffff solid 5px;
`;

const Timer = styled.div`
	font-weight: bold;
	font-size: 30px;
`;

const SplitTimer = styled.div`
	font-size: 20px;
`;

const SplitsContainer = styled.div`
	width: 1720px;
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

const portalSplits = [
	{ name: '00/01', img: '../shared/split-images/portal/Portal_Test_Chamber_00.png' },
	{ name: '02/03', img: '../shared/split-images/portal/Portal_Test_Chamber_02.png' },
	{ name: '04/05', img: '../shared/split-images/portal/Portal_Test_Chamber_04.png' },
	{ name: '06/07', img: '../shared/split-images/portal/Portal_Test_Chamber_05.png' },
	{ name: '08', img: '../shared/split-images/portal/Portal_Test_Chamber_08.png' },
	{ name: '09', img: '../shared/split-images/portal/Portal_Test_Chamber_09.png' },
	{ name: '10', img: '../shared/split-images/portal/Portal_Test_Chamber_10.png' },
	{ name: '11/12', img: '../shared/split-images/portal/Portal_Test_Chamber_11.png' },
	{ name: '13', img: '../shared/split-images/portal/Portal_Test_Chamber_13.png' },
	{ name: '14', img: '../shared/split-images/portal/Portal_Test_Chamber_14.png' },
	{ name: '15', img: '../shared/split-images/portal/Portal_Test_Chamber_15.png' },
	{ name: '16', img: '../shared/split-images/portal/Portal_Test_Chamber_16.png' },
	{ name: '17', img: '../shared/split-images/portal/Portal_Test_Chamber_17.png' },
	{ name: '18', img: '../shared/split-images/portal/Portal_Test_Chamber_18.png' },
	{ name: '19', img: '../shared/split-images/portal/Portal_Test_Chamber_19.png' },
	{ name: 'e00', img: '../shared/split-images/portal/Portal_chamber19_03.png' },
	{ name: 'e01', img: '../shared/split-images/portal/Portal_chamber19_10.png' },
	{ name: 'e02', img: '../shared/split-images/portal/Portal_chamber19_09.png' },
];

export const LiveSplit: React.FC<Props> = (props: Props) => {
	const [splitsRep] = useReplicant<ISplit[], ISplit[]>('livesplit:splitIndex', []);
	const [timerRep] = useReplicant<Timer, undefined>('livesplit:timer', undefined);
	const [currentSplitRep] = useReplicant<number, number>('livesplit:currentSplit', 0);
	const splitsContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		gsap.to(splitsContainerRef.current, {
			duration: 1,
			scrollTo: { x: `#split-${splitsRep[currentSplitRep]?.index}`, offsetX: 860 },
		});
	}, [splitsRep]);

	if (!timerRep) {
		return <></>;
	}

	const splits = portalSplits.map((split, i) => {
		let liveDelta: string | undefined = undefined;
		if (currentSplitRep === i) {
			const currentSplitValue = splitsRep[currentSplitRep];
			// If split time is above the best split time display the delta live
			if (
				currentSplitValue?.bestRun?.realTime &&
				currentSplitValue?.bestSplit?.realTime &&
				currentSplitValue.bestSplit.realTime < timerRep.splitMilliseconds
			) {
				const timeDiff = timerRep.milliseconds - currentSplitValue.bestRun.realTime;
				liveDelta = `${msToTimeStr(Math.abs(timeDiff))}.${Math.floor((Math.abs(timeDiff) % 1000) / 100)}`;
				liveDelta = timeDiff < 0 ? `-${liveDelta}` : `+${liveDelta}`;
			}
		}
		return (
			<Split
				id={`split-${i}`}
				key={split.name}
				name={split.name}
				backgroundImg={split.img}
				split={splitsRep[i]}
				current={currentSplitRep === i}
				liveDelta={liveDelta}
			/>
		);
	});

	return (
		<LiveSplitContainer className={props.className} style={props.style}>
			<SplitsContainer ref={splitsContainerRef}>{splits}</SplitsContainer>
			<TimerBox>
				<Timer>{`${msToTimeStr(timerRep.milliseconds)}.${Math.floor((timerRep.milliseconds % 1000) / 100)}`}</Timer>
				<SplitTimer>{`${msToTimeStr(timerRep.splitMilliseconds)}.${Math.floor(
					(timerRep.splitMilliseconds % 1000) / 100
				)}`}</SplitTimer>
			</TimerBox>
		</LiveSplitContainer>
	);
};
