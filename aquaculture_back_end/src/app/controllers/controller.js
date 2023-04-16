const User = require("../models/user")
const WeekRecord = require("../models/weekRecord")
const DayRecord = require("../models/dayRecord")
const PhysicalDevice = require("../models/physicaldevice")
const fetch = require("node-fetch")
const request = require("request")
const Threshold = require("../models/threshold")
const moment = require("moment")
const schedule = require("node-schedule")
const Notification = require("../models/notification")
const feeds = ["humidity", "lux", "temperature"]

const mqttclient_ = require("../../config/mqtt/mqttConnect")
const mqttclient = mqttclient_.getInstance()

class AppController {
	createUser(req, res, next) {
		User.findOne({ username: req.body.username }, (err, user) => {
			if (err) return res.status(500).json({ message: err })
			if (user) return res.status(400).json({ message: 'Username already exists!' })

			const newUser = new User({
				username: req.body.username,
				name: req.body.username,
				password: req.body.password
			})
			newUser.save((err, data) => {
				if (err) return res.status(500).json({ message: err })
				return res.status(200).json({ message: 'Created successfully', data: data })
			})
		})
	}

	getUser(req, res, next) {
		User.findOne({ username: req.body.username }, (err, user) => {
			if (err) return res.status(500).json({ message: err })
			if (!user) return res.status(400).json({ message: 'Username not found!' })

			if (user.password == req.body.password) return res.status(200).json({ message: 'Login successfully', user })
			else return res.status(400).json({ message: 'Password incorrect!' })
		})
	}

	logOut(req, res, next) {
		if (req.session) {
			req.session.destroy(function (err) {
				if (err) {
					return next(err)
				} else {
					return res.json("success")
				}
			})
		}
	}

	getThreshold(req, res, next) {
		Threshold.find()
			.lean()
			.then((threshold) => {
				res.json(threshold)
			})
			.catch((err) => {
				res.json(err)
			})
	}

	setThreshold(req, res, next) {
		let type = req.body.type
		let min = req.body.min
		let max = req.body.max
		Threshold.findOneAndUpdate(
			{ type: type },
			{ $set: { min: min, max: max } },
			{ new: true, upsert: true },
			(err, doc) => {
				if (err) {
					res.json(err)
				} else {
					res.json(doc)
				}
			}
		)
	}

	setNotification(req, res) {
		let newNotification = new Notification({
			title: req.body.title,
			time: req.body.time,
			content: req.body.content,
			type: req.body.type
		})
		newNotification
			.save()
			.then(() => res.status(200).json("success"))
			.catch((err) => res.json({ err: err }))
	}

	getNotification(req, res) {
		Notification.find()
			.lean()
			.then((notification) => {
				res.json(notification)
			})
			.catch((err) => {
				res.json(err)
			})
	}

	async getDataDevices(req, res, next) {
		const url = `https://io.adafruit.com/api/v2/ThinhNguyen1801/feeds/${req.body.name}/data?limit=20`
		const response = await fetch(url)
		const data = await response.json()
		let result = {
			title: data[0].feed_key,
			value: data[0].value,
			label: data.map(i => i.created_at.substring(i.created_at.indexOf('T') + 1, i.created_at.indexOf('Z'))),
			data: data.map(i => i.value)
		}
		return res.status(200).json(result)
	}

	async getDataPump(req, res, next) {
		const url = 'https://io.adafruit.com/api/v2/ThinhNguyen1801/feeds/pump/data?limit=1'
		const response = await fetch(url)
		const result = await response.json()
		return res.status(200).json(result)
	}

	async setDataPump(req, res, next) {
		let value = req.body.value
		if (value < 0 || value > 4) return res.status(400).json({ message: 'Invalid value' })
		await mqttclient.publish('ThinhNguyen1801/feeds/pump', value.toString())
		return res.status(200).json({ message: `Change value pump to ${value} successfully` })
	}

	async getDataOxy(req, res, next) {
		const url = 'https://io.adafruit.com/api/v2/ThinhNguyen1801/feeds/oxygenpump/data?limit=1'
		const response = await fetch(url)
		const result = await response.json()
		return res.status(200).json(result)
	}

	async setDataOxy(req, res, next) {
		let value = req.body.value
		if (value < 0 || value > 4) return res.status(400).json({ message: 'Invalid value' })
		await mqttclient.publish('ThinhNguyen1801/feeds/oxygenPump', value.toString())
		return res.status(200).json({ message: `Change value oxygenPump to ${value} successfully` })
	}
}

module.exports = new AppController()
