import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import { LiveSplit } from './components/livesplit/livesplit';

const SpeedrunNewContainer = styled.div``;

export const SpeedrunNew: React.FC = () => {

	return (
		<SpeedrunNewContainer>
			<LiveSplit />
		</SpeedrunNewContainer>
	);
};

render(<SpeedrunNew />, document.getElementById('speedrun-new'));
