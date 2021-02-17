'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (nodecg) => {
    nodecg.log.info('Working');
    nodecg.listenFor('twitch-event', 'nodecg-streamlabs', (event) => {
        switch (event.type) {
            case 'follow':
                nodecg.log.info(`Follower: ${event.message.name}`);
                nodecg.sendMessage('newFollower', event.message.name);
                break;
            case 'host':
                nodecg.log.info(`Host: ${event.message.name} with ${event.message.viewers}`);
                nodecg.sendMessage('host', { name: event.message.name, viewers: event.message.viewers });
                break;
            default:
                nodecg.log.info(`Other event: ${JSON.stringify(event)}`);
                break;
        }
    });
};
