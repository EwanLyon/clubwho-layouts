import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Split as ISplit } from '../../../types/livesplit';

const HBSplitContainer = styled.div`
	font-family: Sansation;
	padding-left: 20px;
	box-sizing: border-box;
	height: ${(props: SplitStyles) => (props.current ? '90%' : '75%')};
	min-width: ${(props: SplitStyles) => (props.current ? '140px' : '127px')};
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	transition: 1s;
	${(props: SplitStyles) => props.current && 'font-weight: bold !important;'}
	opacity: ${(props: SplitStyles) => (props.current || props.old ? 1 : 0.5)};
	margin: 0 ${(props: SplitStyles) => (props.current ? 30 : 10)}px;

	& > span {
		font-size: ${(props: SplitStyles) => (props.current ? 25 : 20)}px;
	}
`;

const EventImg = styled.img`
	object-fit: contain;
	flex-grow: 1;
	width: 100%;
`;

const SplitName = styled.span`
	color: #ffffff;
	white-space: nowrap;
`;

const SplitTime = styled.span`
	color: #ffffff;
`;

const DeltaTime = styled.span`
	color: #ffffff;
	${(props: SplitStyles) => props.best && RainbowMixin}
	font-weight: lighter;
`;

// @pre
const rainbowColour = keyframes`
	\ 0% { color: #ff0000; }
	\ 14% { color: #ff7f00; }
	\ 29% { color: #ffff00; }
	\ 43% { color: #00ff00; }
	\ 57% { color: #0000ff; }
	\ 71% { color: #4b0082; }
	\ 85% { color: #9400d3; }
	\ 100% { color: #ff0000; }
`;

const RainbowMixin = css`
	animation: ${rainbowColour} 5s linear infinite;
`;

interface SplitStyles {
	img?: string;
	current?: boolean;
	shadowCol?: string;
	best?: boolean;
	old?: boolean;
}

interface Props {
	name: string;
	current?: boolean;
	eventImg: string;
	id?: string;
	split: ISplit | undefined;
	liveDelta?: string;
}

function padTimeNumber(num: number): string {
	return num.toString().padStart(2, '0');
}

function msToTimeStr(ms: number): string {
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor((ms / (1000 * 60)) % 60);
	const hours = Math.floor(ms / (1000 * 60 * 60));
	if (hours === 0) {
		return `${padTimeNumber(minutes)}:${padTimeNumber(seconds)}`;
	} else {
		return `${padTimeNumber(hours)}:${padTimeNumber(minutes)}:${padTimeNumber(seconds)}`;
	}
}

export const HBSplit: React.FC<Props> = (props: Props) => {
	let deltaColour = '#000000';

	if (props.split) {
		switch (props.split.state) {
			case 'aheadGaining':
				deltaColour = '#00CC36';
				break;
			case 'aheadLosing':
				deltaColour = '#52CC73';
				break;
			case 'behindGaining':
				deltaColour = '#CC5C52';
				break;
			case 'behindLosing':
				deltaColour = '#CC1200';
				break;
			case 'best':
				break;
			default:
				break;
		}
	}

	let splitTime = '-';
	if (props.split?.time) {
		splitTime = msToTimeStr(props.split.time);
	} else if (props.split?.bestRun) {
		splitTime = msToTimeStr(props.split.bestRun);
	}

	let deltaTime = props.split?.delta ?? '';
	if (props.liveDelta) {
		deltaTime = props.liveDelta;
	} else if (deltaTime !== '' && deltaTime.charAt(0) !== '-') {
		deltaTime = `+${deltaTime}`;
	}

	return (
		<HBSplitContainer
			id={props.id}
			img={props.eventImg}
			current={props.current}
			shadowCol={deltaColour === '#ffffff' ? undefined : deltaColour}
			best={props.split?.state === 'best'}
			old={Boolean(deltaTime)}
		>
			<EventImg src={props.eventImg} />
			<SplitName>{props.name}</SplitName>
			<SplitTime>{splitTime}</SplitTime>
			<DeltaTime best={props.split?.state === 'best'} style={{ color: deltaColour !== '#ffffff' ? deltaColour : '' }}>
				{deltaTime}
			</DeltaTime>
		</HBSplitContainer>
	);
};
