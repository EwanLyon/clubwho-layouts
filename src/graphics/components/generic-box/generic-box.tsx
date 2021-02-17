import * as React from 'react';
import {TimelineLite, Elastic} from 'gsap';
import './generic-box.scss'

interface Props {
	startText: string,
	width: number,
	borderColour: string
}

interface State {
	currentText: string
}



export class GenericBox extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {currentText: props.startText}
	}
	
	private box = React.createRef<HTMLDivElement>();

	show(text?: string) {
		this.setState({
			currentText: this.props.startText
		});

		const tl = new TimelineLite();
		const boxElement = this.box.current!;
	
		// Show label
		tl.to(boxElement, 2, { y: -300, ease: Elastic.easeOut.config(0.3, 0.4) });
	
		// Open name
		tl.to(boxElement, 0.5, { width: 300 });
		tl.to(boxElement, 1, {
			width: 0,
			ease: Elastic.easeIn.config(0.3, 0.4),
			onComplete: () => {
				// Change text
				if (text) {
					this.setState({
						currentText: text.toUpperCase()
					});
				}
			}
		}, '+=1.5');
		tl.to(boxElement, 0.5, { width: this.props.width }, '+=0.05');
		// Close name
		tl.to(boxElement, 1, { width: 0, ease: Elastic.easeIn.config(0.3, 0.4) }, '+=4');
	
		tl.to(boxElement, 1, { y: 300, ease: Elastic.easeIn.config(0.3, 0.4) });
	}
	
	render() {
		const borderStyle: React.CSSProperties = {
			borderLeftWidth: 6,
			borderRightWidth: 6,
			borderTopWidth: 0,
			borderBottomWidth: 0,
			borderStyle: "solid",
			borderColor: this.props.borderColour
		}
		return (
			<div ref={this.box} id="follower" className="generic-box" style={borderStyle}>
				<span className="generic-box-text">{this.state.currentText}</span>
			</div>
		);
	}
}
