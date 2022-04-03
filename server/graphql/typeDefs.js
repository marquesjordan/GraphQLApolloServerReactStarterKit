const { gql } = require('apollo-server-express');

module.exports = gql`
  type Message {
    id: ID
    text: String
    username: String
    createdAt: String
    createdBy: String
  }

  type User {
    username: String
    email: String
    password: String
    token: String
  }

  input MessageInput {
    text: String
    username: String
  }

  input RegisterInput {
    username: String
    email: String
    password: String
    confirmPassword: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type Query {
    getAllMessages: [Message]
    message(id: ID!): Message
    user(id: ID!): User
  }

  type Mutation {
    createMessage(messageInput: MessageInput): Message!
    deleteMessage(id: ID): Boolean
    updateMessage(id: ID, messageInput: MessageInput): Message!
    registerUser(registerInput: RegisterInput): User
    loginUser(loginInput: LoginInput): User
  }

  type Subscription {
    messageCreated: Message
  }
`;
