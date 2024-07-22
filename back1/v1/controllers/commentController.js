'use strict'
const Comment = require('../models').comment
const User = require('../models').user

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
      const comments = await Comment.findAll({ 
        where: {
          sound_id: req.params.sound_id
        },
        order: [
          ['comment_id', 'DESC']
        ],
        include: [{
          model: User
        }]
      })
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json({
        error: null,
        data: comments
      })
    } catch (error) {
        res.status(400).json({error})
    }
}