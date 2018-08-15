import { GraphQLObjectType } from 'graphql'
import { version } from './types/Version'
import { viewer } from './types/Viewer'

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    viewer,
    version
  }
})
