const path = require("path");
const express = require("express");
const session = require("express-session");
const socketio = require("socket.io");
const http = require("http");
const app = express();
const port = 4001;
const db = require("./config/db");
const server = http.createServer(app);
const io = socketio(server);
const route = require("./routes/index");
const methodOverride = require("method-override");
const cors = require("cors");
const { default: fetch } = require("node-fetch");
const mqttclient_ = require("../src/config/mqtt/mqttConnect");


const mqttclient = mqttclient_.getInstance();

let temp_min = 0.0;
let temp_max = 0.0;
let hum_min = 0.0;
let hum_max = 0.0;
let light_min = 0.0;
let light_max = 0.0;


function saveDeviceHistory(name, data_str, data) {
  fetch(`http://localhost:4001/saveDeviceHistory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      history: {
        time: new Date().toLocaleString(),
        status: data == data_str ? false : true,
      },
    }),
  });
}

function notifyMessage(title, msg, type) {
  fetch("http://localhost:4001/notification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      time: new Date().toLocaleString(),
      content: msg,
      type: type,
      title: title
    }),
  });
}

db.connect();

async function getThreshold() {
  let res = await fetch("http://localhost:4001/threshold");
  let data = await res.json();
  data.map((item) => {
    if (item.type == "temp") {
      temp_min = item.min;
      temp_max = item.max;
    } else if (item.type == "humidity") {
      hum_min = item.min;
      hum_max = item.max;
    } else if (item.type == "lux") {
      light_min = item.min;
      light_max = item.max;
    }
  });
}

getThreshold();
mqttclient.on("message", (topic, message) => {
  const feed = topic.split("/")[2];
  let data = message.toString();
  if (feed == "temperature" && (parseFloat(data) < temp_min || parseFloat(data) > temp_max)) {
    let msg = `Nhiệt độ vượt quá khoảng cho phép từ ${temp_min} đến ${temp_max}, giá trị vượt ngưỡng là ${message}`;
    notifyMessage('Nhiệt độ quá ngưỡng', msg, 1);
  } else if (feed == "humidity" && (parseFloat(data) < hum_min || parseFloat(data) > hum_max)) {
    let msg = `Độ ẩm vượt quá khoảng cho phép từ ${hum_min} đến ${hum_max}, giá trị vượt ngưỡng là ${message}`;
    notifyMessage('Độ ẩm quá ngưỡng', msg, 1);
  } else if (feed == "lux" && (parseFloat(data) < light_min || parseFloat(data) > light_max)) {
    let msg = `Ánh sáng vượt quá khoảng cho phép từ ${light_min} đến ${light_max}, giá trị vượt ngưỡng là ${message}`;
    notifyMessage('Ánh sáng quá ngưỡng', msg, 1);
  } else if (feed == "oxygenpump") {
    let msg = `Máy bơm oxy vừa được thay đổi giá trị thành:  ${data}`;
    notifyMessage('Điều khiển máy sục Oxy', msg, 0);
    console.log(msg);
  } else if (feed == "pump") {
    let msg = `Bơm nước vừa được thay đổi giá trị thành:  ${data}`;
    notifyMessage('Điều khiển máy bơm nước', msg, 0);
    console.log(msg);
  }
});
app.use(
  session({
    secret: "somethingsecret",
    resave: true,
    saveUninitialized: false,
  })
);

app.use(methodOverride("_method"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cors());

route(app);

server.listen(port, () => {
  console.log(`Aquaculture program app listening at http://localhost:${port}`);
});
