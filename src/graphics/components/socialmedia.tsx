import React, { useEffect, useRef, useImperativeHandle } from "react";
import gsap from "gsap";
import styled from "styled-components";
import { useListenFor } from "@nodecg/react-hooks";

const SocialMediaContainer = styled.div`
	background: var(--main-col);
	height: 65px;
	width: fit-content;
	display: flex;
	align-items: center;
	padding-left: 20px;
	border-right: 6px var(--red) solid;

	position: absolute;
	right: 1926px;
`;

const SocialContainer = styled.div`
	display: flex;
	align-items: center;
	height: 100%;
`;

const SocialImage = styled.img`
	height: 60%;
	width: auto;
	filter: drop-shadow(0px 0px 5px var(--glow));
`;

const SocialName = styled.span`
	margin: 0 25px 0 10px;
	font-size: 25px;
	font-weight: 600;
	text-shadow: 0px 0px 3px var(--glow);
`;

interface Props {
	intervalSpeed?: number;
	className?: string;
	style?: React.CSSProperties;
}

export interface SocialMediaFuncs {
	show(duration: number, forever?: boolean): void;
}

export const SocialMedia = React.forwardRef<SocialMediaFuncs, Props>((props, ref) => {
	const socialMediaRef = useRef<HTMLDivElement>(null);

	useListenFor("showSocialMedia", (duration: number) => {
		show(duration);
	});

	useImperativeHandle(ref, () => ({
		show: (duration: number, forever = false) => {
			show(duration, forever);
		},
	}));

	function show(duration: number, forever = false) {
		if (!socialMediaRef.current) return;
		console.log(`Showing for ${duration} second/s`);
		const tl = gsap.timeline();
		tl.to(socialMediaRef.current, {
			duration: 1,
			x: 680,
			ease: "power4.out",
		});

		if (forever) return;

		tl.to(socialMediaRef.current, { duration: 1, x: 0, ease: "power4.in" }, `+=${duration}`);
	}

	useEffect(() => {
		const automatedShowing = setTimeout(() => {
			show(10);
		}, props.intervalSpeed || 300 * 1000);

		return () => {
			clearTimeout(automatedShowing);
		};
	}, [props.intervalSpeed]);

	return (
		<SocialMediaContainer ref={socialMediaRef} className={props.className} style={props.style}>
			<SocialContainer>
				<SocialImage src={require("../assets/social/Twitch.svg")} />
				<SocialName>CLUBWHO</SocialName>
			</SocialContainer>
			<SocialContainer>
				<SocialImage src={require("../assets/social/Twitter.svg")} />
				<SocialName>CLUBWHOM</SocialName>
			</SocialContainer>
			<SocialContainer>
				<SocialImage src={require("../assets/social/YouTube.svg")} />
				<SocialName>CLUBWHO</SocialName>
			</SocialContainer>
		</SocialMediaContainer>
	);
});
