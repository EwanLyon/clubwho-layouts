import React, { useImperativeHandle, useRef, useState } from "react";
import gsap from "gsap";
import styled from "styled-components";
import { useListenFor } from "@nodecg/react-hooks";

const HostContainer = styled.div`
	background: var(--main-col);
	border-left: 6px var(--blue) solid;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 5px 10px;
`;

const TopText = styled.div`
	font-size: 26px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;

	& > * {
		color: var(--text-secondary);
	}
`;

const HostName = styled.span`
	font-size: 38px;
`;

const Viewers = styled.span`
	margin-left: 15px;
	white-space: nowrap;
`;

export interface HostFuncs {
	show(data: { name: string; viewers: number }): void;
}

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const Host = React.forwardRef<HostFuncs, Props>((props, ref) => {
	const [name, setName] = useState("");
	const [viewers, setViewers] = useState(0);
	const hostRef = useRef<HTMLDivElement>(null);

	useListenFor("host", (data: { name: string; viewers: number }) => {
		show(data);
		nodecg.playSound("host");
	});

	useImperativeHandle(ref, () => ({
		show: (data: { name: string; viewers: number }) => {
			show(data);
		},
	}));

	function show(data: { name: string; viewers: number }) {
		if (!hostRef.current) return;

		setName(data.name);
		setViewers(data.viewers);

		const computedRight = window.getComputedStyle(hostRef.current).getPropertyValue("right");
		const calculatedLeft = parseFloat(computedRight) + 1926;
		const tl = gsap.timeline();

		tl.to(hostRef.current, {
			duration: 1,
			left: calculatedLeft,
			ease: "power4.out",
		});

		tl.to(
			hostRef.current,
			{
				duration: 1,
				left: 1926,
				ease: "power4.out",
			},
			"+=10",
		);
	}

	return (
		<HostContainer ref={hostRef} className={props.className} style={props.style}>
			<TopText>
				<span>HOST</span>
				<Viewers>{viewers} Viewers</Viewers>
			</TopText>
			<HostName>{name}</HostName>
		</HostContainer>
	);
});
