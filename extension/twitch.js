"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("./nodecg-api-context"));
const twitchAuthGet = tslib_1.__importStar(require("./twitch-auth"));
const chat_1 = require("@twurple/chat");
const eventsub_1 = require("@twurple/eventsub");
const eventsub_ngrok_1 = require("@twurple/eventsub-ngrok");
const nodecg = nodecgApiContext.get();
const twitchAuth = twitchAuthGet.getRefreshingAuth();
const twitchApiAuth = twitchAuthGet.getApiAuth();
twitchApiAuth.eventSub.deleteAllSubscriptions();
const twitchChatRep = nodecg.Replicant('twitch:chat', { defaultValue: [], persistent: false });
const chatClient = new chat_1.ChatClient({ authProvider: twitchAuth, channels: ['clubwho'], readOnly: true });
chatClient.connect();
const ngrokAdapter = new eventsub_ngrok_1.NgrokAdapter();
const twitchEvents = new eventsub_1.EventSubListener({ apiClient: twitchApiAuth, adapter: ngrokAdapter, secret: nodecg.bundleConfig.twitch.apiSecret });
ngrokAdapter.getHostName().then(hostname => {
    ngrokAdapter.getListenerPort().then(listenerPort => {
        nodecg.log.info(`ngrok Server: ${hostname}:${listenerPort}`);
    });
});
chatClient.onMessage((_channel, _user, _message, msg) => {
    twitchChatRep.value.push(msg);
});
chatClient.onRaid((channel, user, raidInfo) => {
    if (channel !== 'clubwho') {
        nodecg.log.info(`Got a raid but wasn't for you... ${channel} | ${user} | ${JSON.stringify(raidInfo)}`);
    }
    nodecg.log.info(`Raid: ${user} with ${raidInfo.viewerCount}`);
    nodecg.sendMessage('raid', { name: user, viewers: raidInfo.viewerCount });
});
twitchEvents.listen();
const userID = '24537920';
twitchEvents.subscribeToChannelFollowEvents(userID, e => {
    nodecg.log.info(`Follower: ${e.userName}`);
    nodecg.sendMessage('newFollower', e.userName);
});
twitchEvents.subscribeToChannelSubscriptionEvents(userID, e => {
    nodecg.log.info(`New Tier ${e.tier} Sub: ${e.userName}`);
    nodecg.sendMessage('newSub', e.userName);
});
// interface NCGStreamLabs {
// 	type: string;
// 	message: {
// 		id: string;
// 		name: string;
// 		when?: string;
// 		viewers?: number;
// 		message?: string;
// 		months?: number;
// 	};
// }
// nodecg.listenFor('twitch-event', 'nodecg-streamlabs', (event: NCGStreamLabs) => {
// 	switch (event.type) {
// 		case 'follow':
// 			nodecg.log.info(`Follower: ${event.message.name}`);
// 			nodecg.sendMessage('newFollower', event.message.name);
// 			break;
// 		case 'host':
// 			nodecg.log.info(`Host: ${event.message.name} with ${event.message.viewers}`);
// 			nodecg.sendMessage('host', {name: event.message.name, viewers: event.message.viewers});
// 			break;
// 		default:
// 			nodecg.log.info(`Other event: ${JSON.stringify(event)}`);
// 			break;
// 	}
// });
