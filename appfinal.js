const { ApolloServer, gql } = require('apollo-server');
const nodemailer = require('nodemailer');
const { auth } = require("./firebase");

// Define the GraphQL schema
const typeDefs = gql`
 type Query {
 SendEmailQuery(email:String): String
 cred(userotp:Int):String

}
`;
// Define the resolvers
const resolvers = {
     Query: {
 SendEmailQuery:async (parent, { email }) =>{
    try {
      
        var string = "0123456789"; // strings combination from which OTP code will generate modify to get alphanumeric or special characters
        var otp = "";
        var lenght = string.length;
        for (let a = 0; a < 6; a++) {
        //this block of aiudhoop will create a 6-digit code
        otp += string[Math.floor(Math.random() * lenght)];
        } // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
        user: 'akdinesh124@gmail.com',
        pass: 'pgjxiesgsmfdkhqf'
        }
        }); // send mail with defined transport object kannan 
        let info = await transporter.sendMail({
        from: 'akdinesh124@gmail.com',
        to: email,
        subject: otp,
        text: otp
        }); console.log('Message sent: %s', info.messageId);
        exports.otp=otp;
        exports.email=email;
        return 'Email sent successfully';
      } catch (error) {
      console.log(error)
      return "error"
      }
        
 },

 cred: async (parent ,{userotp}) => {
   var currentotp = exports.otp;
   var email=exports.email;
 /*     
console.log("Verified email "+email);
console.log("OTP"+userotp);
console.log("Current Otp " + currentotp);
*/
var ctokenfinal;


//Doing
if (currentotp==userotp) { 
  console.log("email");
   var user = {
      uid: null,
      isPresent: false,
   };
await auth
  .getUserByEmail(email)
  .then((userRecord) => {
    console.log(userRecord);
    user.uid = userRecord.toJSON().uid;
    user.isPresent = true;
  })
  .catch((error) => {
    console.log(error);
    user.isPresent = false;
    throw new Error("Failed to create custom token");
  });
console.log(user);
if (user.isPresent) {
   console.log("creating custom Token this is here!!");
   await auth
      .createCustomToken(user.uid)
      .then((cToken) => {
        console.log("I am in this function"+cToken);
        ctokenfinal=cToken;
         return "hello im going to return ";

      })
      .catch((error) => {
         console.log(error);
         throw new Error("Failed to create custom token");
      });
      return ctokenfinal;
} else {
  await auth
    .createUser({
      email: email,
      emailVerified: true,
      displayName: email,
    })
    .then((userRecord) => {
      user.uid = userRecord.toJSON().uid;
      user.isPresent = true;
    })
    .catch((error) => {
      throw new Error(error.message);
    });

  await auth.createCustomToken(user.uid).then((cToken) => {
    console.log("Custom Token in here:"+cToken);
    ctokenfinal=cToken;
    return "cToken here";
  });
  return ctokenfinal;
}}else{
  return "Invalid OTP";
}
 }
 }
};
// Create the Apollo Server
const server = new ApolloServer({
 typeDefs,
 resolvers
});// Start the server
server.listen().then(({ url }) => {
 console.log(`🚀 Server ready at ${url}`);
});