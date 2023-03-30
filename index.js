const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    hello: String
    god(email:String): String
    testing: String
    cheak(role:String): String 
    Addtwonumber(num1:Int, num2:Int): Int 
  }

`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    god: (parent, {email}) => email + "@ceiamerica.com",
    testing: () => "Testing  works",
    cheak: (parent, { role }) => {
      if (role === 'admin') {
        return 'You are allowed to access this information.';
      } else {
        return 'You are not authorized to access this information.';
      }
    },
    Addtwonumber:(parent,{num1,num2}) => {
        var num3 = num1 + num2 ;
        return num3;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});