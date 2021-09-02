'use strict'
const formidable = require('formidable')
const Sound = require('../models').sound
const Joi = require('@hapi/joi');
const multer  =  require('multer');
const path = require('path');
const storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    // try this route into the server save
    callback(null, '../../public/sounds/');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage : storage }).fields([
  {
    name: 'sound_file_url',
    maxCount: 1 
  },
  {
    name: 'sound_thumbnail_url',
    maxCount: 1 
  }
])

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
        return res.end("Error uploading file." + err);
      } else {
        const sound = new Sound({
          user_id: user_id,
          sound_name: sound_name,
          sound_file_url: req.files.sound_file_url[0].path,
          sound_thumbnail_url: req.files.sound_thumbnail_url[0].path
        });
        await sound.save().catch(function (error) {
          res.status(400).json({error})
        })
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({
          error: null,
          data: sound
        })
      }
    })
  } catch (error) {
    res.status(400).json({error})
  }
}

exports.showByUser = async function(req, res) {
  try {
    const sounds = await Sound.findAll({ 
      where: {
        user_id: req.params.user_id
      }
     })
    const results = {
      items: [],
      nextPage: {}
    }
    for (let i = 0; i < sounds.length; i++) {
      const sound = {
        type: 'sound'
      }
      Object.assign(sound, sounds[i].dataValues)
      results.items.push(sound)
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      error: null,
      data: results
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({error})
  }
}

exports.update = async function(req, res) {

}

exports.delete = async function(req, res) {

}