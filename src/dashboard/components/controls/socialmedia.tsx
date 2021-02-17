import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {} from '../../../../../../types/browser';

interface Props {}
interface State {
	duration: string;
	interval: string;
}

export class SocialMedia extends React.Component<Props, State> {
	constructor(props: Readonly<Props>) {
		super(props);
		this.durationChange = this.durationChange.bind(this);
		this.intervalChange = this.intervalChange.bind(this);
		this.showSocial = this.showSocial.bind(this);
		this.toggleInterval = this.toggleInterval.bind(this);
		this.state = { duration: '5', interval: '5' };
	}

	durationChange(e: any) {
		this.setState({ duration: e.currentTarget.value });
	}

	intervalChange(e: any) {
		this.setState({ interval: e.currentTarget.value });
	}

	showSocial() {
		nodecg.sendMessage('showSocialMedia', parseFloat(this.state.duration));
	}

	toggleInterval(e: any) {
		nodecg.sendMessage('changeSocialMediaInterval', {clock: e.currentTarget.checked, interval: parseFloat(this.state.interval)});
	}

	render() {
		return (
			<div>
				<span>Social Media</span>
				<TextField
					label="Duration"
					value={this.state.duration}
					onChange={this.durationChange}
					variant="filled"
				/>
				<Button variant="contained" onClick={this.showSocial}>
					Show
				</Button>
				<FormControlLabel
					label="Auto clock"
					labelPlacement="start"
					control={<Checkbox onChange={this.toggleInterval} />}
				/>
				<TextField
					label="Interval"
					value={this.state.interval}
					onChange={this.intervalChange}
					variant="filled"
				/>
			</div>
		);
	}
}
