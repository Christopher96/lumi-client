import express from 'express';
import dotenv from 'dotenv';
// This reads in all the varibles from the
// .env file where we can set infromation.
// If you set PORT=4400 in the file we can access
// it in code by writing process.env.PORT
dotenv.config();

const bootstrap = async () => {
  // We begin by calling the express function which
  // returns a server object which can register endpoints
  const app = express();

  // Get the port from the .env file.
  const port = process.env.PORT;

  // If no port is found we do not have a port
  // on which the server can start on
  if (!port) {
    throw new Error(` You have no port configured in the .env file 😣`);
  }

  // We declare all the routes here. The first arguemnt is
  // the path, the second argument is the function which is to
  // be called
  app.get('/', require('./routes/index').callback);

  // We finally start the server and give it a
  // callback which states on which port the server
  // has been started on.
  app.listen(port, () => {
    console.log(`🤩 Now the server is ready at http://localhost:${port} 🤩`);
  });
};

bootstrap();
