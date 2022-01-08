import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { RunMetadata } from '../../../types/livesplit';

const HBMetaContainer = styled.div`
	width: 100%;
	color: #ffffff;
`;

const Category = styled.div`
	font-weight: bold;
	font-size: 30px;
	width: 100%;
	text-align: center;
`;

const InfoContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 0 10%;
	box-sizing: border-box;
`;

const InfoTitle = styled.span``;

const InfoData = styled.span`
	font-weight: bold;
`;

interface Props {}

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

export const HBMeta: React.FC<Props> = (_props: Props) => {
	const [metaRep] = useReplicant<RunMetadata, RunMetadata>('livesplit:runMetadata', {attempts: 0, successfulAttempts: 0, previousRuns: []});
	
	return (
		<HBMetaContainer>
			<Category>{metaRep.category}</Category>
			<InfoContainer>
				<InfoTitle>Attempts</InfoTitle>
				<InfoData>{metaRep.attempts}</InfoData>
			</InfoContainer>
			<InfoContainer>
				<InfoTitle>Sum of Best</InfoTitle>
				<InfoData>{metaRep.sumOfBest && msToTimeStr(metaRep.sumOfBest)}</InfoData>
			</InfoContainer>
			<InfoContainer>
				<InfoTitle>PB</InfoTitle>
				<InfoData>{metaRep.pb && msToTimeStr(metaRep.pb)}</InfoData>
			</InfoContainer>
		</HBMetaContainer>
	);
};
