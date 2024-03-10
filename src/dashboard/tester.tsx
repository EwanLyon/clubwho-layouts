import * as React from 'react';
import { render } from 'react-dom';
import { FollowTest } from './components/testers/follow-tester';
import { HostTest } from './components/testers/host-tester';
import { SpotifyTest } from './components/testers/spotify-tester';
import 'typeface-roboto';
import { ThemeProvider } from '@mui/material/styles';
import dashboardTheme from './dashboard-style';

const combination = (
	<ThemeProvider theme={dashboardTheme}>
		<FollowTest />
		<HostTest />
		<SpotifyTest />
	</ThemeProvider>
);

render(combination, document.getElementById('tester'));
