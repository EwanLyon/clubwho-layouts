import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {} from '../../../../../../types/browser';

export class Spotify extends React.Component {
	toggleSpotify(event: React.ChangeEvent<HTMLInputElement>) {
		nodecg.sendMessage('changeSpotifyPersistent', event.target.checked);
	}

	showSpotify() {
		nodecg.sendMessage('spotifyManual', true);
	}

	hideSpotify() {
		nodecg.sendMessage('spotifyManual', false);
	}

	render() {
		return (
			<div>
				<FormControlLabel
					label="Spotify Persistent"
					labelPlacement="start"
					control={<Checkbox onChange={e => this.toggleSpotify(e)} />}
				/>
				<span>Spotify Buttons</span>
				<ButtonGroup>
					<Button variant="contained" onClick={this.showSpotify}>
						Show
					</Button>
					<Button variant="contained" onClick={this.hideSpotify}>
						Hide
					</Button>
				</ButtonGroup>
			</div>
		);
	}
}
