'use strict'
const formidable = require('formidable')
const Playlist = require('../models').playlist
const Sound = require('../models').sound
const SoundPlaylist = require('../models').soundPlaylist
const youtubesearchapi = require('youtube-search-api');
SoundPlaylist.belongsTo(Sound, {foreignKey: 'sound_id'})

exports.store = async function(req, res) {
  try {
    const playlist = new Playlist({
      user_id: req.body.user_id,
      playlist_name: req.body.playlist_name
    })
    await playlist.save()
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      error: null,
      data: playlist
    })
  } catch (error) {
    res.status(400).json({error})
  }
}

exports.showByUser = async function(req, res) {
  try {
    const playlists = await Playlist.findAll({ 
      where: {
        user_id: req.params.user_id
      }
     })
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      error: null,
      data: playlists
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({error})
  }
}

exports.get = async function(req, res) {
  try {
    const playlists = await Playlist.findAll({ 
      where: {
        playlist_id: req.params.playlist_id
      }
    })
    const playlist = playlists[0]
    playlist.dataValues.sounds = await SoundPlaylist.findAll({
      where: {
        playlist_id: playlist.playlist_id
      },
      include: [{
        model: Sound
      }]
    })
    for (let i = 0; i < playlist.dataValues.sounds.length; i++) {
      if (playlist.dataValues.sounds[i].youtube_id) {
        const searchYt = await youtubesearchapi.GetListByKeyword(playlist.dataValues.sounds[i].youtube_id, false)
        const element = searchYt.items[0]
        element.type = 'video'
        element.sound_playlist_id = playlist.dataValues.sounds[i].sound_playlist_id
        playlist.dataValues.sounds[i] = element
      } else {
        playlist.dataValues.sounds[i].sound.dataValues.type = 'sound'
        playlist.dataValues.sounds[i].sound.dataValues.sound_playlist_id = playlist.dataValues.sounds[i].sound_playlist_id
      }
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      error: null,
      data: playlist
    })
  } catch (error) {
    res.status(400).json({error})
  }
}

exports.update = async function(req, res) {
  try {
    const playlists = await Playlist.findAll({ 
      where: {
        playlist_id: req.params.playlist_id
      }
     })
    const playlist = playlists[0]
    playlist.playlist_name = req.body.playlist_name
    await playlist.save()
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      error: null,
      data: playlist
    })
  } catch (error) {
    res.status(400).json({error})
  }
}

exports.delete = async function(req, res) {

}