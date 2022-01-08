import React from 'react';
import styled from 'styled-components';
import { Split as ISplit } from '../../../types/livesplit';
import { FitText } from '../fit-text';

const LoZSSCellContainer = styled.div`
	background: ${(props: SplitStyles) => props.current ? 'rgba(100, 100, 100, 0.314)' : 'rgba(20, 4, 109, 0.314)' };
	box-shadow: inset 0px 0px 11px 6px ${(props: SplitStyles) => props.shadowCol};
	height: 57.5px;
	width: 145px;
	display: flex;
	align-items: center;
	font-family: ElMessiri;
	padding: 0 13px;
	box-sizing: border-box;
`;

const TextFlex = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
`;

const SplitName = styled(FitText)`
	max-width: 71px;
`;

const SplitTime = styled.div`
	text-align: center;
	width: 100%;
`;

const DeltaTime = styled.div``;

const SplitImage = styled.img`
	height: 49px;
	width: 42px;
	object-fit: contain;
	margin-right: 6px;
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
	cellImg: string;
	id?: string;
	split: ISplit | undefined;
	liveDelta?: string;
	className?: string;
	style?: React.CSSProperties;
	current?: boolean;
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
export const LoZSSCell: React.FC<Props> = (props: Props) => {
	let deltaColour = '#0b0354';

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

	if (props.current) {
		deltaColour = '#FFFFFF';
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
		<LoZSSCellContainer className={props.className} style={props.style} shadowCol={deltaColour} current={props.current}>
			<SplitImage src={props.cellImg} />
			<TextFlex>
				<SplitName text={props.name} />
				<SplitTime>{splitTime}</SplitTime>
				<DeltaTime>{deltaTime}</DeltaTime>
			</TextFlex>
		</LoZSSCellContainer>
	);
};
