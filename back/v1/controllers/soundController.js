'use strict'
const formidable = require('formidable')
const Sound = require('../models').sound
const Joi = require('@hapi/joi');
const multer  =  require('multer');
const path = require('path');
const storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './sounds');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage : storage}).fields([
  {
    name: 'sound_file_url',
    maxCount: 1 
  },
  {
    name: 'sound_thumbnail_url',
    maxCount: 1 
  }
])

exports.showByUser = async function(req, res) {
  const sounds = Sound.find({ user_id: req.params.user_id })
  try {
    res.json({
      error: null,
      data: sounds
    })
  } catch (error) {
    res.status(400).json({error})
  }
}

exports.store = async function(req, res) {
    try {
      const form = new formidable.IncomingForm();
      let user_id = 0
      let sound_name = ''
      form.parse(req, function(err, fields, files) {
        user_id = fields.user_id
        sound_name = fields.sound_name
      })
      upload(req,res, async function(err) {
        if(err) {
          console.log(err)
            return res.end("Error uploading file.");
        }
        const sound = new Sound({
          user_id: user_id,
          sound_name: sound_name,
          sound_file_url: req.files.sound_file_url[0].path,
          sound_thumbnail_url: req.files.sound_thumbnail_url[0].path
        });
        await sound.save();
        res.json({
          error: null,
          data: sound
        })
      })
    } catch (error) {
        console.log(error)
    }
}

exports.update = async function(req, res) {

}

exports.delete = async function(req, res) {

}