import * as React from 'react';
import { render } from 'react-dom';
import {} from '../../../../types/browser';
import './speedrun.scss';

import { Spotify } from './components/spotify/spotify';
import { SpotifySong } from '../types/spotify-song';

const spotifyRep = nodecg.Replicant<SpotifySong>('currentSong', 'ncg-spotify');

interface Props {}

interface State {
	song: SpotifySong;
}

export class Speedrun extends React.Component<Props, State> {
	private livesplitBorder: React.RefObject<HTMLDivElement>;

	constructor(props: Readonly<{}>) {
		super(props);
		this.state = {
			song: { name: '', artist: '', albumArt: '', playing: false }
		};
		this.livesplitBorder = React.createRef();
		this.updateLSHeight = this.updateLSHeight.bind(this);
	}

	componentDidMount() {
		spotifyRep.on('change', this.songChangeHandler);
		nodecg.listenFor('updateLivesplitHeight', this.updateLSHeight);
	}

	componentWillUnmount() {
		if (super.componentWillUnmount) {
			super.componentWillUnmount();
		}
		spotifyRep.removeListener('change', this.songChangeHandler);
	}

	songChangeHandler = (newVal: SpotifySong) => {
		this.setState({
			song: newVal
		});
	};

	updateLSHeight(height: number) {
		this.livesplitBorder.current!.style.height = `${height}px`;
	}

	render() {
		return (
			<div id="body">
				<Spotify
					id="spotify"
					song={this.state.song.name}
					artist={this.state.song.artist}
					playing={this.state.song.playing}
				/>
				<div id="social">
					<span>
						<img
							src={require('./assets/social/Twitter.svg')}
							id="twitter"
						/>
						CLUBWHOM
					</span>
					<span>
						<img
							src={require('./assets/social/YouTube.svg')}
							id="youtube"
							/>
						CLUBWHO
					</span>
					<span>
						<img
							src={require('./assets/social/Twitch.svg')}
							id="twitch"
							/>
						CLUBWHO
					</span>
				</div>
				<div className="horizontalCentre">
					<div className="vertical">
						<div id="webcamBox" className="border-box"></div>
						<div
							id="livesplitBorder"
							className="border-box"
							ref={this.livesplitBorder}
						/>
					</div>
					<div id="mainGameplay" className="border-box" />
				</div>

				<div id="fullBorder"></div>
			</div>
		);
	}
}

render(<Speedrun />, document.getElementById('speedrun'));
