import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { RunMetadata } from '../../../types/livesplit';

const MetaContainer = styled.div`
	width: 100%;
	color: #ffffff;
	font-family: ElMessiri;
`;

const Category = styled.div`
	font-weight: bold;
	font-size: 30px;
	width: 100%;
	text-align: center;
	margin: -13px 0;
`;

const InfoContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 0 10%;
	box-sizing: border-box;
	margin: -5px 0;
`;

const InfoTitle = styled.span``;

const InfoData = styled.span`
	font-weight: 700;
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

export const LoZSSMeta: React.FC<Props> = (_props: Props) => {
	const [metaRep] = useReplicant<RunMetadata, undefined>('livesplit:runMetadata', undefined);
	
	if (!metaRep) return <></>;

	return (
		<MetaContainer>
			<Category>{metaRep.category}</Category>
			<InfoContainer>
				<InfoTitle>Attempts</InfoTitle>
				<InfoData>{metaRep.attempts}</InfoData>
			</InfoContainer>
			<InfoContainer>
				<InfoTitle>Successful</InfoTitle>
				<InfoData>{metaRep.successfulAttempts}</InfoData>
			</InfoContainer>
			<InfoContainer>
				<InfoTitle>Sum of Best</InfoTitle>
				<InfoData>{metaRep.sumOfBest && msToTimeStr(metaRep.sumOfBest)}</InfoData>
			</InfoContainer>
			<InfoContainer>
				<InfoTitle>PB</InfoTitle>
				<InfoData>{metaRep.pb && msToTimeStr(metaRep.pb)}</InfoData>
			</InfoContainer>
		</MetaContainer>
	);
};
