import * as React from 'react';
import { render } from 'react-dom';
import {ThemeProvider} from '@material-ui/styles';
import dashboardTheme from '../dashboard-style';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {} from '../../../../../types/browser';

interface Props {}
interface State {
	time: number;
	text: string;
}

export class Countdown extends React.Component<Props, State> {
	constructor(props: Readonly<Props>) {
		super(props);
		this.timeChange = this.timeChange.bind(this);
		this.textChange = this.textChange.bind(this);
		this.startCountdown = this.startCountdown.bind(this);
		this.state = { time: 300, text: "STREAM WILL START SOON" };
	}

	timeChange(e: any) {
		this.setState({ time: e.currentTarget.value });
	}

	
	textChange(e: any) {
		this.setState({ text: e.currentTarget.value });
	}

	startCountdown() {
		nodecg.sendMessage('updateCountdownTime', {time: this.state.time, text: this.state.text});
	}

	stopCountdown(){
		nodecg.sendMessage('updateCountdownTime', -1);
	}

	render() {
		return (
			<ThemeProvider theme={dashboardTheme}>
				<TextField
					label="Seconds"
					value={this.state.text}
					onChange={this.textChange}
					variant="filled"
				/>
				<TextField
					label="Seconds"
					value={this.state.time}
					onChange={this.timeChange}
					variant="filled"
				/>
				<Button variant="contained" onClick={this.startCountdown}>
					Start
				</Button>
				<Button variant="contained" onClick={this.stopCountdown}>
					Stop
				</Button>
			</ThemeProvider>
		);
	}
}

render(<Countdown />, document.getElementById('countdown'));