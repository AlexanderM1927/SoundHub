// import Vue from 'vue'
import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: process.env.API_URL
  })
}
