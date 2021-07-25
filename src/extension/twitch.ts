import * as nodecgApiContext from './nodecg-api-context';

const nodecg = nodecgApiContext.get();

interface NCGStreamLabs {
	type: string;
	message: {
		id: string;
		name: string;
		when?: string;
		viewers?: number;
		message?: string;
		months?: number;
	};
}

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
});
