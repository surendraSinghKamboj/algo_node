const { api_key, api_secret } = require("../config/keys");
const { tokenUrl } = require("../config/config");

const index = (req, res) => {
  res.render("index");
};

const login = async (req, res) => {
  const code = req.query.code;
  if (code) {
    console.log("first", code);
    const tokenData = {
      code: code,
      client_id: api_key,
      client_secret: api_secret,
      redirect_uri: "http://localhost:4444/login",
      grant_type: "authorization_code",
    };

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Api-Version": "2.0",
        },
        body: new URLSearchParams(tokenData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        res.cookie("access_token", responseData.access_token, {
          httpOnly: true,
        });
        res.redirect("/dashboard");
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`, response);
      }
    } catch (error) {
      console.error(error);
      res.render("error");
    }
  }
  // res.render("login", { code });
};

const dashboard = (req, res) => {
  res.render("dashboard");
};

module.exports = { index, login, dashboard };
