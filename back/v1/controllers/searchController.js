'use strict'
const ytdl = require('ytdl-core'); // this is for download
const youtubesearchapi = require('youtube-search-api');
const Sound = require('../models').sound
const { Op } = require("sequelize");
const path = require('path');
const fileSystem = require('fs');
const View = require('../models').view
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const playedSongs = []

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
        // delete videos larger than 10 minutes
        const minutes = video.length.simpleText.substring(0, video.length.simpleText.indexOf(':'))
        if (parseInt(minutes) < 11) results.items.push(video)
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
    const userAgent = req.headers['user-agent'];
  
    res.setHeader("Content-Type", "audio/mpeg");
  
    if (type === 'video') {
      const downloadAndStream = (format, hasFilter = false) => {
        const options = {
          quality: 'lowest',
          format: format
        }
        if (hasFilter) options.filter = 'audioonly'
        ytdl(url, options).pipe(res);
      };

      if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        downloadAndStream('mp3');
      } else {
        downloadAndStream('m4a', true);
      }
    } else {
      const sound = await Sound.findOne({ 
        where: {
          sound_id: url 
        }
      });
      const filePath = path.join(__dirname.replace('v1', '').replace('controllers', ''), sound.sound_file_url);
      const readStream = fileSystem.createReadStream(filePath);
      readStream.pipe(res);
    }
  
    const data = {
      sound_id: url,
      view_type: type
    };
    const view = new View(data);
    await view.save();
  } catch (e) {
    console.log(e);
  }  
}
