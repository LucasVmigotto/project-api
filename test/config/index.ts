import * as request from 'supertest'
import app from '../../src/app'

const handlerError = err => {
  const message: string = (err.response)
    ? err.response.res.text
    : err.message || err
  return Promise.reject(`${err.name}: ${message}`)
}

const handlerGQLError = res => {
  if (res.body && res.body.errors) {
    return Promise.reject(res.body.errors)
  }
  if (res.statusCode >= 500 && res.error) {
    return Promise.reject(res.error)
  }
  return res
}

export {
  app,
  request,
  handlerGQLError
}
