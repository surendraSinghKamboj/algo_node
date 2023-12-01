function calculateChangePercent(previousClosed, currentPrice) {
  if (typeof previousClosed !== "number" || typeof currentPrice !== "number") {
    console.log(previousClosed,currentPrice)
    throw new Error("Both arguments must be numbers");
  }

  const change = currentPrice - previousClosed;
  const changePercent = (change / Math.abs(previousClosed)) * 100;

  return changePercent.toFixed(2);
}

function formatNumberWithTwoDecimals(value) {
  if (typeof value !== "number") {
    throw new Error("Input must be a number");
  }

  return value.toFixed(2);
}

const socket = new WebSocket("ws://localhost:4400");

      socket.addEventListener("open", (event) => {
        console.log("WebSocket connection opened");
      });

      socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "random number") {
          document.getElementById(
            "randomNumber"
          ).innerText = `Random Number: ${data}`;
        } else {
          const nifty_change = calculateChangePercent(data.feeds["NSE_INDEX|Nifty 50"]?.ff.indexFF.ltpc.cp, data.feeds["NSE_INDEX|Nifty 50"]?.ff.indexFF.ltpc.ltp);
          const nifty_bank_change = calculateChangePercent(data.feeds["NSE_INDEX|Nifty Bank"]?.ff.indexFF.ltpc.cp,data.feeds["NSE_INDEX|Nifty Bank"]?.ff.indexFF.ltpc.ltp);

          document.getElementById("nifty").innerText = formatNumberWithTwoDecimals(data.feeds["NSE_INDEX|Nifty 50"]?.ff.indexFF.ltpc.ltp);
          document.getElementById("nifty_change").innerText = nifty_change + "%";
          document.getElementById("nifty_bank").innerText = formatNumberWithTwoDecimals(data.feeds["NSE_INDEX|Nifty Bank"]?.ff.indexFF.ltpc.ltp);
          document.getElementById("nifty_bank_change").innerText = nifty_bank_change + "%";

          if (nifty_change<0) {
            document.getElementById("nifty_change").style.color="red"
            document.getElementById("nifty").style.color="red"
          }else{
            document.getElementById("nifty").style.color="#01f901"
            document.getElementById("nifty_change").style.color="#01f901"
          }

          if (nifty_bank_change<0) {
            document.getElementById("nifty_bank_change").style.color="red"
            document.getElementById("nifty_bank").style.color="red"
          }else{
            document.getElementById("nifty_bank").style.color="#01f901"
            document.getElementById("nifty_bank_change").style.color="#01f901"
          }
        }
      });

      socket.addEventListener("close", (event) => {
        console.log("WebSocket connection closed");
      });