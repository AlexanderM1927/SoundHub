'use strict'
const ytdl = require('ytdl-core'); // this is for download
const youtubesearchapi = require('youtube-search-api');
const Sound = require('../models').sound
const { Op } = require("sequelize");
const path = require('path');
const fileSystem = require('fs');
const View = require('../models').view
const { PassThrough } = require('stream');

exports.search = async function(req, res) {
  try {
    const name = req.params.name
    // console.log(name)
    const youtube = await youtubesearchapi.GetListByKeyword(name, false)
    const sounds = await Sound.findAll({
      where: {
        sound_name: {
          [Op.like]: '%' + name + '%'
        }
      }
    })
    const results = {
      items: [],
      nextPage: {}
    }
    for (let i = 0; i < sounds.length; i++) {
      const sound = {
        type: 'sound'
      }
      Object.assign(sound, sounds[i].dataValues)
      results.items.push(sound)
    }
    for (let i = 0; i < youtube.items.length; i++) {
      const video = youtube.items[i]
      // console.log(video.length.accessibility.accessibilityData)
      if (video.type === 'video' && video.length.accessibility && video.length.simpleText.match(/:/g).length === 1) {
        // console.log(Moment(video.length.accessibility.accessibilityData))
        results.items.push(video)
      }
    }
    results.nextPage = youtube.nextPage
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      error: null,
      data: results
    })
  } catch (error) {
    res.status(400).json({error})
  }
}

exports.download = async function(req, res) {
  try {
    const url = req.params.url;
    const type = req.params.type;
    if (type === 'video') {
      res.setHeader("Content-Type", "audio/m4a");
      res.setHeader('Content-disposition', 'attachment; filename=' + Date.now() + '.m4a');
      await new Promise((resolve) => { // wait
        ytdl(url, {
          quality: 'lowestaudio',
          filter: 'audioonly',
          format: 'm4a'
        }).pipe(res).on('close', () => {
          resolve(); // finish
        })
      })
    } else {
      res.setHeader("Content-Type", "audio/mpeg");
      const sound = await Sound.findAll({ 
        where: {
          sound_id: url 
        }
      })
      const filePath = path.join(__dirname.replace('v1', '').replace('controllers', ''), sound[0].sound_file_url);
      const readStream = fileSystem.createReadStream(filePath);
      readStream.pipe(res)
    }
    const data = {
      sound_id: url,
      view_type: type
    }
    const view = new View(data)
    await view.save()
  } catch (e) {
    console.log(e);
  }
}
