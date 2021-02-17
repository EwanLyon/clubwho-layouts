import * as React from 'react';
import './spotify.scss';
import { TimelineLite, Power4 } from 'gsap';

interface Props {
	id?: string;
	song: string;
	artist: string;
	playing: boolean;
}

interface States {
	isShowing: boolean;
	persistent: boolean;
	currentSongName: string;
	currentSongArtist: string;
}

export class Spotify extends React.Component<Props, States> {
	private songParent = React.createRef<HTMLDivElement>();

	constructor(props: Readonly<Props>) {
		super(props);
		this.togglePersistence = this.togglePersistence.bind(this);
		this.changeSong = this.changeSong.bind(this);
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this.state = {
			isShowing: props.playing,
			persistent: true,
			currentSongName: props.song,
			currentSongArtist: props.artist
		};
	}

	togglePersistence(persistentToggle: boolean) {
		this.setState({ persistent: persistentToggle });
		if (persistentToggle) {
			if (!this.state.isShowing) {
				this.show();
			}
		} else {
			if (this.state.isShowing) {
				this.hide();
			}
		}
	}

	componentDidMount() {
		if (this.state.persistent || this.state.isShowing) {
			this.show();
		} else {
			this.hide();
		}
	}

	shouldComponentUpdate(nextProps: Readonly<Props>) {
		if (
			nextProps.song == this.props.song &&
			nextProps.playing == this.props.playing
		) {
			return false;
		}

		// Hide/Show when playing or paused
		if (nextProps.playing != this.props.playing) {
			if (nextProps.playing && this.state.persistent) {
				this.show();
			} else {
				this.hide();
			}
		}

		// Change song
		if (nextProps.song != this.props.song) {
			this.changeSong(nextProps);
		}

		return true;
	}

	// Cant remember what this does
	componentDidUpdate() {
		if (this.props.playing == false) {
			return;
		}

		if (!this.state.isShowing) {
			this.show();
		}
		if (!this.state.persistent) {
			this.hide();
		}
	}

	show() {
		const tl = new TimelineLite();
		const calculatedLeft =
			parseFloat(
				window
					.getComputedStyle(this.songParent.current!)
					.getPropertyValue('right')
			) + 1926;
		tl.to(this.songParent.current!, 1, {
			left: calculatedLeft,
			ease: Power4.easeOut
		});
		this.setState({ isShowing: true });

		return tl;
	}

	hide() {
		if (!this.state.isShowing) {
			return;
		}
		const tl = new TimelineLite();
		tl.to(this.songParent.current!, 1, {
			left: 1926,
			ease: Power4.easeOut
		});
		this.setState({ isShowing: false });

		return tl;
	}

	changeSong(nextProps: Readonly<Props>) {
		console.log('Changing songs', nextProps, this.props.song);
		const tl = new TimelineLite();
		tl.to(this.songParent.current!, 1, {
			left: 1926,
			ease: Power4.easeOut,
			onComplete: () => {
				this.setState({
					currentSongName: nextProps.song,
					currentSongArtist: nextProps.artist
				});
				this.forceUpdate();
				this.show();
			}
		});
	}

	render() {
		return (
			<div id={this.props.id} ref={this.songParent} className="spotifyParent">
				<span id="spotifySong">{this.state.currentSongName}</span>
				<span id="spotifyArtist">{this.state.currentSongArtist}</span>
			</div>
		);
	}
}
