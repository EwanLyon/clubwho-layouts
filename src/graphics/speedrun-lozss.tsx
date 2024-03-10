import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

import { LoZSSMeta } from "./components/livesplit/lozss-meta";
import { LoZSSLiveSplit } from "./components/livesplit/lozss-livesplit";

const SpeedrunContainer = styled.div`
	/* background: #000000; */
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
	min-height: 454px;
	width: 100%;
	border-bottom: 1px #ac4414 solid;
`;

const MainGameplay = styled.div`
	border-left: 1px #ac4414 solid;
	border-bottom: 1px #ac4414 solid;
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
	z-index: -1;
	top: 0;
	left: 0;
`;

const LoZChatBox = styled.video``;

export const Speedrun: React.FC = () => {
	return (
		<SpeedrunContainer>
			<BGImage src={require("./assets/LoZSSBG.png")} />
			<HorizontalCentre>
				<Vertical>
					<WebcamBox />
					<LoZChatBox playsInline muted autoPlay loop>
						<source src={require("./assets/LoZSSChat.webm")} />
					</LoZChatBox>
					<LoZSSMeta />
				</Vertical>
				<MainGameplay />
			</HorizontalCentre>
			<BottomSegment>
				<LoZSSLiveSplit />
			</BottomSegment>
			<FullBorder />
		</SpeedrunContainer>
	);
};

createRoot(document.getElementById("root")!).render(<Speedrun />);
