import { GraphQLObjectType } from 'graphql'
import { version } from './types/Version'

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    version
  }
})
