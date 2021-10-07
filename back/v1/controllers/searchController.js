'use strict'
const ytdl = require('ytdl-core'); // this is for download
const youtubesearchapi = require('youtube-search-api');
const Sound = require('../models').sound
const { Op } = require("sequelize");
const path = require('path');
const fileSystem = require('fs');
const View = require('../models').view

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
    let pipe = ''
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (type === 'video') {
      pipe = ytdl(url, {
        quality: 'lowestaudio'
      });
    } else {
      const sound = await Sound.findAll({ 
        where: {
          sound_id: url 
        }
      })
      const filePath = path.join(__dirname.replace('v1', '').replace('controllers', ''), sound[0].sound_file_url);
      const readStream = fileSystem.createReadStream(filePath);
      pipe = readStream
    }
    pipe.on("data", (chunk) => {
      res.write(chunk);
    });

    pipe.on("error", (err) => {
      res.sendStatus(404);
    });

    pipe.on("end", () => {
      res.end();
    });
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