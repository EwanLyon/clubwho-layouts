import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import { HBLiveSplit } from './components/livesplit/hb-livesplit';
import { HBMeta } from './components/livesplit/hb-meta';
import { ChatBox } from './components/chat-box';
import { SplitsBar } from './components/livesplit/splits-bar';
import { TwitchChat } from './components/twitch-chat';

const SpeedrunContainer = styled.div`
	background: #000000;
	width: 1920px;
	height: 1080px;
`;

const FullBorder = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 1918px; // Border
	height: 1078px;
	pointer-events: none;
`;

const SocialName = styled.span`
	display: flex;
	align-items: center;
	margin: 0 70px;
	font-size: 25px;
	color: #ffffff;
`;
const SocailImg = styled.img`
	margin-right: 30px;
	height: 39px;
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
	width: 412px;
`;

const WebcamBox = styled.div`
	height: 454px;
	width: 100%;
	border-bottom: 1px #ffffff solid;
`;

const MainGameplay = styled.div`
	border-left: 1px #ffffff solid;
	border-bottom: 1px #ffffff solid;
	position: absolute;
	width: 1508px;
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
			<HorizontalCentre>
				<Vertical>
					<WebcamBox />
					<SocialName>
						<SocailImg src={require('./assets/social/Twitter_col.svg')} />
						CLUBWHOM
					</SocialName>
					<TwitchChat style={{ width: '100%', height: 210 }} />
					<HBMeta />
				</Vertical>
				<MainGameplay />
			</HorizontalCentre>
			<BottomSegment>
				<HBLiveSplit />
				<div style={{position: 'absolute', width: '100%', zIndex: 10}}>
					{/* <SplitsBar /> */}
				</div>
			</BottomSegment>
			<FullBorder />
		</SpeedrunContainer>
	);
};

render(<Speedrun />, document.getElementById('speedrun'));
