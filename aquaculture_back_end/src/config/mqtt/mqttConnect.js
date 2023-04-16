class MQTTClient {
  static #instance;
  static #initialize = false;

  constructor() {
    if (!MQTTClient.#initialize) {
      throw new Error("The constructor is private, please use getInstance.");
    }

    this.defineField();
    this.client.on("connect", () => {
      this.feeds_key.forEach((feed) => {
        this.client.subscribe(`ThinhNguyen1801/feeds/${feed}`);
      });
    });

    MQTTClient.#initialize = false;
  }

  static getInstance() {
    if (!this.#instance) {
      MQTTClient.#initialize = true;
      this.#instance = new MQTTClient();
    }
    return this.#instance;
  }

  defineField() {
    this.feeds = [
      "Temperature",
      "LuX",
      "Humidity",
      "Pump",
      "OxygenPump"
    ];
    this.feeds_key = ["temperature", "lux", "humidity", "oxygenpump", "pump"];
    this.moment = require("moment");
    this.mqtt = require("mqtt");
    this.username = "ThinhNguyen1801";
    this.port = 1883;
    this.key = "aio_VPQb11qVCR4GHRwVmz496Sy7lsqk";
    this.url = `mqtts://${this.username}:${this.key}@io.adafruit.com`;
    this.client = this.mqtt.connect(this.url, this.port);
  }

  on(event, callback) {
    this.client.on(event, callback);
  }

  subscribe(topic) {
    this.client.subscribe(topic);
  }

  publish(topic, message) {
    this.client.publish(topic, message);
  }
}

module.exports = MQTTClient;
