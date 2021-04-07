'use strict'
import ytdl from 'ytdl-core';
const youtubesearchapi = require('youtube-search-api');

exports.search = async function(req, res) {
  const { NAME } = req.query
    // console.log(NAME)
    const youtube = await youtubesearchapi.GetListByKeyword(NAME, false)
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