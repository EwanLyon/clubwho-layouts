import * as React from 'react';
import { TimelineLite, Power4 } from 'gsap';
import './socialmedia.scss';

interface Props {
	id: string
}

interface State {
	interval: number
}

export class SocialMedia extends React.Component<Props, State> {
	private socialMediaElement = React.createRef<HTMLDivElement>();
	private interval: NodeJS.Timeout;

	constructor(props: Readonly<Props>) {
		super(props);
		this.state = {interval: 5};
		this.interval = setInterval(() => {}, 100000000)
		this.setInterval = this.setInterval.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	show(duration: number, forever = false) {
		console.log(`Showing for ${duration} second/s`);
		const tl = new TimelineLite();
		tl.to(this.socialMediaElement.current!, 1, {
			x: 680,
			ease: Power4.easeOut
		});
		
		if (forever) {
			return;
		}

		tl.to(
			this.socialMediaElement.current!,
			1,
			{ x: 0, ease: Power4.easeIn },
			`+=${duration}`
		);
	}

	setInterval(interval: number) {
		console.log(`Setting interval to ${interval} minute(s)`)
		this.setState({interval: interval});
		this.interval = setInterval(() => this.show(8), this.state.interval * 60000)
	}

	componentDidMount() {
		this.interval = setInterval(() => this.show(8), this.state.interval * 60000)
	}

	componentWillUnmount() {
		this.removeInterval();
	}
	
	removeInterval() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<div className="socialMediaParent" ref={this.socialMediaElement} id={this.props.id}>
				<div className="social">
					<img src={require('../../assets/social/Twitch.svg')} />
					<span>CLUBWHO</span>
				</div>
				<div className="social">
					<img src={require('../../assets/social/Twitter.svg')} />
					<span>CLUBWHOM</span>
				</div>
				<div className="social">
					<img src={require('../../assets/social/YouTube.svg')} />
					<span>CLUBWHO</span>
				</div>
			</div>
		);
	}
}
