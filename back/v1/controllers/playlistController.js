'use strict'
const formidable = require('formidable')
const Playlist = require('../models').playlist

exports.store = async function(req, res) {
  try {
    const playlist = new Playlist({
      user_id: req.body.user_id,
      playlist_name: req.body.playlist_name
    })
    await playlist.save()
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
    const playlists = await Playlist.findAll({ user_id: req.params.user_id })
    res.json({
      error: null,
      data: playlists
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({error})
  }
}

exports.update = async function(req, res) {
  try {
    const playlist = await Playlist.findAll({ playlist_id: req.params.playlist_id })
    playlist.playlist_name = req.body.playlist_name
    await playlist.save()
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