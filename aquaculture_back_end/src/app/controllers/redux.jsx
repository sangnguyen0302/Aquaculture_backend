const mqttclient_ = require("../../config/mqtt/mqttConnect");
const mqttclient = mqttclient_.getInstance();
const fetch = require('node-fetch');

async function getDaydata(feed) {
    const url = `https://io.adafruit.com/api/v2/ThinhNguyen1801/feeds/${feed}/data?limit=20`;
    const response = await fetch(url);
    const data = await response.json();
    let result = {
        title: data[0].feed_key,
        value: data[0].value,
        label: data.map(i => i.created_at.substring(i.created_at.indexOf('T') + 1, i.created_at.indexOf('Z'))),
        data: data.map(i => i.value)
    }
    return result;
}
async function getPumpAPI() {
    const url = 'https://io.adafruit.com/api/v2/ThinhNguyen1801/feeds/pump/data?limit=1';
    const response = await fetch(url);
    const data = await response.json();
    const rs = await data[0].value;
    return rs;
}
async function setPumpDevice(value) {
    let x = 'ThinhNguyen1801/feeds/pump'
    await mqttclient.publish(x, value);
    return;
}
async function setOxygenPumpDevice(value) {
    let x = 'ThinhNguyen1801/feeds/oxygenPump'
    await mqttclient.publish(x, value);
    return;
}
async function getOxygenPumpAPI() {
    const url = 'https://io.adafruit.com/api/v2/ThinhNguyen1801/feeds/oxygenpump/data?limit=1';
    const response = await fetch(url);
    const data = await response.json();
    const rs = await data[0].value;
    return rs;
}
module.exports = {
    getPumpAPI,
    setPumpDevice,
    setOxygenPumpDevice,
    getOxygenPumpAPI,
    getDaydata
};