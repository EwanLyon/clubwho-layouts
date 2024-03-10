import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";

import { SpotifySong } from "../types/spotify-song";

import { GlitchText } from "./components/glitch-text/glitch-text";

const CountdownContainer = styled.div`
	background: var(--main-col);
	background-image: ${require("./assets/tv-scanline.png")};
	background-repeat: repeat;
	width: 1918px;
	height: 1078px;
	box-shadow: inset 0 0 10px $glow;
	border: 1px var(--glow) solid;
	animation-name: bg;
	animation-duration: 5s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;

	& > span {
		text-shadow: 0px 0px 3px var(--glow);
	}
`;

const BlockContainer = styled.div`
	position: absolute;
	right: 230px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-end;
	height: 100%;

	& > * {
		background: rgba(0, 0, 0, 0.75);
		padding: 24px;
		margin: 10px 0;
		width: fit-content;
	}
`;

const SpotifyContainer = styled.div`
	display: flex;
`;

const SpotifyTextContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
`;

const SpotifyTitle = styled.div`
	font-size: 40px;
`;

const SpotifyArtist = styled.div`
	text-shadow: none;
	font-size: 20px;
	color: #7a7a7a;
`;

const SpotifyArt = styled.img`
	height: 70px;
	margin-left: 10px;
`;

const Time = styled.span`
	font-size: 144px;
	font-family: "RobotoMono";
`;

const Title = styled.span`
	font-size: 72px;
	display: block;
	text-align: right;
`;

const SocialMedia = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: flex-end;
	font-size: 25px;

	& > span {
		display: flex;
		align-items: center;
	}

	& > img {
		height: auto;
		width: 44px;
		margin-left: 9px;
	}
`;

const YoutubeImage = styled.img`
	margin-top: 22px;
	margin-bottom: 22px;
`;

const RedLine = styled.span`
	background: var(--red);
	position: absolute;
	top: 0;
	left: 1690px;
	height: 1080px;
	width: 6px;
`;

export const Countdown: React.FC = () => {
	const [currentSongRep] = useReplicant<SpotifySong>("currentSong", {
		namespace: "ncg-spotify",
	});
	const [text, setText] = useState("Stream starting soon");
	const [time, setTime] = useState(180);
	const [formattedTime, setFormattedTime] = useState("03:00");

	useListenFor("updateCountdownTime", (data: { time: number; text: string }) => {
		setTime(data.time);
		setText(data.text);
		setInterval(runCountdown, 1000);
	});

	function runCountdown() {
		if (time <= -1) {
			setFormattedTime("00:00");
		}
		let mins = ~~(time / 60);
		let seconds = time - 60 * mins;
		let formattedMins = ("0" + mins).slice(-2);
		let formattedSeconds = ("0" + seconds).slice(-2);
		setTime(time - 1);
		setFormattedTime(`${formattedMins}:${formattedSeconds}`);
	}

	return (
		<CountdownContainer>
			<BlockContainer>
				<Title>{text}</Title>

				<Time>
					<GlitchText text={formattedTime} animateChange={false} id="time" />
				</Time>

				<SocialMedia>
					<div id="socialMedia">
						<span>
							CLUBWHOM
							<img src={require("./assets/social/Twitter_col.svg")} />
						</span>
						<span>
							CLUBWHO
							<YoutubeImage src={require("./assets/social/YouTube_col.svg")} />
						</span>
						<span>
							CLUBWHO
							<img src={require("./assets/social/Twitch_col.svg")} />
						</span>
					</div>
				</SocialMedia>

				{currentSongRep && (
					<SpotifyContainer>
						<SpotifyTextContainer>
							<GlitchText text={currentSongRep.name} animateChange={true} id="songTitle" />
							<SpotifyArtist>{currentSongRep.artist}</SpotifyArtist>
						</SpotifyTextContainer>
						<SpotifyArt src={currentSongRep.albumArt} />
					</SpotifyContainer>
				)}
			</BlockContainer>

			<RedLine />
		</CountdownContainer>
	);
};

createRoot(document.getElementById("root")!, <Countdown />);
