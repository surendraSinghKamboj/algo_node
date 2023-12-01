const { api_key, api_secret } = require("../config/keys");
const { tokenUrl } = require("../config/config");
const UpstoxClient = require("upstox-js-sdk");
const defaultClient = UpstoxClient.ApiClient.instance;

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
  let dashboardData = {};

  let OAUTH2 = defaultClient.authentications["OAUTH2"];
  OAUTH2.accessToken = req.cookies.access_token;

  let apiInstance = new UpstoxClient.UserApi();
  let apiVersion = "2.0"; // String | API Version Header

  apiInstance.getProfile(apiVersion, (error, data, response) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error fetching profile data");
      return;
    }

    // Store the profile data in dashboardData
    dashboardData.profile = data.data;

    // Log the dashboardData
    // console.log("Profile Data:", dashboardData.profile);

    let opts = {
      segment: "SEC", // String |
    };
    // apiInstance.getUserFundMargin(apiVersion, opts, (error, data, response) => {
    //   if (error) {
    //     console.error(error);
    //     res.status(500).send("Error fetching fund data");
    //     return;
    //   }

    //   // Store the fund data in dashboardData as a string
    //   const fund = JSON.stringify(data);
    //   // console.log("stringify Fund : ", fund);
    //   const newFund = JSON.parse(fund);

    //   // Log the dashboardData with fund data as a parsed JavaScript object
    //   // console.log("parsed fund : ", newFund.data.equity);
    //   dashboardData.fund = newFund.data.equity;

    //   // console.log(dashboardData);

    //   // Render the view after getting the data
    // });
    res.render("dashboard", { dashboardData });
  });
};

module.exports = { index, login, dashboard };
