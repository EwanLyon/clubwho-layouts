import * as React from 'react';
import { TimelineLite, Power4 } from 'gsap';
import './host.scss';

interface Props {
	id: string
}

interface State {
	name: string;
	viewers: number;
}

export class Host extends React.Component<Props, State> {
	private hostElement = React.createRef<HTMLDivElement>();

	constructor(props: Readonly<Props>) {
		super(props);
		this.state = { name: '', viewers: 0 };
	}

	show(data: { name: string; viewers: number }) {
		this.setState({
			name: data.name,
			viewers: data.viewers
		});

		const tl = new TimelineLite();
		const computedRight = window
			.getComputedStyle(this.hostElement.current!)
			.getPropertyValue('right');
		const calculatedLeft = parseFloat(computedRight) + 1926;
		tl.to(this.hostElement.current!, 1, {
			left: calculatedLeft,
			ease: Power4.easeOut
		});

		this.hide();
	}

	hide() {
		const tl = new TimelineLite();
		tl.to(
			this.hostElement.current!,
			1,
			{ left: 1926, ease: Power4.easeOut },
			'+=4'
		);
	}

	render() {
		return (
			<div ref={this.hostElement} className="hostBody" id={this.props.id}>
				<div className="topText">
					<span>HOST</span>
					<span className="textRight" id="viewersText">
						{this.state.viewers} Viewers
					</span>
				</div>
				<span className="hostName">{this.state.name}</span>
			</div>
		);
	}
}
