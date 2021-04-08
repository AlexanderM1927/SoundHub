'use strict'
const ytdl = require('ytdl-core'); // this is for download
const youtubesearchapi = require('youtube-search-api');

exports.search = async function(req, res) {
  const name = req.params.name
    // console.log(name)
    const youtube = await youtubesearchapi.GetListByKeyword(name, false)
    // console.log(youtube)
    const results = {
      items: [],
      nextPage: {}
    }
    for (let i = 0; i < youtube.items.length; i++) {
      if (youtube.items[i].type === 'video') results.items.push(youtube.items[i])
    }
    results.nextPage = youtube.nextPage
  try {
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
    // if (downloadFormat === 'audio-only') {
      res.setHeader("Content-Type", "audio/mp3");
      // res.set('content-type', 'audio/mpeg');
      ytdl(url, {
        quality: 'lowestaudio'
      }).pipe(res);
    // }
  } catch (e) {
    console.log(e);
  }
}