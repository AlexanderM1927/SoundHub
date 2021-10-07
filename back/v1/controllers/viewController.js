'use strict'
const View = require('../models').view
const moment = require('moment')
const { Op, Sequelize } = require("sequelize");
const Sound = require('../models').sound
const youtubesearchapi = require('youtube-search-api')
const User = require('../models').user

exports.getViews = async function (req, res) {
    try {
      const views = await View.findAll({
        attributes: [
            'sound_id',
            'view_type',
            [Sequelize.literal('COUNT(sound_id)'), 'count']
        ],
        where: {
            createdAt: {
                [Op.between]: [moment().startOf('week').format('YYYY-MM-DD'), moment().add(1, 'days').format('YYYY-MM-DD')]
            }
        },
        group: ['sound_id', 'view_type'],
        order: [
            [Sequelize.literal('count'), 'DESC']
        ],
        limit: 10
      })
      const results = {
        items: [],
        nextPage: {}
      }
      for (let i = 0; i < views.length; i++) {
        const obj = views[i].dataValues
        let sound = null
        if (obj.view_type === 'video') {
            const youtubeSearch = await youtubesearchapi.GetListByKeyword(obj.sound_id, false)
            sound = youtubeSearch.items[0]
        } else {
            const soundFromDB = await Sound.findOne({ 
                where: {
                    sound_id: obj.sound_id
                },
                include: [{
                    model: User
                }]
            })
            sound = {
                type: 'sound'
            }
            Object.assign(sound, soundFromDB.dataValues)
        }
        results.items.push(sound)
      }
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json({
        error: null,
        data: results
      })
    } catch (error) {
        res.status(400).json({error})
    }
}