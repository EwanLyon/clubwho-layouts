import * as React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

const BioImage = styled.div`
	width: 320px;
	height: 100px;
	background: $primary;
	background-image: url("./assets/tv-scanline.png");
	background-repeat: repeat;
	border: 1px $accent-blue solid;
	box-shadow: inset 0px 0px 10px $accent-blue;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 50px;
	font-weight: 600;
`;

const TwitchAssets: React.FC = () => {
	return (
		<>
			<BioImage>ABOUT ME</BioImage>
			<BioImage>SOCIAL</BioImage>
			<BioImage>PC SPECS</BioImage>
			<BioImage>SCHEDULE</BioImage>
			<BioImage>RULES</BioImage>
			<BioImage>DONATE</BioImage>
		</>
	);
};

createRoot(document.getElementById("root")!).render(<TwitchAssets />);
