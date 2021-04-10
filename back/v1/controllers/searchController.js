'use strict'
const ytdl = require('ytdl-core'); // this is for download
const youtubesearchapi = require('youtube-search-api');
const Sound = require('../models').sound
const { Op } = require("sequelize");
const path = require('path');
const fileSystem = require('fs');

exports.search = async function(req, res) {
  try {
    const name = req.params.name
    // console.log(name)
    const youtube = await youtubesearchapi.GetListByKeyword(name, false)
    const sounds = await Sound.findAll({
      where: {
        sound_name: {
          [Op.iLike]: '%' + name + '%'
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
      if (video.type === 'video') results.items.push(video)
    }
    results.nextPage = youtube.nextPage
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
    res.setHeader("Content-Type", "audio/mpeg");
    if (type === 'video') {
      ytdl(url, {
        quality: 'lowestaudio'
      }).pipe(res);
    } else {
      const sound = await Sound.findAll({ 
        where: {
          sound_id: url 
        }
      })
      const filePath = path.join(__dirname.replace('v1', '').replace('controllers', ''), sound[0].sound_file_url);
      const readStream = fileSystem.createReadStream(filePath);
      readStream.pipe(res)
    }
  } catch (e) {
    console.log(e);
  }
}