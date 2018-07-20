import { GraphQLString } from 'graphql'

export const version = {
  type: GraphQLString,
  resolve () {
    return require('../../../package').version
  }
}
