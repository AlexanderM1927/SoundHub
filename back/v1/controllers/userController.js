'use strict'
const User = require('../models').user
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const schemaRegister = Joi.object({
  username: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  passwordConfirm: Joi.string().min(6).max(255).required(),
  password: Joi.string().min(6).max(1024).required()
})

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
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
    username: req.body.username,
    email: req.body.email,
    password: password,
    roleId: 1 
  });
  try {
    const savedUser = await user.save()
    console.log(savedUser)
    res.json({
      error: null,
      data: savedUser
    })
  } catch (error) {
    res.status(400).json({error})
  }
}