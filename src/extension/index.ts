'use strict';
// NodeCG
import { NodeCG } from '../../../../types/server'
// import { inspect } from 'util';

interface NCGStreamLabs {
	type: string;
	message: Message;
}

interface Message {
	id: string;
	name: string;
	when?: string;
	viewers?: number;
	message?: string;
	months?: number;
}

module.exports = (nodecg: NodeCG) => {
	nodecg.log.info('Working')

	nodecg.listenFor('twitch-event', 'nodecg-streamlabs', (event: NCGStreamLabs) => {
		switch (event.type) {
			case 'follow':
				nodecg.log.info(`Follower: ${event.message.name}`);
				nodecg.sendMessage('newFollower', event.message.name);
				break;
			case 'host':
				nodecg.log.info(`Host: ${event.message.name} with ${event.message.viewers}`);
				nodecg.sendMessage('host', {name: event.message.name, viewers: event.message.viewers});
				break;

			default:
				nodecg.log.info(`Other event: ${JSON.stringify(event)}`);
				break;
		}
	})
};
