import * as chai from 'chai'
import app from '../src/app'
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
const expect = chai.expect

const handlerError = err => {
  const message: string = (err.response)
    ? err.response.res.text
    : err.message || err
  return Promise.reject(`${err.name}: ${message}`)
}

const handlerGQLError = res => {
  if (res.statusCode >= 500 && res.error) {
    return Promise.reject(res.error)
  }
  if (res.body.errors) {
    return Promise.reject(res.body.errors)
  }
  return res
}

export {
  app,
  chai,
  expect,
  handlerError,
  handlerGQLError
}
