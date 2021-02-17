import * as React from 'react';
import { render } from 'react-dom';
import 'typeface-roboto';
import {ThemeProvider} from '@material-ui/styles';
import dashboardTheme from '../dashboard-style';
import { LiveSplit } from '../components/speedruncontrol/livesplit';

const combination = (
	<ThemeProvider theme={dashboardTheme}>
		<LiveSplit />
	</ThemeProvider>
);

render(combination, document.getElementById('speedrun-controls'));
