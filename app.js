
const nodemailer = require('nodemailer');
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    
    sendEmail(String:Email): String
  }

`;


const resolvers = {
    Query: {
        sendEmail:(parent,{Email}) => {

            // Our code here 

            
      },
    },
  };
  
  const server = new ApolloServer({ typeDefs, resolvers });
  
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });