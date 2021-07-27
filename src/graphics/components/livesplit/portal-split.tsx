import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Split as ISplit } from '../../../types/livesplit';

const PortalSplitContainer = styled.div`
	padding-left: 20px;
	box-sizing: border-box;
	${(props: SplitStyles) => (props.current ? `height: 100%` : `height: 75%`)};
	${(props: SplitStyles) => (props.current ? `min-width: 250px` : `min-width: 200px`)};
	background: ${(props: SplitStyles) =>
			!props.current && 'linear-gradient( rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75) ),'}
		url(${(props: SplitStyles) => props.img});
	background-size: cover;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	box-shadow: inset 0px 0px 20px 14px ${(props: SplitStyles) => props.shadowCol ?? '#000'};
	transition: 1s;
	${(props: SplitStyles) => props.current && `font-weight: bold !important; border: 1px solid #63497e;`}
	${(props: SplitStyles) => !props.current && `border-top: 1px solid #63497e; border-bottom: 1px solid #63497e;`};
	${(props: SplitStyles) => props.best && RainbowMixin}
`;

const SplitName = styled.span`
	color: #ffffff;
	font-size: 20px;
	text-shadow: 0px 0px 3px #000000;
`;

const SplitTime = styled.span`
	color: #ffffff;
	text-shadow: 0px 0px 3px #000000;
`;

const DeltaTime = styled.span`
	font-weight: lighter;
	text-shadow: 0px 0px 3px #000000;
`;

const rainbowShadow = keyframes`
	0% { box-shadow: inset 0px 0px 20px 14px #ff0000; }
	14% { box-shadow: inset 0px 0px 20px 14px #ff7f00; }
	29% { box-shadow: inset 0px 0px 20px 14px #ffff00; }
	43% { box-shadow: inset 0px 0px 20px 14px #00ff00; }
	57% { box-shadow: inset 0px 0px 20px 14px #0000ff; }
	71% { box-shadow: inset 0px 0px 20px 14px #4b0082; }
	85% { box-shadow: inset 0px 0px 20px 14px #9400d3; }
	100% { box-shadow: inset 0px 0px 20px 14px #ff0000; }
`;

const RainbowMixin = css`
	animation: ${rainbowShadow} 5s linear infinite;
`;

interface SplitStyles {
	img?: string;
	current?: boolean;
	shadowCol?: string;
	best?: boolean;
}

interface Props {
	name: string;
	current?: boolean;
	backgroundImg: string;
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

export const PortalSplit: React.FC<Props> = (props: Props) => {
	let deltaColour = '#ffffff';

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
	if (props.split?.time?.realTime) {
		splitTime = msToTimeStr(props.split.time.realTime);
	} else if (props.split?.bestRun?.realTime) {
		splitTime = msToTimeStr(props.split.bestRun.realTime);
	}

	return (
		<PortalSplitContainer
			id={props.id}
			img={props.backgroundImg}
			current={props.current}
			shadowCol={deltaColour === '#ffffff' ? undefined : deltaColour}
			best={props.split?.state === 'best'}
		>
			<SplitName>{props.name}</SplitName>
			<SplitTime>{splitTime}</SplitTime>
			<DeltaTime>
				{props.liveDelta ? props.liveDelta : props.split?.delta ?? ''}
			</DeltaTime>
		</PortalSplitContainer>
	);
};
