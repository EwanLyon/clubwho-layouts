import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { useListenFor } from "@nodecg/react-hooks";

import { Follow, FollowFuncs } from "./components/follow";
import { Host, HostFuncs } from "./components/host";
import { SocialMedia, SocialMediaFuncs } from "./components/socialmedia";
import { Spotify, SpotifyFuncs } from "./components/spotify";

const FullCamContainer = styled.div`
	position: relative;
	height: 1080px;
	width: 1920px;
	border-bottom: 1px solid black;
	border-right: 1px solid black;
`;

const Centre = styled.div`
	width: 1920px;
	display: flex;
	justify-content: center;
`;

const Webcam = styled.div`
	position: absolute;
	top: 678px;
	right: 59px;
	width: 260px;
	height: 288px;
	border: 1px var(--blue) solid;
	box-shadow: 0px 0px 5px var(--blue);
`;

export const WidescreenNormal: React.FC = () => {
	const followerRef = useRef<FollowFuncs>(null);
	const hostRef = useRef<HostFuncs>(null);
	const socialMediaRef = useRef<SocialMediaFuncs>(null);
	const spotifyRef = useRef<SpotifyFuncs>(null);

	useListenFor("newFollower", (follower: string) => {
		if (followerRef.current) followerRef.current.show(follower);
		nodecg.playSound("follower");
	});

	useListenFor("showSocialMedia", (duration: number) => {
		if (socialMediaRef.current) socialMediaRef.current.show(duration);
	});

	return (
		<FullCamContainer>
			<Centre>
				<Follow ref={followerRef} borderColour="#ffff57" startText="NEW FOLLOWER" width={500} />
			</Centre>

			<Host ref={hostRef} style={{ position: "absolute", top: 40, left: 1926 }} />
			<SocialMedia intervalSpeed={300 * 1000} ref={socialMediaRef} style={{ position: "absolute", top: 40 }} />
			<Spotify ref={spotifyRef} />
			<Webcam />
		</FullCamContainer>
	);
};

createRoot(document.getElementById("root")!).render(<WidescreenNormal />);
