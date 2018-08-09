import { app, request, handlerGQLError } from '../config'

describe('Version', () => {
  test('Should return a GraphQL error', async () => {
    let body = {
      query: `
        mutation { version }
      `
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .send(JSON.stringify(body))
    const { errors } = res.body
    expect(Array.isArray(errors)).toEqual(true)
    expect(errors[0].message).toEqual('Cannot query field \"version\" on ' +
      'type \"Mutation\".')
  })
  test('Should return the API version', async () => {
    let body = {
      query: `query { version }`
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { version } = res.body.data
    expect(typeof version).toEqual('string')
    expect(version).toMatch(/^\d+\.\d+\.\d+/)
  })
})
