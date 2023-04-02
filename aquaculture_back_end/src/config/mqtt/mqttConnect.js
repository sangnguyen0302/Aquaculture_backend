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
        this.client.subscribe(`zyrene/feeds/${feed}`);
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
      "Humidity"
    ];
    this.feeds_key = ["temperature", "lux", "humidity"];
    this.moment = require("moment");
    this.mqtt = require("mqtt");
    this.username = "zyrene";
    this.port = 1883;
    this.key = "aio_boeq6547HgdG5JhXf7ExO2X4ocUH";
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
