import { GraphQLObjectType } from 'graphql'
import { version } from './types/Version'
import { users, user } from './types/User'

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    version,
    users,
    user
  }
})
