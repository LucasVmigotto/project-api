import { app, handlerGQLError, request } from '../config'

describe('App', () => {
  test('Should fail trying to access an unavaliable endpoint', async () => {
    const res = await request(app)
      .get('/unavaliable')
    const { data } = res.body
    expect(data).toBeTruthy()
    expect(typeof data).toEqual('string')
    expect(data).toEqual('GET:/unavaliable not found')
  })
})
