import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./glitch-text.less";

const offset1 = 2;
const offset2 = -2;
const highlight1 = "#49fc00";
const highlight2 = "#fc00a8";

const GlitchTextSpan = styled.span`
	text-transform: uppercase;
	position: relative;
	display: inline-block;

	&::before,
	&::after {
		content: ${(props: StyleProps) => props.glitchText};
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: black;
	}

	&::before {
		left: ${offset1}px;
		text-shadow: -2px 0 ${highlight1};
		clip: rect(24px, 550px, 90px, 0);
		animation: glitch-anim-2 15s infinite linear alternate-reverse;
	}

	&::after {
		left: ${offset2}px;
		text-shadow: -2px 0 ${highlight2};
		clip: rect(85px, 550px, 140px, 0);
		animation: glitch-anim 10s infinite linear alternate-reverse;
	}
`;

interface StyleProps {
	glitchText: string;
}

interface Props {
	text: string;
	animateChange: boolean;
	className?: string;
	style?: React.CSSProperties;
	id?: string;
}

// https://codepen.io/anatravas/pen/mOyNWR

export const GlitchText: React.FC<Props> = (props: Props) => {
	const [text, setText] = useState("Hello");
	const [tempNewText, setTempNewText] = useState("Hello");
	const [textIterations, setTextIterations] = useState(0);
	const [chosenIndexes, setChosenIndexes] = useState<number[]>([]);

	useEffect(() => {
		if (!props.animateChange) {
			setText(props.text);
			return;
		}

		if (text !== props.text) {
			setupText();
		}

		if (textIterations <= tempNewText.length) {
			setTimeout(() => {
				loopText();
				setTextIterations(textIterations + 1);
			});
		} else {
			setText(props.text);
			setChosenIndexes([]);
			setTextIterations(0);
			setTempNewText(props.text);
		}
	}, [props.animateChange, props.text, textIterations, text]);

	function setupText() {
		if (text.length < props.text.length) {
			setText(text.padEnd(props.text.length));
			setTempNewText(props.text);
		} else {
			setTempNewText(props.text.padEnd(text.length));
		}
	}

	function loopText() {
		let randomIndex = ~~(Math.random() * tempNewText.length);
		while (
			chosenIndexes.find((num) => {
				return num === randomIndex;
			})
		) {
			randomIndex = ~~(Math.random() * tempNewText.length);
		}

		let tempText = text.split("");
		tempText[randomIndex] = tempNewText[randomIndex];
		setText(tempText.join(""));
		setChosenIndexes([...chosenIndexes, randomIndex]);
	}

	// componentDidUpdate(prevProps: Readonly<Props>) {
	// 	if (!this.props.animateChange) {
	// 		if (this.state.textState !== this.props.text){
	// 			this.setState({textState: this.props.text});
	// 		}
	// 		return;
	// 	}

	// 	if (this.props.text !== prevProps.text) {
	// 		this.setupText();
	// 	}

	// 	if (this.state.textState === this.props.text) {
	// 		return;
	// 	}

	// 	if (this.textIterations <= this.tempNewText.length){
	// 		setTimeout(() => {
	// 			this.loopText();
	// 			this.textIterations++;
	// 			this.forceUpdate();
	// 		}, 250);
	// 	} else {
	// 		this.setState({textState: this.props.text});
	// 		this.chosenIndexs = [];
	// 		this.textIterations = 0;
	// 		this.tempNewText = this.props.text;
	// 	}
	// }

	return (
		<span className="glitch" glitch-text={props.text}>
			{text}
		</span>
	);
};
