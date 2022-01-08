import * as nodecgApiContext from './nodecg-api-context';
import { AccessToken, ClientCredentialsAuthProvider, RefreshingAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
// import axios from 'axios';

const nodecg = nodecgApiContext.get();
const clientID = <string>nodecg.bundleConfig.twitch.clientID;
const clientSecret = <string>nodecg.bundleConfig.twitch.clientSecret;
// const firstRequestCode = <string>nodecg.bundleConfig.firstRequestCode;
const accessTokenRep = nodecg.Replicant<AccessToken>('twitch:accessToken', {defaultValue: {accessToken: '', expiresIn: 0, obtainmentTimestamp: 0, refreshToken: '', scope: []}, persistent: true});

// Get access token -- Borked right now, just do it manually

// Manual URL
// https://id.twitch.tv/oauth2/authorize?client_id=CLIENT_ID&redirect_uri=http://localhost:9090/login/auth/twitch&response_type=code&scope=chat:read+user:read:email+channel:read:subscriptions
// axios.post(`https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&code=${firstRequestCode}&grant_type=authorization_code&redirect_uri=http://localhost:9090/login/auth/twitch`).then(res => {
// 	accessTokenRep.value.accessToken = res.data.access_token;
// 	accessTokenRep.value.refreshToken = res.data.refresh_token;
// 	accessTokenRep.value.expiresIn = res.data.expires_in;
// });

const authProvider = new RefreshingAuthProvider({clientId: clientID, clientSecret: clientSecret, onRefresh: newToken => accessTokenRep.value = newToken}, accessTokenRep.value);

const apiAuth = new ClientCredentialsAuthProvider(clientID, clientSecret);
const apiClient = new ApiClient({authProvider: apiAuth});

export function getRefreshingAuth(): RefreshingAuthProvider {
	return authProvider;
}

export function getApiAuth(): ApiClient {
	return apiClient;
}
