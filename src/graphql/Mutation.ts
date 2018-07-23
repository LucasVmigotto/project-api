import { GraphQLObjectType } from 'graphql'
import { saveUser, deleteUser } from './types/User'

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    saveUser,
    deleteUser
  }
})
