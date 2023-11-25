const axios = require("axios");
const querystring = require("querystring");

const apiKey = "7edef259-9172-47bb-8565-88335e96f50a";
const secretKey = "tta4ciro3y";
const redirectUri = encodeURIComponent("http://localhost:4444/login");

const authUrl = `https://api-v2.upstox.com/login/authorization/dialog?response_type=code&client_id=${apiKey}&redirect_uri=${redirectUri}`;

// Assuming you will get the authorization code from the user's input or another source
const authCode = '5YX1NE';

// Exchange the authorization code for an access token
const tokenUrl = 'https://api-v2.upstox.com/login/authorization/token';

const tokenData = {
  code: authCode,
  client_id: apiKey,
  client_secret: secretKey,
  redirect_uri: "http://localhost:4444/welcome",
  grant_type: 'authorization_code',
};

axios.post(tokenUrl, querystring.stringify(tokenData), {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Api-Version': '2.0',
  },
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error.response.data);
  });

console.log(authUrl);
