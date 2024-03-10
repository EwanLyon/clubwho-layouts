import React, { useState } from 'react';
import { render } from 'react-dom';
// import styled from 'styled-components';

import { TextField, Button, ThemeProvider } from '@mui/material';
import theme from './dashboard-style';

export const LiveSplit: React.FC = () => {
	const [fileLoc, setFileLoc] = useState('');
	return (
		<ThemeProvider theme={theme}>
			<TextField label="LiveSplit File (.lss)" value={fileLoc} onChange={(e) => setFileLoc(e.target.value)} />
			<Button
				disabled={fileLoc.substring(fileLoc.length - 4) !== '.lss'}
				variant="contained"
				onClick={() => nodecg.sendMessage('livesplit:loadSplits', fileLoc)}
			>
				Load
			</Button>
		</ThemeProvider>
	);
};

render(<LiveSplit />, document.getElementById('livesplit'));
