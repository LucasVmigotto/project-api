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
import { dateOnly } from '../../utils'

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    birthday: {
      type: GraphQLDate,
      resolve: d => dateOnly(new Date(d.birthday))
    },
    createAt: {
      type: GraphQLDateTime,
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

export const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    birthday: {
      type: GraphQLDate
    }
  }
})

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
  async resolve (parent, { id, input }, { logger, db }) {
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
  async resolve (parent, { id }, { logger, db }) {
    const data = await db('user')
      .where('id', '=', id).del()
    return data === 1
  }
}
