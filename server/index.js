require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const mongoose = require('mongoose');

const MONGODB = process.env.MONGODB_URL;

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.use((req, res) => {
    res.send('Hello from express server');
  });

  await mongoose.connect(MONGODB);
  console.log('mongoose is connected');
  app.listen(4000, () => console.log('Server is running on port 4000'));
}

startServer();
