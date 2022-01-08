import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import { Split } from '../../../types/livesplit';

const SplitsBarContainer = styled.div`
	width: 100%;
	height: 30px;
	display: flex;
`;

const SplitSegment = styled.div`
	height: 100%;
	box-sizing: border-box;
	/* border-right: 1px solid #e20202; */
	box-shadow: inset 0 0 0 2px #1b007e;
	background: #535bcf;
`;

interface Props {
	// splits: Split[];
	className?: string;
	style?: React.CSSProperties;
}

export const SplitsBar: React.FC<Props> = (props: Props) => {
	const [splitsRep] = useReplicant<Split[], Split[]>('livesplit:splitIndex', []);

	if (splitsRep.length === 0) {
		return <></>;
	}
	const finalTime = splitsRep[splitsRep.length - 1].bestRun.realTime;

	const splitEls = splitsRep.map((split, i) => {
		let splitDiff = 0;
		if (i !== 0) {
			splitDiff = splitsRep[i - 1].bestRun.realTime;
		}

		return <SplitSegment key={i} style={{ width: `${((split.bestRun.realTime - splitDiff) / finalTime) * 100}%` }} />;
	});

	return (
		<SplitsBarContainer className={props.className} style={props.style}>
			{splitEls}
		</SplitsBarContainer>
	);
};
