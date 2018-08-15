import { app, createToken, handlerGQLError, request } from '../../config'

let token = null

describe('Login', () => {
  beforeAll(async () => {
    token = await createToken()
  })
  test('Should fail and return \'null\' trying to login', async () => {
    let body = {
      query: `
        mutation Login($input: CredentialInput!) {
          login(input: $input, remember: true)
        }
      `,
      variables: {
        input: {
          username: 'not a',
          password: 'valid user'
        }
      }
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { login } = res.body.data
    expect(login).toBeNull()
  })
  test('Should return \'Access Denied\'', async () => {
    let body = {
      query: `
        query List {
          viewer { users { id } }
        }
      `
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .send(JSON.stringify(body))
    const { errors } = res.body
    expect(Array.isArray(errors)).toEqual(true)
    expect(errors[0].message).toEqual('Access Denied')
  })
})
