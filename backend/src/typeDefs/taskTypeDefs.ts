import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
    priority: String!
    createdAt: String!
    updatedAt: String!
  }

  input TaskInput {
    title: String!
    description: String
    completed: Boolean
    priority: String
  }

  input TaskUpdateInput {
    title: String
    description: String
    completed: Boolean
    priority: String
  }

  type TaskResponse {
    success: Boolean!
    message: String!
    task: Task
  }
  type DeleteResponse {
  success: Boolean!
  message: String!
}

  type Query {
    getTasks: [Task!]!
    getTask(id: ID!): Task
  }

  type Mutation {
    addTask(input: TaskInput!): TaskResponse!
    updateTask(id: ID!, input: TaskUpdateInput!): TaskResponse!
    deleteTask(id: ID!): DeleteResponse!
    toggleTask(id: ID!): Task!
  }
`;