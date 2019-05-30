/** This is step 3: Authorize to call JIRA API
 *  in the https://developer.atlassian.com/server/jira/platform/oauth/
 **/

const express = require("express");
const session = require("express-session");
const fs = require("fs");
const OAuth = require("oauth");

const app = express();
app.use(session({ secret: "123456", resave: false, saveUninitialized: true }));
const privateKeyData = fs.readFileSync("path/to/jira_privatekey.pem", "utf8");

const host = "http://localhost:3001";
const jira_host = "http://localhost:8080";
const oauth_resource = "/plugins/servlet/oauth";

const oauth = new OAuth.OAuth(
  `${jira_host}${oauth_resource}/request-token`,
  `${jira_host}${oauth_resource}/access-token`,
  "<CONSUMER_KEY>",
  "<CONSUMER_SECRET>",
  "1.0",
  `${host}/sessions/callback`,
  "RSA-SHA1",
  null,
  privateKeyData
);

/**
 * OAuth 1.0 Flow
 */
app.get("/sessions/connect", (req, res) => {
  oauth.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
    if (error) {
      res.send("Error getting request token");
    } else {
      req.session.oauthAccessToken = oauthToken;
      req.session.oauthAccessTokenSecret = oauthTokenSecret;
      res.redirect(
        `${jira_host}${oauth_resource}/authorize?oauth_token=${oauthToken}`
      );
    }
  });
});

app.get("/sessions/callback", (req, res) => {
  oauth.getOAuthAccessToken(
    req.session.oauthAccessToken,
    req.session.oauthAccessTokenSecret,
    req.query.oauth_verifier,
    (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
      if (error) {
        res.send("Error getting access token");
      } else {
        res.send(
          `oauth_access_token = ${oauthAccessToken}, oauth_access_token_secret =  ${oauthAccessTokenSecret}`
        );
      }
    }
  );
});

/**
 * Test JIRA API to create issue
 * You can find more information about JIRA API at
 * https://developer.atlassian.com/server/jira/platform/jira-rest-api-examples/
 */
app.post("/test", (req, res) => {
  const bodyData = {
    fields: {
      project: {
        key: "API1"
      },
      summary: "Create by API",
      description:
        "Creating of an issue using project keys and issue type names using the REST API",
      issuetype: {
        name: "Task"
      }
    }
  };
  oauth.post(
    `${jira_host}/rest/api/2/issue`,
    "<OAUTH_ACCESS_TOKEN>",
    "<OAUTH_ACCESS_TOKEN_SECRET>",
    JSON.stringify(bodyData),
    "application/json",
    (error, data) => {
      data = JSON.parse(data);
      res.send(data.key);
    }
  );
});

/**
 * If you want to send the request from Postman use below code
 * to create Authorization header.
 */
// console.log(
//     oauth._buildAuthorizationHeaders(
//       oauth._prepareParameters(
//         "<OAUTH_ACCESS_TOKEN>",
//         "<OAUTH_ACCESS_TOKEN_SECRET>",
//         "POST",
//         "http://localhost:8080/rest/api/2/issue",
//         null,
//         bodyData
//       )
//     )
//   );

app.listen(parseInt(process.env.PORT || 3001));
