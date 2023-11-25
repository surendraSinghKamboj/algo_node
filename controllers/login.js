const { api_key } = require("../config/keys");

const login = (req, res) => {
  const redirectUri = encodeURIComponent("http://localhost:4444/login");
  const authUrl = `https://api-v2.upstox.com/login/authorization/dialog?response_type=code&client_id=${api_key}&redirect_uri=${redirectUri}`;
  res.redirect(authUrl);
};

module.exports = { login };
