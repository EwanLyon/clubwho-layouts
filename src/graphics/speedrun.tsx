import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import { Spotify } from './components/spotify';
import { LiveSplit } from './components/livesplit/livesplit';

const SpeedrunContainer = styled.div`
	background: #0a0014;
	width: 1920px;
	height: 1080px;
`;

const FullBorder = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 1918px; // Border
	height: 1078px;
	box-shadow: inset 0 0 10px #63497e;
	border: 1px #63497e solid;
	pointer-events: none;
`;

const SocialName = styled.span`
	display: flex;
	align-items: center;
	margin: 0 70px;
	font-size: 25px;
	text-shadow: 0px 0px 3px #63497e;
`;
const SocailImg = styled.img`
	margin-right: 30px;
	height: 39px;
	filter: drop-shadow(0px 0px 5px #63497e);
`;

const HorizontalCentre = styled.div`
	width: 100%;
	height: 849px;
	display: flex;
	align-items: center;
`;

const Vertical = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 849px; // Border
`;

const WebcamBox = styled.div`
	height: 454px;
	width: 407px;
	border-bottom: 1px #63497e solid;
	box-shadow: 0px 0px 10px #63497e;
`;

const MainGameplay = styled.div`
	border-left: 1px #63497e solid;
	border-bottom: 1px #63497e solid;
	box-shadow: 0px 0px 10px #63497e;
	position: absolute;
	width: 1512px;
	height: 849px;
	right: -1px;
	top: -1px;
`;

const BottomSegment = styled.div`
	width: 100%;
	height: 230px;
	display: flex;
	align-items: center;
`;

export const Speedrun: React.FC = () => {
	return (
		<SpeedrunContainer>
			<Spotify />
			<HorizontalCentre>
				<Vertical>
					<WebcamBox />
					<SocialName>
						<SocailImg src={require('./assets/social/Twitter.svg')} />
						CLUBWHOM
					</SocialName>
				</Vertical>
				<MainGameplay />
			</HorizontalCentre>
			<BottomSegment>
				<LiveSplit /> 
			</BottomSegment>
			<FullBorder />
		</SpeedrunContainer>
	);
};

render(<Speedrun />, document.getElementById('speedrun'));
