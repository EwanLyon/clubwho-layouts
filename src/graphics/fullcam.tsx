import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

import { Follow } from "./components/follow";
import { Host } from "./components/host";
import { SocialMedia } from "./components/socialmedia";
import { Spotify } from "./components/spotify";

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

export const FullCam: React.FC = () => {
	return (
		<FullCamContainer>
			<Centre>
				<Follow borderColour="#ffff57" startText="NEW FOLLOWER" width={500} />
			</Centre>

			<Host style={{ position: "absolute", top: 40, left: 1926 }} />
			<SocialMedia style={{ position: "absolute", top: 40 }} />
			<Spotify />
		</FullCamContainer>
	);
};

createRoot(document.getElementById("fullcam")!).render(<FullCam />);
