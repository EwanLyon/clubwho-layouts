import * as React from "react";
import { Button, TextField } from "@mui/material";

interface Props {}
interface State {
	name: string;
}

export class FollowTest extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { name: "Clubwho" };
		this.inputChange = this.inputChange.bind(this);
		this.testFollow = this.testFollow.bind(this);
	}

	inputChange(e: any) {
		this.setState({ name: e.currentTarget.value });
	}

	testFollow() {
		nodecg.sendMessage("newFollower", this.state.name);
	}

	render() {
		return (
			<fieldset>
				<legend>Follow</legend>
				<TextField label="Name" value={this.state.name} onChange={this.inputChange} variant="filled" />
				<Button variant="contained" onClick={this.testFollow}>
					Follow
				</Button>
			</fieldset>
		);
	}
}
