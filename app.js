// app.js

const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
bodyParser = require("body-parser");
const UpstoxClient = require("upstox-js-sdk");
const WebSocket = require("ws").WebSocket;
const protobuf = require("protobufjs");
const cookieParser = require("cookie-parser");
const viewRouter = require("./routes/view");
const authRouter = require("./routes/login");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

// Initialize global variables
let protobufRoot = null;
let defaultClient = UpstoxClient.ApiClient.instance;
let apiVersion = "2.0";
let OAUTH2 = defaultClient.authentications["OAUTH2"];
OAUTH2.accessToken = "waiting...."; 

const getMarketFeedUrl = async () => {
  return new Promise((resolve, reject) => {
    let apiInstance = new UpstoxClient.WebsocketApi(); // Create new Websocket API instance

    // Call the getMarketDataFeedAuthorize function from the API
    apiInstance.getMarketDataFeedAuthorize(
      apiVersion,
      (error, data, response) => {
        if (error) reject(error); // If there's an error, reject the promise
        else resolve(data.data.authorizedRedirectUri); // Else, resolve the promise with the authorized URL
      }
    );
  });
};

// Function to decode protobuf message
const decodeProfobuf = (buffer) => {
  if (!protobufRoot) {
    console.warn("Protobuf part not initialized yet!");
    return null;
  }

  const FeedResponse = protobufRoot.lookupType(
    "com.upstox.marketdatafeeder.rpc.proto.FeedResponse"
  );
  return FeedResponse.decode(buffer);
};

function handleMessage(data) {
  const decodedMessage = decodeProfobuf(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      // Assuming you want to send the decoded message as JSON to clients
      client.send(JSON.stringify(decodedMessage));
    }
  });
}

const connectWebSocket = async (wsUrl) => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl, {
      headers: {
        "Api-Version": apiVersion,
        Authorization: "Bearer " + OAUTH2.accessToken,
      },
      followRedirects: true,
    });

    // WebSocket event handlers
    ws.on("open", () => {
      console.log("connected");
      resolve(ws); // Resolve the promise once connected

      // Set a timeout to send a subscription message after 1 second
      setTimeout(() => {
        const data = {
          guid: "someguid",
          method: "sub",
          data: {
            mode: "full",
            instrumentKeys: ["NSE_INDEX|Nifty Bank", "NSE_INDEX|Nifty 50"],
          },
        };
        ws.send(Buffer.from(JSON.stringify(data)));
      }, 1000);
    });

    ws.on("close", () => {
      console.log("disconnected");
    });

    ws.on("message", handleMessage);

    ws.on("error", (error) => {
      console.log("error:", error);
      reject(error); // Reject the promise on error
    });
  });
};

// Function to initialize the protobuf part
const initProtobuf = async () => {
  protobufRoot = await protobuf.load(__dirname + "/MarketDataFeed.proto");
  console.log("Protobuf part initialization complete");
};

// Initialize the protobuf part and establish the WebSocket connection
// Wrap the code in a named async function
async function initializeMarketFeed() {
  try {
    await initProtobuf(); // Initialize protobuf
    const wsUrl = await getMarketFeedUrl(); // Get the market feed URL
    const ws = await connectWebSocket(wsUrl); // Connect to the WebSocket
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

wss.on("connection", (ws) => {
  console.log("A user connected");
  initializeMarketFeed();
});

app.post("/set_token", (req, res) => {
  const newToken = req.body.token;

  if (newToken) {
    OAUTH2.accessToken = newToken;
    return res.status(200).json({ status: true });
  } else {
    return res
      .status(400)
      .json({ status: false, message: "Token is missing in the request body" });
  }
});

app.use("", viewRouter);
app.use("/get", authRouter);

module.exports = { app, server };
