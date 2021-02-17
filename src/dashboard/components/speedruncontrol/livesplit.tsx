import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {} from '../../../../../../types/browser';

interface Props {}
interface State {
	height: string;
}

export class LiveSplit extends React.Component<Props, State> {
	constructor(props: Readonly<Props>) {
		super(props);
		this.heightChange = this.heightChange.bind(this);
		this.updateLivesplitHeight = this.updateLivesplitHeight.bind(this);
		this.state = { height: '644'};
	}

	heightChange(e: any) {
		this.setState({ height: e.currentTarget.value });
	}

	updateLivesplitHeight() {
		nodecg.sendMessage('updateLivesplitHeight', parseFloat(this.state.height));
	}

	render() {
		return (
			<div>
				<TextField
					label="LiveSplit Height (644 Max)"
					value={this.state.height}
					onChange={this.heightChange}
					variant="filled"
				/>
				<Button variant="contained" onClick={this.updateLivesplitHeight}>
					Update
				</Button>
			</div>
		);
	}
}
