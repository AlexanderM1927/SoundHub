'use strict'
const ytdl = require('ytdl-core'); // this is for download
const youtubesearchapi = require('youtube-search-api');
const Sound = require('../models').sound
const User = require('../models').user
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
    const users = await User.findAll({
      where: {
        user_name: {
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
    for (let i = 0; i < users.length; i++) {
      const user = {
        type: 'user'
      }
      Object.assign(user, users[i].dataValues)
      results.items.push(user)
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
    res.setHeader("Content-Type", "audio/mp3");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Accept-Ranges", "bytes");
    if (type === 'video') {
      ytdl(url, {
        filter: 'audioonly',
        quality: 'lowestaudio'
      }).pipe(fs.createWriteStream('/tmp/file.mp3'))
      console.log('esta haciendo esto')
    } else {
      const sound = await Sound.findAll({ 
        where: {
          sound_id: url 
        }
      });
      const filePath = path.join(__dirname.replace('v1', '').replace('controllers', ''), sound[0].sound_file_url);
      const readStream = fileSystem.createReadStream(filePath);
      
      // Obtener información sobre el archivo
      const stat = fileSystem.statSync(filePath);
      const fileSize = stat.size;
      
      // Obtener el rango de bytes solicitado
      const range = req.headers.range;
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
      // Calcular el tamaño del contenido parcial
      const chunkSize = (end - start) + 1;
      
      // Configurar el encabezado Content-Range
      res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      res.setHeader("Content-Length", chunkSize);
      
      // Leer y enviar el contenido parcial
      const stream = readStream.pipe(res);
      stream.on("error", function(err) {
        // Manejar errores
      });
    }
    const data = {
      sound_id: url,
      view_type: type
    }
    const view = new View(data)
    await view.save();
  } catch (e) {
    alert(e)
  }
}