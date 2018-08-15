import { app, createToken, request, handlerGQLError } from '../../config'

let token = null
let user = null

describe('User', () => {
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
  test('Should return a user list', async () => {
    let body = {
      query: `
        query List($token: String) {
          viewer(token: $token) {
            users { id name}
          }
        }
      `,
      variables: { token }
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { users } = res.body.data.viewer
    expect(Array.isArray(users)).toEqual(true)
  })
  test('Should create a user', async () => {
    let body = {
      query: `
        mutation Create($input: UserInput!){
          saveUser(input: $input) {
            id username name birthday createAt updateAt
          }
        }
      `,
      variables: {
        input: {
          username: 'george_lucas',
          password: 'senha123',
          name: 'Star Wars: A new hope',
          birthday: '1997-11-18'
        }
      }
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${token}`)
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { saveUser } = res.body.data
    expect(saveUser).not.toBeNull()
    expect(typeof saveUser).toEqual('object')
    expect(saveUser.username).toEqual('george_lucas')
    expect(saveUser.name).toEqual('Star Wars: A new hope')
    user = { ...saveUser }
  })
  test('Should return a user list filtered by name', async () => {
    let body = {
      query: `
        query List($token: String!, $name: String) {
          viewer(token: $token) {
            users(name: $name) {
              id
              name
              birthday
              createAt
              updateAt
            }
          }
        }
      `,
      variables: { token, name: user.name }
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { users } = res.body.data.viewer
    expect(Array.isArray(users)).toEqual(true)
    expect(users[0]).toBeTruthy()
  })
  test('Shouldn\'t find any user', async () => {
    let body = {
      query: `
        query Read($token: String!, $id: ID!) {
          viewer(token: $token) {
            find: user(id: $id) { id }
          }
        }
      `,
      variables: { token, id: "0" }
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { find } = res.body.data.viewer
    expect(find).toBeNull()
  })
  test('Should find an user', async () => {
    let body = {
      query: `
        query Read($token: String!, $id: ID!) {
          viewer(token: $token) {
            find: user(id: $id) {
              id username name birthday createAt updateAt
            }
          }
        }
      `,
      variables: { token, id: user.id }
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { find } = res.body.data.viewer
    expect(find).not.toBeNull()
    expect(typeof find).toEqual('object')
    expect(find).toMatchObject(user)
  })
  test('Should update an user', async () => {
    let body = {
      query: `
        mutation Update($id: ID, $input: UserInput!) {
          saveUser(id: $id, input: $input) {
            id name birthday createAt updateAt
          }
        }
      `,
      variables: {
        id: user.id,
        input: {
          name: 'Star Wars: The empire strikes back',
          birthday: '1980-06-21'
        }
      }
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${token}`)
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { saveUser } = res.body.data
    expect(saveUser).not.toBeNull()
    expect(saveUser.updateAt).not.toBeNull()
    expect(saveUser).toMatchObject({
      id: user.id,
      ...body.variables.input
    })
  })
  test('Should fail trying to delete an user', async () => {
    let body = {
      query: `
        mutation Delete($id: ID!) {
          deleteUser(id: $id)
        }
      `,
      variables: { id: "0" }
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${token}`)
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { deleteUser } = res.body.data
    expect(typeof deleteUser).toEqual('boolean')
    expect(deleteUser).toEqual(false)
  })
  test('Should delete an user', async () => {
    let body = {
      query: `
        mutation Delete($id: ID!) {
          deleteUser(id: $id)
        }
      `,
      variables: { id: user.id }
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${token}`)
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { deleteUser } = res.body.data
    expect(typeof deleteUser).toEqual('boolean')
    expect(deleteUser).toEqual(true)
  })
})
