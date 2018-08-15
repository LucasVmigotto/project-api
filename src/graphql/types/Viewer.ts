import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql'
import { users, user } from './User'
import { tokenGraphQLResolver } from '../../security'

const ViewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    users,
    user
  }
})

export const viewer = {
  type: ViewerType,
  args: {
    token: { type: GraphQLString }
  },
  resolve: tokenGraphQLResolver
}
