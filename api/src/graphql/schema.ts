import { buildSchema } from 'graphql';

// Define your GraphQL schema
export const schema = buildSchema(`
  type Item {
    _id: ID!
    name: String!
  }

  type Query {
    items: [Item!]!
  }

  type Mutation {
    addItem(name: String!): Item
    deleteItem(_id: ID!): String
  }
`);
