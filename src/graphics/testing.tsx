import * as React from 'react';
import { render } from 'react-dom';
import {} from '../../../../types/browser';

export class Testing extends React.Component {

	constructor(props: Readonly<{}>) {
		super(props);
	}


	render() {
		return <h1>Empty :(</h1>;
	}
}

render(<Testing/>, document.getElementById('testing'))