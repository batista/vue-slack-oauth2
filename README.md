# vue-slack-oauth2
Handling Slack sign-in and sign-out for Vue.js applications.

![npm bundle size](https://img.shields.io/batisa/minzip/vue-slack-oauth2.svg)
![GitHub](https://img.shields.io/github/license/batista/vue-slack-oauth2.svg)
![vue-slack-oauth2](https://img.shields.io/npm/dt/vue-slack-oauth2.svg)

Very much inspired by [vue-google-oauth2](https://github.com/guruahn/vue-google-oauth2/)

## Installation
### Installation with npm
```
npm install @batista/vue-slack-oauth2
```

### Installation with yarn
```
yarn add @batista/vue-slack-oauth2
```

## Initialization
```javascript
//src/main.js
import SlackAuth from 'vue-slack-oauth2'
const slackAuthOption = {
  clientId: 'CLIENT_ID',
  scope: 'profile email',
  prompt: 'select_account'
}
Vue.use(SlackAuth, slackAuthOption)

```

## Options
| Property     | Type     | Required        | Description     |
|--------------|----------|-----------------|-----------------|
| clientId     | String   | Required.       | The app's client ID, found and created in the Slack API. |
| scope        | String   | Optional.       | Default value is `profile email`.|

## Methods
| Property     | Description        | Type     |
|--------------|--------------------|----------|
| SlackAuth   | return of  | Object |
| isAuthorized | Whether or not you have auth | Boolean  |
| isInit       | Whether or not api init | Boolean  |
| isLoaded     | Whether or not api init. will be deprecated. | Function  |
| signIn       | function for sign-in | Function  |
| getAuthCode  | function for getting authCode | Function  |
| signOut      | function for sign-out | Function  |


## Usages
### Getting authorization code
The `authCode` that is being returned is the `one-time code` that you can send to your backend server, so that the server can exchange for its own access_token and refresh_token.

The `access_token` and `refresh_token` can be saved in backend storage for reuse and refresh. In this way, you can avoid exposing your api key or secret key whenever you need to use various APIs.

```javascript
const authCode = await this.$slackAuth.getAuthCode()
const response = await this.$http.post('http://your-backend-server-api-to-use-authcode', { code: authCode, redirect_uri: 'postmessage' })
```

### Sign-in: Directly get back the `access_token` and `id_token`

```javascript
const slackUser = await this.$slackAuth.signIn()
// slackUser.getId() : Get the user's unique ID string.
// slackUser.getBasicProfile() : Get the user's basic profile information.
// slackUser.getAuthResponse() : Get the response object from the user's auth session. access_token and so on
this.isSignIn = this.$slackAuth.isAuthorized

```

refer to [slack signIn reference](https://api.slack.com/authentication/sign-in-with-slack)


### Sign-out
Handling Slack sign-out
```javascript
const response = await this.$slackAuth.signOut()
```

## Extra - Directly get `access_token` and `refresh_token` on Server-side
To get `access_token` and `refresh_token` in server side, the data for `redirect_uri` should be `postmessage`. `postmessage` is magic value for `redirect_uri` to get credentials without actual redirect uri.

### Curl
```
curl -d "client_id=YOUR_CLIENT_ID&\
  client_secret=YOUR_CLIENT_SECRET&\
  redirect_uri=postmessage&\
  grant_type=authorization_code&\
  code=YOUR_AUTH_CODE" https://slack.com/api/openid.connect.token
```

### Sample Code
- [Golang Sample Code](https://github.com/batista/vue-slack-oauth2/blob/master/backend-samples/golang/main.go)
- [Python Sample Code](https://github.com/batista/vue-slack-oauth2/blob/master/backend-samples/python/main.py)
<!-- - [Front Sample Code](https://github.com/batista/vue-slack-oauth2-front-sample) -->

## Additional Help
- [sample login page HTML file](https://github.com/batista/vue-slack-oauth2/blob/master/sample.html).
- [Slack API Auth](https://api.slack.com/authentication/sign-in-with-slack)

## FAQ
### The failure of initialization happens
You can check the brower console to check errors which occur during initialization.
The most of errors are from inproper setting of slack oauth2 credentials setting in your Slack App configurations.
After changing the settings, you have to do hard refresh to clear your caches.

### Type Errors
Follow the documentation provided [here](https://vuejs.org/v2/guide/typescript.html#Augmenting-Types-for-Use-with-Plugins) to add `$slackAuth` as a property for preventing lint errors.

## Acknowledgements 
This Package was greatly inspired by @guruahn work on his [vue-google-oauth2](https://github.com/guruahn/vue-google-oauth2/) package, many thanks for his work. 🙏

