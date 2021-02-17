import * as React from 'react';
import { render } from 'react-dom';
import {} from '../../../../types/browser';
import './countdown.scss';

import { GlitchText } from './components/glitch-text/glitch-text';
import { SpotifySong } from '../types/spotify-song';

const spotifyRep = nodecg.Replicant<SpotifySong>('currentSong', 'ncg-spotify');

interface Props {}

interface State {
	time: number;
	song: SpotifySong;
	text: string;
}

export class Countdown extends React.Component<Props, State> {
	private formattedTime: string = '03:00';

	constructor(props: Props) {
		super(props);
		this.state = {
			time: 300,
			song: { name: '', artist: '', albumArt: '', playing: false },
			text: 'STREAM WILL START SOON'
		};
		this.runCountdown = this.runCountdown.bind(this);
		this.updateCountdown = this.updateCountdown.bind(this);
		setInterval(this.runCountdown, 1000);
	}

	songChangeHandler = (newVal: SpotifySong) => {
		this.setState({
			song: newVal
		});
	};

	componentDidMount() {
		nodecg.listenFor('updateCountdownTime', this.updateCountdown);
		spotifyRep.on('change', this.songChangeHandler);
	}

	componentWillUnmount() {
		if (super.componentWillUnmount) {
			super.componentWillUnmount();
		}
		spotifyRep.removeListener('change', this.songChangeHandler);
	}

	updateCountdown = (data: { time: number; text: string }) => {
		this.setState({ time: data.time, text: data.text });
	};

	runCountdown() {
		if (this.state.time <= -1) {
			this.formattedTime = '00:00';
		}
		let mins = ~~(this.state.time / 60);
		let seconds = this.state.time - 60 * mins;
		let formattedMins = ('0' + mins).slice(-2);
		let formattedSeconds = ('0' + seconds).slice(-2);
		this.setState({ time: this.state.time - 1 });
		this.formattedTime = `${formattedMins}:${formattedSeconds}`;
	}

	render() {
		let spotifyElement;

		if (this.state.song.playing) {
			spotifyElement = (
				<div id="spotify" className="countdownBlock">
					<div id="spotifyText">
						<GlitchText
							text={this.state.song.name}
							animateChange={true}
							id="songTitle"
						/>
						<span id="songArtist">{this.state.song.artist}</span>
					</div>
					<img id="spotifyImg" src={this.state.song.albumArt}/>
				</div>
			);
		} else {
			spotifyElement = <div></div>;
		}
		return (
			<div id="body">
				<div id="blocks">
					<span id="title" className="countdownBlock">
						{this.state.text}
					</span>

					<div id="time" className="countdownBlock">
						<GlitchText
							text={this.formattedTime}
							animateChange={false}
							id="time"
						/>
					</div>

					<div id="social" className="countdownBlock">
						<div id="socialMedia">
							<span>
								CLUBWHOM
								<img
									src={require('./assets/social/Twitter_col.svg')}
									id="twitter"
								/>
							</span>
							<span>
								CLUBWHO
								<img
									src={require('./assets/social/YouTube_col.svg')}
									id="youtube"
								/>
							</span>
							<span>
								CLUBWHO
								<img
									src={require('./assets/social/Twitch_col.svg')}
									id="twitch"
								/>
							</span>
						</div>
					</div>

					{spotifyElement}
				</div>

				<div id="redLine"></div>
			</div>
		);
	}
}

render(<Countdown />, document.getElementById('countdown'));
