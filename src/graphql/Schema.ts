import { GraphQLSchema } from 'graphql'
import { MutationType as mutation } from './Mutation'
import { QueryType as query } from './Query'

export const schema = new GraphQLSchema({
  mutation,
  query
})
