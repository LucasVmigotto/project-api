import {
  app,
  chai,
  expect,
  handlerGQLError
} from '../test-utils'

describe('GraphQL', () => {
  describe('Queries', () => {
    describe('version', () => {
      it('Should return the API version', async () => {
        let body = {
          query: `
          query {
            version
          }`
        }
        const res = await chai.request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .send(JSON.stringify(body))
          .then(handlerGQLError)
        const { version } = res.body.data
        expect(version).to.be.an('string')
        expect(version).to.match(/^\d+\.\d+\.\d+/)
      })
    })
  })
})
