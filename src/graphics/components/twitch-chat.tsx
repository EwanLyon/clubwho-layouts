import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';

const TwitchChatContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 0 8px;
	overflow: scroll;
	scroll-behavior: smooth;
	/* scroll- */

	&::-webkit-scrollbar {
		display: none;
	}
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const TwitchChat: React.FC<Props> = (props: Props) => {
	const twitchContainerRef = useRef<HTMLDivElement>(null);
	const [chatRep] = useReplicant<TwitchPrivateMessage[], TwitchPrivateMessage[]>('twitch:chat', []);
	console.log(chatRep);
	useEffect(() => {
		if (!twitchContainerRef.current) return;
		twitchContainerRef.current.scrollTop = twitchContainerRef.current.scrollHeight;
	}, [twitchContainerRef, chatRep])

	return (
		<TwitchChatContainer className={props.className} style={props.style} ref={twitchContainerRef}>
			{chatRep.map((message, i) => (
				<TwitchChatMessage key={i} msg={message} />
			))}
		</TwitchChatContainer>
	);
};

const TwitchChatMessageContainer = styled.div`
	display: flex;
	align-items: center;
	min-height: 28px;
	margin: 2px 0;
	/* white-space: pre-wrap; */
`;

const TwitchChatUsername = styled.span`
	font-weight: bold;
	margin-right: 8px;
`;

const TwitchEmote = styled.img`
	height: 28px;
	width: 28px;
`;

const TwitchChatText = styled.span`
`;

interface Message {
	msg: Record<string, any>;
}

const colorRegex = new RegExp(/color=(#.{6})/);
const displayNameRegex = new RegExp(/display-name=([a-zA-Z0-9_]{4,25});/);
const TwitchChatMessage: React.FC<Message> = (props: Message) => {
	const colour = colorRegex.exec(props.msg._raw)?.[1];
	return (
		<TwitchChatMessageContainer>
			<TwitchChatUsername style={{ color: colour }}>{displayNameRegex.exec(props.msg._raw)?.[1]}</TwitchChatUsername>
			<TwitchChatText>{...parseEmotes(props.msg._raw, props.msg.content.value)}</TwitchChatText>
		</TwitchChatMessageContainer>
	);
};

const emoteRegex = new RegExp(/emotes=([a-z0-9:\-/_,]*);/);

function parseEmotes(rawMessage: string, content: string): (string | JSX.Element)[] {
	// Get emotes from IRC data
	const emoteExec = emoteRegex.exec(rawMessage);
	const emoteRaw = emoteExec?.[1]!;
	if (emoteRaw === '') return [content];

	// Get each emote
	const emotesSplit = emoteRaw.split('/');
	const emoteObj: {id: string, start: number, end: number}[] = [];

	// Create an object for each emote with its ID, start and end
	emotesSplit.forEach((emote) => {
		const [id, offsets] = emote.split(':');
		offsets.split(',').forEach((offset) => {
			const [startOffset, endOffset] = offset.split('-');
			emoteObj.push({ id, start: parseInt(startOffset), end: parseInt(endOffset) + 1 });
		});
	});

	emoteObj.sort((a, b) => a.start - b.start);

	let newMsg: (string | JSX.Element)[] = [];

	// Include the start of the sentence
	if (emoteObj[0].start !== 0) {
		newMsg.push(<span style={{whiteSpace: 'pre-wrap'}}>{content.substring(0, emoteObj[0].start)}</span>);
	}

	// Add the emote and add the characters between each emote
	for (let i = 0; i < emoteObj.length; i++) {
		const start = emoteObj[i].end;
		const end = i + 1 >= emoteObj.length ? content.length : emoteObj[i + 1].start;
		newMsg.push(<TwitchEmote src={`http://static-cdn.jtvnw.net/emoticons/v2/${emoteObj[i].id}/default/dark/1.0`} />);
		newMsg.push(<span style={{whiteSpace: 'pre-wrap'}}>{content.substring(start, end).replace(/\s\s+/g, ' ')}</span>);
	}

	return newMsg;
}
