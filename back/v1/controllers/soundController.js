'use strict'
const Sound = require('../models').sound
const Joi = require('@hapi/joi');

exports.show = async function(req, res) {
  
}

exports.store = async function(req, res) {
    const sound = new Sound({
        user_id: req.body.user_id,
        sound_name: req.body.sound_name,
        user_password: password,
        role_id: 1 
    });
}

exports.update = async function(req, res) {

}