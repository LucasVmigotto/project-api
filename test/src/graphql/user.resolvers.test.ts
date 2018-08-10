import { app, request, handlerGQLError } from '../../config'
import { dateOnly } from '../../../src/utils/index'

let user = null

describe('User', () => {
  test('Should return a user list', async () => {
    let body = {
      query: `
        query List {
          users { id name}
        }
      `
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { users } = res.body.data
    expect(Array.isArray(users)).toEqual(true)
  })
  test('Should create a user', async () => {
    let body = {
      query: `
        mutation Create($input: UserInput!){
          saveUser(input: $input) {
            id name birthday createAt updateAt
          }
        }
      `,
      variables: {
        input: {
          name: 'Star Wars: A new hope',
          birthday: '1997-11-18'
        }
      }
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { saveUser } = res.body.data
    expect(saveUser).not.toBeNull()
    expect(typeof saveUser).toEqual('object')
    expect(saveUser).toMatchObject({
      ...body.variables.input
    })
    user = { ...saveUser }
  })
  test('Should return a user list filtered by name', async () => {
    let body = {
      query: `
        query List($name: String) {
          users(name: $name) {
            id
            name
            birthday
            createAt
            updateAt
          }
        }
      `,
      variables: { name: user.name }
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { users } = res.body.data
    expect(Array.isArray(users)).toEqual(true)
    expect(users[0]).toBeTruthy()
  })
  test('Shouldn\'t find any user', async () => {
    let body = {
      query: `
        query Read($id: ID!) {
          find: user(id: $id) { id }
        }
      `,
      variables: { id: "0" }
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { find } = res.body.data
    expect(find).toBeNull()
  })
  test('Should find an user', async () => {
    let body = {
      query: `
        query Read($id: ID!) {
          find: user(id: $id) {
            id name birthday createAt updateAt
          }
        }
      `,
      variables: { id: user.id }
    }
    const res = await request(app)
      .post('/graphql')
      .set('content-type', 'application/json')
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { find } = res.body.data
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
      .send(JSON.stringify(body))
      .then(handlerGQLError)
    const { deleteUser } = res.body.data
    expect(typeof deleteUser).toEqual('boolean')
    expect(deleteUser).toEqual(true)
  })
})
