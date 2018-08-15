import { GraphQLObjectType } from 'graphql'
import {
  authorization,
  login,
  saveUser,
  deleteUser
} from './types/User'

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    authorization,
    login,
    saveUser,
    deleteUser
  }
})
