# JIRA OAuth 1.0 Example

This example simulates a nodejs client retrieving a JIRA issue via Oauth. You connect your browser to the node server (running on port 3001 by default).
Go to /session/connect, you will be redirected to JIRA where you do the OAuth dance, JIRA redirects you to /session/callback and you get the OAuth access token.

## Prerequisites

- Follow the step in [https://developer.atlassian.com/server/jira/platform/oauth/](https://developer.atlassian.com/server/jira/platform/oauth/) to step 3.
- Modify `path/to/jira_privatekey.pem` in `app.js`
- Put you app consumer key in `<CONSUMER_KEY>` in `app.js`

## Quickstart

1. Download dependencies and start node server

```
npm install
npm start
```

2. Send GET request to '/session/connect' then you will be redirect to JIRA OAuth page

3. Click 'Allow' on the JIRA OAuth page and you will be redirected to '/session/callback/', which will show you `oauth_access_token` and `oauth_access_token_secret`

4. Put `oauth_access_token` and `oauth_access_token_secret` in `<OAUTH_ACCESS_TOKEN>`, `<OAUTH_ACCESS_TOKEN_SECRET>` in '/test'

5. Send POST request to '/test'. It will return the id of newly created issue to you!
