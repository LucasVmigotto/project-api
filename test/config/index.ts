import '../../src/dotenv'
import * as request from 'supertest'
import appAux from '../../src/app'

const app = appAux.listen(0)

const handlerGQLError = res => {
  if (res.body && res.body.errors) {
    return Promise.reject(res.body.errors)
  }
  if (res.statusCode >= 500 && res.error) {
    return Promise.reject(res.error)
  }
  return res
}

async function createToken () {
  let body = {
    query: `
      mutation Login($input: CredentialInput!) {
        login(input: $input)
      }
    `,
    variables: {
      input: {
        username: process.env.ROOT_USERNAME,
        password: process.env.ROOT_PASSWORD
      }
    }
  }
  const res = await request(app)
    .post('/graphql')
    .set('content-type', 'application/json')
    .send(JSON.stringify(body))
    .then(handlerGQLError)
  const { login } = res.body.data
  return login
}

afterAll(() => {
  app.close()
  appAux.emit('close')
})

export {
  app,
  createToken,
  request,
  handlerGQLError
}
