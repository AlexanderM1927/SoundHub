'use strict'
const SoundPlaylist = require('../models').soundPlaylist

exports.store = async function(req, res) {
  try {
    const sound_paylist = new SoundPlaylist({
      playlist_id: req.body.playlist_id,
      sound_id: req.body.sound_id
    })
    await sound_paylist.save()
    res.json({
      error: null,
      data: sound_paylist
    })
  } catch (error) {
    res.status(400).json({error})
  }
}

exports.update = async function(req, res) {
  try {
    const sounds_playlists = await Playlist.findAll({
      where: {
        sound_playlist_id: req.params.sound_playlist_id
      }
    })
    const sound_playlist = sounds_playlists[0]
    sound_playlist.playlist_id = req.body.playlist_id
    sound_playlist.sound_id = req.body.sound_id
    await sound_playlist.save()
    res.json({
      error: null,
      data: sound_playlist
    })
  } catch (error) {
    res.status(400).json({error})
  }
}

exports.delete = async function(req, res) {
  try {
    const sound_playlist = await Playlist.findAll({ sound_playlist_id: req.params.sound_playlist_id })
    await sound_playlist.delete()
    res.json({
      error: null,
      data: sound_playlist
    })
  } catch (error) {
    res.status(400).json({error})
  }
}