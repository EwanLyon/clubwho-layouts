import * as React from "react";
import { Button, TextField } from "@mui/material";

interface Props {}
interface State {
	name: string;
	artist: string;
}

export class SpotifyTest extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { name: "Divinity", artist: "Porter Robinson" };
		this.nameChange = this.nameChange.bind(this);
		this.artistChange = this.artistChange.bind(this);
		this.testSong = this.testSong.bind(this);
	}

	nameChange(e: any) {
		this.setState({ name: e.currentTarget.value });
	}

	artistChange(e: any) {
		this.setState({ artist: e.currentTarget.value });
	}

	testSong() {
		nodecg.sendMessage("newSong", {
			name: this.state.name,
			artist: this.state.artist,
		});
	}

	render() {
		return (
			<fieldset>
				<legend>Spotify</legend>
				<TextField label="Song" value={this.state.name} onChange={this.nameChange} variant="filled" />
				<TextField label="Artist" value={this.state.artist} onChange={this.artistChange} variant="filled" />
				<Button variant="contained" onClick={this.testSong}>
					Spotify
				</Button>
			</fieldset>
		);
	}
}
