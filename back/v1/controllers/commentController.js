'use strict'
const Comment = require('../models').comment

exports.store = async function(req, res) {
  try {
    const data = {
      comment_msg: req.body.comment,
      user_id: req.body.user_id,
      sound_id: req.body.sound_id
    }
    const comment = new Comment(data)
    await comment.save()
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      error: null,
      data: comment
    })
  } catch (error) {
    res.status(400).json({error})
  }
}

exports.getCommentsBySoundId = async function (req, res) {
    try {
    } catch (error) {
        res.status(400).json({error})
    }
}