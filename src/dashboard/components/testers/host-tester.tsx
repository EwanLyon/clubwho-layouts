import * as React from "react";
import { Button, TextField } from "@mui/material";

interface Props {}
interface State {
	name: string;
	viewers: string;
}

export class HostTest extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { name: "Clubwho", viewers: "1000" };
		this.nameChange = this.nameChange.bind(this);
		this.viewersChange = this.viewersChange.bind(this);
		this.testHost = this.testHost.bind(this);
	}

	nameChange(e: any) {
		this.setState({ name: e.currentTarget.value });
	}

	viewersChange(e: any) {
		this.setState({ viewers: e.currentTarget.value });
	}

	testHost() {
		nodecg.sendMessage("host", {
			name: this.state.name,
			viewers: this.state.viewers,
		});
	}

	render() {
		return (
			<fieldset>
				<legend>Host</legend>
				<TextField label="Name" value={this.state.name} onChange={this.nameChange} variant="filled" />
				<TextField label="Viewers" value={this.state.viewers} onChange={this.viewersChange} variant="filled" />
				<Button variant="contained" onClick={this.testHost}>
					Host
				</Button>
			</fieldset>
		);
	}
}
