import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

import { MaSLiveSplit } from "./components/livesplit/mas-livesplit";
import { MaSMeta } from "./components/livesplit/mas-meta";
import { ChatBox } from "./components/chat-box";
import { SplitsBar } from "./components/livesplit/splits-bar";

const SpeedrunContainer = styled.div`
	background: #ffffff;
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
	color: #000000;
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
	border-bottom: 1px #000000 solid;
`;

const MainGameplay = styled.div`
	border-left: 1px #000000 solid;
	border-bottom: 1px #000000 solid;
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

const BGImage = styled.img`
	position: absolute;
	top: 55px;
	left: 0;
	opacity: 0.5;
`;

export const Speedrun: React.FC = () => {
	return (
		<SpeedrunContainer>
			<BGImage src={require("./assets/mas-greeble.png")} />
			<HorizontalCentre>
				<Vertical>
					<WebcamBox />
					<SocialName>
						<SocailImg src={require("./assets/social/Twitter_col.svg")} />
						CLUBWHOM
					</SocialName>
					<ChatBox style={{ width: "100%", height: 210 }} />
					<MaSMeta />
				</Vertical>
				<MainGameplay />
			</HorizontalCentre>
			<BottomSegment>
				<MaSLiveSplit />
				<div style={{ position: "absolute", width: "100%", zIndex: 10 }}>{/* <SplitsBar /> */}</div>
			</BottomSegment>
			<FullBorder />
		</SpeedrunContainer>
	);
};

createRoot(document.getElementById("root")!).render(<Speedrun />);
