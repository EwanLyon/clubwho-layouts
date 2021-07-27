import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { Timer, Split as ISplit } from '../../../types/livesplit';

import { MaSSplit } from './mas-split';

gsap.registerPlugin(ScrollToPlugin);

const MaSLiveSplitContainer = styled.div`
	display: flex;
	height: 90%;
	width: 1920px;
	position: relative;
`;

const TimerContainer = styled.div`
	position: absolute;
	bottom: 0;
	right: 0;
	display: flex;
	height: 100%;
`;

const TimerBox = styled.div`
	/* width: 200px; */
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-end;
	padding-right: 30px;
	padding-left: 50px;
	box-sizing: border-box;
	font-family: RobotoMono;
	color: #000000;
	background: #ffffff;
`;

const TimerBorder = styled.div`
	height: 100%;
	width: 60px;
	margin-left: -60px;
	z-index: 10;
	background: linear-gradient(270deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
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

// 34 events
const masSplits = [
	{ name: '100m', img: '../shared/split-images/mariosonicolympics/picto-ath.svg' },
	{ name: '110m Hurdles', img: '../shared/split-images/mariosonicolympics/picto-ath.svg' },
	{ name: '4x 100m Relay', img: '../shared/split-images/mariosonicolympics/picto-ath.svg' },
	{ name: 'Javelin Throw', img: '../shared/split-images/mariosonicolympics/picto-ath.svg' },
	{ name: 'Dream Racing', img: '../shared/split-images/mariosonicolympics/picto-dream-racing.svg' },
	{ name: 'Dream Shooting', img: '../shared/split-images/mariosonicolympics/picto-dream-shooting.svg' },
	{ name: 'Surfing', img: '../shared/split-images/mariosonicolympics/picto-srf.svg' },
	{ name: 'Sport Climbing', img: '../shared/split-images/mariosonicolympics/picto-clb.svg' },
	{ name: 'Discus Throw', img: '../shared/split-images/mariosonicolympics/picto-ath.svg' },
	{ name: 'Triple Jump', img: '../shared/split-images/mariosonicolympics/picto-ath.svg' },
	{ name: 'Skateboarding', img: '../shared/split-images/mariosonicolympics/picto-skb.svg' },
	{ name: 'Boxing', img: '../shared/split-images/mariosonicolympics/picto-box.svg' },
	{ name: 'Karate', img: '../shared/split-images/mariosonicolympics/picto-kte.svg' },
	{ name: 'Football', img: '../shared/split-images/mariosonicolympics/picto-fbl.svg' },
	{ name: 'Dream Karate', img: '../shared/split-images/mariosonicolympics/picto-dream-karate.svg' },
	{ name: 'Equestrian', img: '../shared/split-images/mariosonicolympics/picto-equ.svg' },
	{ name: 'Gymnastics', img: '../shared/split-images/mariosonicolympics/picto-gar.svg' },
	{ name: 'Swimming', img: '../shared/split-images/mariosonicolympics/picto-swm.svg' },
	{ name: 'Canoe', img: '../shared/split-images/mariosonicolympics/picto-csp.svg' },
	{ name: 'Rugby Sevens', img: '../shared/split-images/mariosonicolympics/picto-rug.svg' },
	{ name: 'Badminton', img: '../shared/split-images/mariosonicolympics/picto-bdm.svg' },
	{ name: 'Table Tennis', img: '../shared/split-images/mariosonicolympics/picto-tte.svg' },
	{ name: 'Fencing', img: '../shared/split-images/mariosonicolympics/picto-fen.svg' },
	{ name: 'Archery', img: '../shared/split-images/mariosonicolympics/picto-arc.svg' },
	{ name: '1964 Judo', img: '../shared/split-images/mariosonicolympics/picto-1964-judo.svg' },
	{ name: '1964 10m Platform', img: '../shared/split-images/mariosonicolympics/picto-1964-swim.svg' },
	{ name: '1964 100m', img: '../shared/split-images/mariosonicolympics/picto-1964-aths.svg' },
	{ name: '1964 400m Hurdles', img: '../shared/split-images/mariosonicolympics/picto-1964-aths.svg' },
	{ name: '1964 Vault', img: '../shared/split-images/mariosonicolympics/picto-1964-gym.svg' },
	{ name: '1964 Volleyball', img: '../shared/split-images/mariosonicolympics/picto-1964-volleyball.svg' },
	{ name: '1964 Shooting', img: '../shared/split-images/mariosonicolympics/picto-1964-shooting.svg' },
	{ name: '1964 Kayak', img: '../shared/split-images/mariosonicolympics/picto-1964-kayak.svg' },
	{ name: '1964 Long Jump', img: '../shared/split-images/mariosonicolympics/picto-1964-aths.svg' },
	{ name: '1964 Marathon', img: '../shared/split-images/mariosonicolympics/picto-1964-aths.svg' },
];

export const MaSLiveSplit: React.FC<Props> = (props: Props) => {
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

	const splits = masSplits.map((split, i) => {
		let liveDelta: string | undefined = undefined;
		if (currentSplitRep === i) {
			const currentSplitValue = splitsRep[currentSplitRep];
			// If split time is above the best split time display the delta live
			if (
				currentSplitValue?.bestRun?.realTime &&
				currentSplitValue?.bestSplit?.realTime &&
				(currentSplitValue.bestSplit.realTime < timerRep.splitMilliseconds ||
					timerRep.milliseconds > currentSplitValue?.bestRun?.realTime)
			) {
				const timeDiff = timerRep.milliseconds - currentSplitValue.bestRun.realTime;
				liveDelta = `${msToTimeStr(Math.abs(timeDiff))}.${Math.floor((Math.abs(timeDiff) % 1000) / 100)}`;
				liveDelta = timeDiff < 0 ? `-${liveDelta}` : `+${liveDelta}`;
			}
		}
		return (
			<MaSSplit
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
		<MaSLiveSplitContainer className={props.className} style={props.style}>
			<SplitsContainer ref={splitsContainerRef}>
				{splits}
				<div style={{ minWidth: 500 }} />
			</SplitsContainer>
			<TimerContainer>
				<TimerBorder />
				<TimerBox>
					<Timer>{`${msToTimeStr(timerRep.milliseconds)}.${Math.floor((timerRep.milliseconds % 1000) / 100)}`}</Timer>
					<SplitTimer>{`${msToTimeStr(timerRep.splitMilliseconds)}.${Math.floor(
						(timerRep.splitMilliseconds % 1000) / 100
					)}`}</SplitTimer>
				</TimerBox>
			</TimerContainer>
		</MaSLiveSplitContainer>
	);
};
