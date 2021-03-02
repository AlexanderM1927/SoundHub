import cors from 'cors';
import ytdl from 'ytdl-core';
const youtubesearchapi = require('youtube-search-api');
const fs = require('fs');

const express = require('express');

const app = express();

app.use(cors('*'));

app.get('/check-download', async (req, res, next) => {
  try {
    const { URL } = req.query;
    const {
      player_response: {
        videoDetails: { title, author },
      },
    } = await ytdl.getBasicInfo(URL);
    res.json({
      status: true,
      title,
      author,
    });
    next();
  } catch (e) {
    console.log(e);
  }
});

app.get('/search', async (req, res, next) => {
  try {
    const { NAME } = req.query
    // console.log(NAME)
    const youtube = await youtubesearchapi.GetListByKeyword(NAME, false)
    // console.log(youtube)
    const videos = {
      items: [],
      nextPage: {}
    }
    for (let i = 0; i < youtube.items.length; i++) {
      if (youtube.items[i].type === 'video') videos.items.push(youtube.items[i])
    }
    videos.nextPage = youtube.nextPage
    res.json(videos)
    next();
  } catch (e) {
    console.log(e)
  }
})

app.get('/download', async (req, res) => {
  try {
    const {
      URL
    } = req.query;
    // if (downloadFormat === 'audio-only') {
      res.setHeader("Content-Type", "audio/mpeg");
      ytdl(URL, {
        quality: 'lowestaudio'
      }).pipe(res);
    // }
  } catch (e) {
    console.log(e);
  }
});

// eslint-disable-next-line no-console
app.listen({ port: 8000 }, () => console.log('🚀 Server ready at http://localhost:8000'));
