import * as React from 'react';
import { render } from 'react-dom';
import {} from '../../../../types/browser';
import './basic-overlay.scss';

import { GenericBox } from './components/generic-box/generic-box';
import { Host } from './components/host/host';


interface Props {}

interface State {}

export class BasicOverlay extends React.Component<Props, State> {
	private followerElement: React.RefObject<GenericBox>;
	private hostElement: React.RefObject<Host>;

	constructor(props: Readonly<{}>) {
		super(props);
		this.followerElement = React.createRef();
		this.hostElement = React.createRef();
	}

	componentDidMount() {
		nodecg.listenFor('newFollower', this.followerHandler);
		nodecg.listenFor('host', this.hostHandler);
	}

	componentWillUnmount() {
		if (super.componentWillUnmount) {
			super.componentWillUnmount();
		}
	}

	followerHandler = (follower: string) => {
		this.followerElement.current!.show(follower);
	};

	hostHandler = (data: { name: string; viewers: number }) => {
		this.hostElement.current!.show({
			name: data.name,
			viewers: data.viewers
		});
	};

	render() {
		return (
			<div id="body">
				<div id="centre">
					<GenericBox
						ref={this.followerElement}
						borderColour="#ffff57"
						startText="NEW FOLLOWER"
						width={500}
					/>
				</div>

				<Host id="host" ref={this.hostElement} />
			</div>
		);
	}
}

render(<BasicOverlay />, document.getElementById('basic-overlay'));
