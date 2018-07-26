import {
  app, chai, expect, handlerGQLError
} from '../test-utils'
import {
  dateOnly
} from '../../src/utils/index'
describe('GraphQL', () => {
  let userId = null
  describe('Mutation', () => {
    describe('saveUser', () => {
      it('Should create a user', async () => {
        let body = {
          query: `
            mutation {
              saveUser(input: {
                name: "Star Wars: The New Hope",
                birthday: "${dateOnly(new Date('1977-11-18'))}"
              }) {
                id
                name
                birthday
                createAt
                updateAt
              }
            }
          `
        }
        const res = await chai.request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .send(JSON.stringify(body))
          .then(handlerGQLError)
        const { saveUser } = res.body.data
        userId = saveUser.id
        expect(saveUser).to.be.an('object')
        expect(saveUser.createAt).to.be.an('string')
        expect(saveUser).to.deep.equal({
          id: userId,
          name: 'Star Wars: The New Hope',
          birthday: new Date('1977-11-18').toISOString(),
          createAt: saveUser.createAt,
          updateAt: null
        })
      })
      it('Should update user', async () => {
        let body = {
          query: `
            mutation {
              saveUser(id: "${userId}", input: {
                name: "Star Wars: The Empire Strikes Back",
                birthday: "${dateOnly(new Date('1980-07-21'))}"
              }) {
                id
                name
                birthday
                updateAt
              }
            }
          `
        }
        const res = await chai.request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .send(JSON.stringify(body))
          .then(handlerGQLError)
        const { saveUser } = res.body.data
        expect(saveUser).to.be.an('object')
        expect(saveUser.updateAt).to.be.an('string')
        expect(saveUser).to.deep.equal({
          id: userId,
          name: 'Star Wars: The Empire Strikes Back',
          birthday: new Date('1980-07-21').toISOString(),
          updateAt: saveUser.updateAt
        })
      })
    })
  })
  describe('Query', () => {
    describe('users', () => {
      it('Should query users', async () => {
        let body = {
          query: `
            query {
              users {
                id
                name
              }
            }
          `
        }
        const res = await chai.request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .send(JSON.stringify(body))
          .then(handlerGQLError)
        const { users } = res.body.data
        expect(users).to.be.an('array')
        expect(users.length).to.greaterThan(0)
        expect(users[0]).to.be.an('object')
      })
      it('Should found users by name', async () => {
        let body = {
          query: `
            query {
              users(name: "a") {
                id
                name
              }
            }
          `
        }
        const res = await chai.request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .send(JSON.stringify(body))
          .then(handlerGQLError)
        const { users } = res.body.data
        expect(users).to.be.an('array')
        expect(users.length).to.greaterThan(0)
      })
      it('Should\'t found users by name', async () => {
        let body = {
          query: `
            query {
              users(name: "wxyz87") {
                id
                name
              }
            }
          `
        }
        const res = await chai.request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .send(JSON.stringify(body))
          .then(handlerGQLError)
        const { users } = res.body.data
        expect(users).to.be.an('array')
        expect(users.length).to.equal(0)
      })
    })
    describe('user', () => {
      it('Should\'t find user by ID '+
        '(return \'User not found\')', async () => {
        let body = {
          query: `
            query {
              user(id: "-1") {
                id
                name
              }
            }
          `
        }
        const res = await chai.request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .send(JSON.stringify(body))
        const { errors } = res.body
        expect(errors).to.be.an('array')
        expect(errors[0].message).to.equal('User not found')
      })
      it('Should find user by ID', async () => {
        let body = {
          query: `
            query {
              user(id: "${userId}") {
                id
                name
                birthday
              }
            }
          `
        }
        const res = await chai.request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .send(JSON.stringify(body))
          .then(handlerGQLError)
        const { user } = res.body.data
        expect(user).to.be.an('object')
        expect(user).to.deep.equal({
          id: userId,
          name: 'Star Wars: The Empire Strikes Back',
          birthday: new Date('1980-07-21').toISOString()
        })
      })
    })
  })
  describe('Mutation', () => {
    describe('deleteUser', () => {
      it('Should delete user with false', async () => {
        let body = {
          query: `
            mutation {
              deleteUser(id: "-1")
            }
          `
        }
        const res = await chai.request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .send(JSON.stringify(body))
          .then(handlerGQLError)
        const { deleteUser } = res.body.data
        expect(deleteUser).to.equal(false)
      })
      it('Should delete user with true', async () => {
        let body = {
          query: `
            mutation {
              deleteUser(id: ${userId})
            }
          `
        }
        const res = await chai.request(app)
          .post('/graphql')
          .set('content-type', 'application/json')
          .send(JSON.stringify(body))
          .then(handlerGQLError)
        const { deleteUser } = res.body.data
        expect(deleteUser).to.equal(true)
      })
    })
  })
})
