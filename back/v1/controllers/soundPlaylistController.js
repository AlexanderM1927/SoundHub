'use strict'
const SoundPlaylist = require('../models').soundPlaylist

exports.store = async function(req, res) {
  try {
    const data = {
      playlist_id: req.body.playlist_id
    }
    if (req.body.sound_id) data.sound_id = req.body.sound_id
    else if (req.body.youtube_id) data.youtube_id = req.body.youtube_id
    const sound_paylist = new SoundPlaylist(data)
    await sound_paylist.save()
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      error: null,
      data: sound_paylist
    })
  } catch (error) {
    res.status(400).json({error})
  }
}

exports.delete = async function(req, res) {
  try {
    const sound_playlist = await SoundPlaylist.destroy({
      where: {
        sound_playlist_id: req.params.sound_playlist_id
      }
    })
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      error: null,
      data: sound_playlist
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({error: error})
  }
}