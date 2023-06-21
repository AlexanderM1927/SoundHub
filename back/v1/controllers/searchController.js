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
    const url = req.params.url
    const type = req.params.type
    const userAgent = req.headers['user-agent']
    if (type === 'video') {
      res.setHeader("Content-Type", "audio/mpeg");
      const previousSong = playedSongs.find(song => song.song === url)
      if (previousSong) {
        const readStream = fileSystem.createReadStream(previousSong.songUrl);
        readStream.pipe(res)
      } else {
        if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
          const outputPath = 'public/sounds/' + Date.now() + '.mp3'
          const m4aFileDir = 'public/sounds/' + Date.now() + '.m4a'
          ytdl(url, {
            quality: 'lowestaudio',
            filter: 'audioonly',
            format: 'm4a'
          })
            .pipe(fileSystem.createWriteStream(m4aFileDir))
            .on('finish', () => {
              ffmpeg.setFfmpegPath(ffmpegPath)
              const fileDir = m4aFileDir
              ffmpeg(path.join(__dirname.replace('v1', '').replace('controllers', ''), fileDir))
                .output(outputPath)
                .on('end', () => {
                  const readStream = fileSystem.createReadStream(outputPath);
                  readStream.pipe(res)
                  playedSongs.push({
                    song: url,
                    songUrl: outputPath
                  })
                  console.log('Sound downloaded')
                })
                .run();
            })
        } else {
          ytdl(url, {
            quality: 'lowestaudio',
            filter: 'audioonly',
            format: 'm4a'
          }).pipe(res)
        }
      }
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
