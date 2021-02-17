import * as React from 'react';
import './glitch-text.less';

interface Props {
	text: string;
	animateChange: boolean;
	id?: string;
}

interface State {
	textState: string;
}

// https://codepen.io/anatravas/pen/mOyNWR

export class GlitchText extends React.Component<Props, State> {
	private tempNewText: string;
	private textIterations: number;
	private chosenIndexs: number[];

	constructor(props: Readonly<Props>) {
		super(props);
		this.state = { textState: 'Hello'}
		this.tempNewText = this.state.textState;
		this.textIterations = 0;
		this.chosenIndexs = [];

		this.setupText = this.setupText.bind(this);
		this.loopText = this.loopText.bind(this);
	}

	setupText() {
		if (this.state.textState.length < this.props.text.length) {
			this.setState({textState: this.state.textState.padEnd(this.props.text.length)});
			this.tempNewText = this.props.text;
		} else {
			this.tempNewText = this.props.text.padEnd(this.state.textState.length);
		}
	}

	loopText(){
		let randomIndex = ~~(Math.random() * this.tempNewText.length);
		while (this.chosenIndexs.find((num) => {
			return num == randomIndex;
		})) {
			randomIndex = ~~(Math.random() * this.tempNewText.length);
		}

		let tempText = this.state.textState.split('');
		tempText[randomIndex] = this.tempNewText[randomIndex];
		this.setState({textState: tempText.join('')});
		this.chosenIndexs.push(randomIndex);
	}

	componentDidUpdate(prevProps: Readonly<Props>) {
		if (!this.props.animateChange) {
			if (this.state.textState !== this.props.text){
				this.setState({textState: this.props.text});
			}
			return;
		}

		if (this.props.text !== prevProps.text) {
			this.setupText();
		}

		if (this.state.textState === this.props.text) {
			return;
		}

		if (this.textIterations <= this.tempNewText.length){
			setTimeout(() => {
				this.loopText();
				this.textIterations++;
				this.forceUpdate();
			}, 250);
		} else {
			this.setState({textState: this.props.text});
			this.chosenIndexs = [];
			this.textIterations = 0;
			this.tempNewText = this.props.text;
		}
	}

	render() {
		return (
			<span id={this.props.id} className="glitch" glitch-text={this.props.text}>{this.state.textState}</span> 
		)
	}
}
