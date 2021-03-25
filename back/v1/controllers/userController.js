'use strict'
const User = require('../models').user
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const schemaRegister = Joi.object({
  user_name: Joi.string().min(6).max(255).required(),
  user_email: Joi.string().min(6).max(255).required().email(),
  user_password: Joi.string().min(6).max(255).required(),
  user_passwordConfirm: Joi.string().min(6).max(255).required()
})

const schemaLogin = Joi.object({
  user_email: Joi.string().min(6).max(255).required().email(),
  user_password: Joi.string().min(6).max(1024).required()
})

exports.login = async function(req, res) {

}

exports.register = async function(req, res) {
  // validate user
  const { error } = schemaRegister.validate(req.body)
    
  if (error) {
    return res.status(400).json({error: error.details[0].message})
  }

  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist) {
    return res.status(400).json({error: 'Email ya registrado'})
  }

  // hash contraseña
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    user_name: req.body.name,
    user_email: req.body.email,
    user_password: password,
    role_id: 1 
  });
  try {
    const savedUser = await user.save()
    res.json({
      error: null,
      data: savedUser
    })
  } catch (error) {
    res.status(400).json({error})
  }
}

exports.setRank = async function(req, res) {

  const user = await User.findOne({ user_id: req.params.user_id });
  if (!user) {
    return res.status(404).json({error: 'Email ya registrado'})
  }

  user.role_id = req.body.role_id

  try {
    const savedUser = await user.save()
    res.json({
      error: null,
      data: savedUser
    })
  } catch (error) {
    res.status(400).json({error})
  }
}