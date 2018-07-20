import { GraphQLObjectType } from 'graphql'
import { createUser, deleteUser } from './types/User'

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser,
    deleteUser
  }
})
