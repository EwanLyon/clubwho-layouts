import * as React from 'react';
import { render } from 'react-dom';
import { Spotify } from '../components/controls/spotify';
import { SocialMedia } from '../components/controls/socialmedia';
import 'typeface-roboto';
import {ThemeProvider} from '@material-ui/styles';
import dashboardTheme from '../dashboard-style';

const combination = (
	<ThemeProvider theme={dashboardTheme}>
		<SocialMedia />
		<Spotify />
	</ThemeProvider>
);

render(combination, document.getElementById('controls'));
