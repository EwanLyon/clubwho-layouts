import React, { useImperativeHandle, useRef, useState } from "react";
import gsap from "gsap";
import styled from "styled-components";
import { useListenFor } from "@nodecg/react-hooks";

const FollowContainer = styled.div`
	background: var(--main-col);
	width: 0px;
	height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	text-align: center;
	position: absolute;
	bottom: -100px;
	border-left-width: 6px;
	border-right-width: 6px;
	border-top-width: 0;
	border-bottom-width: 0;
	border-style: solid;
	border-color: ${(props: StyleProps) => props.borderCol ?? "#fff"};
`;

const Text = styled.span`
	font-weight: 700;
	font-size: 34px;
	margin: 0 5px;
	white-space: nowrap;
	transform-origin: center;
	margin-left: -100%;
	margin-right: -100%;
`;

interface StyleProps {
	borderCol?: string;
}

interface Props {
	startText: string;
	width: number;
	borderColour: string;
	className?: string;
	style?: React.CSSProperties;
}

export interface FollowFuncs {
	show(text: string): void;
}

export const Follow = React.forwardRef<FollowFuncs, Props>((props, ref) => {
	const [currentText, setCurrentText] = useState(props.startText);
	const boxRef = useRef<HTMLDivElement>(null);

	useListenFor("newFollower", (follower: string) => {
		show(follower);
	});

	useImperativeHandle(ref, () => ({
		show(text) {
			show(text);
		},
	}));

	function show(text?: string) {
		if (!boxRef.current) return;

		setCurrentText(props.startText);

		const tl = gsap.timeline();
		const boxElement = boxRef.current;

		// Show label
		tl.to(boxElement, { duration: 2, y: -300, ease: "elastic.out(0.8, 0.4)" });

		// Open name
		tl.to(boxElement, { duration: 0.5, width: 300 });
		tl.to(
			boxElement,
			{
				duration: 1,
				width: 0,
				ease: "elastic.out(0.8, 0.4)",
				onComplete: () => {
					// Change text
					if (text) setCurrentText(text);
				},
			},
			"+=1.5",
		);
		tl.to(boxElement, { duration: 0.5, width: props.width }, "+=0.05");
		// Close name
		tl.to(boxElement, { duration: 1, width: 0, ease: "elastic.out(0.8, 0.4)" }, "+=4");

		tl.to(boxElement, { duration: 1, y: 300, ease: "elastic.out(0.8, 0.4)" });
	}

	return (
		<FollowContainer borderCol={props.borderColour} ref={boxRef} className={props.className} style={props.style}>
			<Text>{currentText}</Text>
		</FollowContainer>
	);
});
