// import 'dotenv/config';
// import { ApolloServer } from 'apollo-server-express';
// import express from 'express';
// import cors from 'cors';
// import { connectDB } from './config/database';
// import { typeDefs } from './typeDefs/taskTypeDefs';
// import { resolvers } from './resolvers/taskResolvers';

// const startServer = async () => {
//   await connectDB();

//   const app = express();
//   app.use(cors());

//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     introspection: true
//   });

//   await server.start();
//   server.applyMiddleware({ app });

//   const PORT = process.env.PORT || 4000;
//   app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
//   });
// };

// startServer().catch(console.error);
import 'dotenv/config';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { connectDB } from './config/database';
import { typeDefs } from './typeDefs/taskTypeDefs';
import { resolvers } from './resolvers/taskResolvers';

const startServer = async () => {
  await connectDB();

  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  await server.start();
  
  // Let Apollo Server handle CORS
  server.applyMiddleware({ 
    app,
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:4000', 'https://studio.apollographql.com'],
      credentials: true,
    }
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer().catch(console.error);