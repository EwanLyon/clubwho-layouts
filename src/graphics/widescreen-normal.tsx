import * as React from 'react';
import { render } from 'react-dom';
import {} from '../../../../types/browser';

import { GenericBox } from './components/generic-box/generic-box';
import { Spotify } from './components/spotify/spotify';
import { Host } from './components/host/host';
import { SocialMedia } from './components/socialmedia/socialmedia';

import './widescreen-normal.scss';

import { SpotifySong } from '../types/spotify-song';

const spotifyRep = nodecg.Replicant<SpotifySong>('currentSong', 'ncg-spotify');

interface Props {}

interface State {
	song: SpotifySong;
}

class WidescreenNormal extends React.Component<Props, State> {
	private spotifyElement: React.RefObject<Spotify>;
	private followerElement: React.RefObject<GenericBox>;
	private hostElement: React.RefObject<Host>;
	private socialMediaElement: React.RefObject<SocialMedia>;

	constructor(props: Props) {
		super(props);
		this.state = {
			song: { name: '', artist: '', albumArt: '', playing: false }
		};
		this.followerElement = React.createRef();
		this.hostElement = React.createRef();
		this.spotifyElement = React.createRef();
		this.socialMediaElement = React.createRef();
	}

	componentDidMount() {
		spotifyRep.on('change', this.songChangeHandler);
		nodecg.listenFor('newFollower', this.followerHandler);
		nodecg.listenFor('host', this.hostHandler);
		nodecg.listenFor('newSong', this.songTester);
		nodecg.listenFor('changeSpotifyPersistent', this.spotifyPersistence);
		nodecg.listenFor('spotifyManual', this.spotifyManual);
		nodecg.listenFor('showSocialMedia', this.showSocialMedia);
		nodecg.listenFor('changeSocialMediaInterval', this.changeSocialMediaInterval);
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

	songTester = (data: { name: string; artist: string }) => {
		const fixedSong: SpotifySong = { ...data, albumArt: '', playing: true };
		this.songChangeHandler(fixedSong);
	};

	spotifyManual = (show: boolean) => {
		if (show) {
			this.spotifyElement.current!.show();
		} else {
			this.spotifyElement.current!.hide();
		}
	};

	spotifyPersistence = (toggle: boolean) => {
		this.spotifyElement.current!.togglePersistence(toggle);
	};

	followerHandler = (follower: string) => {
		this.followerElement.current!.show(follower);
	};

	hostHandler = (data: { name: string; viewers: number }) => {
		this.hostElement.current!.show({
			name: data.name,
			viewers: data.viewers
		});
	};

	showSocialMedia = (duration: number) => {
		this.socialMediaElement.current!.show(duration);
	};

	changeSocialMediaInterval = (data: {clock: boolean, interval: number}) => {
		console.log('Changing interval', data)
		if (data.clock == true) {
			this.socialMediaElement.current!.setInterval(data.interval);
		} else {
			this.socialMediaElement.current!.removeInterval();
		}
	}

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

				<Spotify
					ref={this.spotifyElement}
					song={this.state.song.name}
					artist={this.state.song.artist}
					playing={this.state.song.playing}
				/>

				<SocialMedia id="socialMedia" ref={this.socialMediaElement} />

				<div id="webcam"></div>
			</div>
		);
	}
}

render(<WidescreenNormal />, document.getElementById('App'));
