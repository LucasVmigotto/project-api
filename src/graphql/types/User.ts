import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList
} from 'graphql'
import {
  GraphQLDate,
  GraphQLDateTime
} from 'graphql-iso-date'
import {
  camelizeKeys,
  decamelizeKeys
} from 'humps'
import { sign } from 'jsonwebtoken';
import {
  tokenGraphQLResolver,
  isAuthenticated
} from '../../security'
import { dateOnly } from '../../utils'
import { cipher } from '../../utils/crypto'

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    birthday: {
      type: GraphQLDate,
      resolve: d => dateOnly(new Date(d.birthday))
    },
    createAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve: d => new Date(d.createAt)
    },
    updateAt: {
      type: GraphQLDateTime,
      resolve: d => d.updateAt
        ? new Date(d.updateAt)
        : null
    }
  }
})

const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    username: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    birthday: {
      type: GraphQLDate
    }
  }
})

const CredentialInputType = new GraphQLInputObjectType({
  name: 'CredentialInput',
  fields: {
    username: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    }
  }
})

export const authorization = {
  type: UserType,
  args: {
    token: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: tokenGraphQLResolver
}

export const login = {
  type: GraphQLString,
  args: {
    input: {
      type: CredentialInputType
    },
    remember: {
      type: GraphQLBoolean
    }
  },
  async resolve (parent, { input, remember }, { logger, db, jwtOptions }) {
    const { username, password } = input
    const [ data ] = await db('user').where({
      username,
      password: cipher(username, password)
    }).select('id', 'username', 'name', 'create_at', 'update_at')
    if (!data) return null
    const user = {
      ...data,
      exp: Math.floor(Date.now() / 1000) + (
        remember
          ? jwtOptions.expRemember
          : jwtOptions.exp
      )
    }
    return sign(user, jwtOptions.key)
  }
}

export const users = {
  type: new GraphQLList(new GraphQLNonNull(UserType)),
  args: {
    name: {
      type: GraphQLString
    }
  },
  async resolve (parent, { name }, { logger, db }) {
    const data = await db('user')
      .where('name', 'like', `%${name || ''}%`)
    return camelizeKeys(data)
  }
}

export const user = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  async resolve (parent, { id }, { logger, db }) {
    const data = await db('user')
      .where('id', '=', id)
    if (data.length === 0) return null
    return camelizeKeys(data[0])
  }
}

export const saveUser = {
  type: UserType,
  args: {
    id: {
      type: GraphQLID
    },
    input: {
      type: new GraphQLNonNull(UserInputType)
    }
  },
  async resolve (parent, { id, input }, { logger, db, user }) {
    isAuthenticated(user)
    let data
    if (!id) {
      data = await db('user').insert(decamelizeKeys(input))
        .returning('*')
    } else {
      data = await db('user').update(decamelizeKeys({
        ...input,
        updateAt: new Date().toISOString()
      })).where('id', '=', id).returning('*')
    }
    return camelizeKeys(data)[0]
  }
}

export const deleteUser = {
  type: GraphQLBoolean,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  async resolve (parent, { id }, { logger, db, user }) {
    isAuthenticated(user)
    const data = await db('user')
      .where('id', '=', id).del()
    return data === 1
  }
}
