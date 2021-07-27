import React from 'react';
import styled from 'styled-components';

import Particles from 'react-tsparticles';

const ChatBoxContainer = styled.div`
	position: relative;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const ChatBox: React.FC<Props> = (props: Props) => {
	return (
		<ChatBoxContainer className={props.className} style={props.style}>
			<Particles
				options={{
					autoPlay: true,
					background: {
						opacity: 0,
					},
					duration: 0,
					fpsLimit: 60,
					motion: {
						disable: false,
						reduce: {
							factor: 4,
							value: true,
						},
					},
					particles: {
						collisions: {
							enable: true,
							mode: 'bounce',
							overlap: {
								enable: true,
								retries: 0,
							},
						},
						color: {
							value: '#f00',
							animation: {
								h: {
									count: 0,
									enable: true,
									offset: 0,
									speed: 50,
									sync: false,
								},
								s: {
									count: 0,
									enable: false,
									offset: 0,
									speed: 1,
									sync: true,
								},
								l: {
									count: 0,
									enable: false,
									offset: 0,
									speed: 1,
									sync: true,
								},
							},
						},
						links: {
							blink: false,
							color: {
								value: 'random',
							},
							consent: false,
							distance: 150,
							enable: true,
							frequency: 1,
							opacity: 1,
							shadow: {
								blur: 5,
								color: {
									value: '#00ff00',
								},
								enable: false,
							},
							triangles: {
								enable: false,
								frequency: 1,
							},
							width: 1,
							warp: false,
						},
						move: {
							angle: {
								offset: 0,
								value: 90,
							},
							decay: 0,
							distance: {},
							direction: 'none',
							drift: 0,
							enable: true,
							outModes: {
								default: 'bounce',
								bottom: 'bounce',
								left: 'bounce',
								right: 'bounce',
								top: 'bounce',
							},
							random: false,
							size: false,
							speed: 0.2,
							straight: false,
							vibrate: false,
							warp: false,
						},
						number: {
							value: 25,
						},
						opacity: {
							random: {
								enable: true,
								minimumValue: 0.3,
							},
							value: {
								min: 0.3,
								max: 0.8,
							},
							animation: {
								count: 0,
								enable: true,
								speed: 0.5,
								sync: false,
								destroy: 'none',
								minimumValue: 0.3,
								startValue: 'random',
							},
						},
						reduceDuplicates: false,
						roll: {
							darken: {
								enable: false,
								value: 0,
							},
							enable: false,
							enlighten: {
								enable: false,
								value: 0,
							},
							speed: 25,
						},
						shape: {
							type: 'circle',
						},
						size: {
							random: {
								enable: true,
								minimumValue: 1,
							},
							value: {
								min: 1,
								max: 3,
							},
							animation: {
								count: 0,
								enable: true,
								speed: 3,
								sync: false,
								destroy: 'none',
								minimumValue: 1,
								startValue: 'random',
							},
						},
						tilt: {
							random: {
								enable: false,
								minimumValue: 0,
							},
							value: 0,
							animation: {
								enable: false,
								speed: 0,
								sync: false,
							},
							direction: 'clockwise',
							enable: false,
						},
						zIndex: {
							random: {
								enable: false,
								minimumValue: 0,
							},
							value: 0,
							opacityRate: 1,
							sizeRate: 1,
							velocityRate: 1,
						},
					}
				}}
			/>
		</ChatBoxContainer>
	);
};
