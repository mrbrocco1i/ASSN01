const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const dotenv = require('dotenv');
dotenv.config();
async function foo() {
  const mongod = new MongoMemoryServer({
    instance: {
      port: 27017, // by default choose any free port
      dbName: process.env.MONGO_DB, //// by default generate random dbName
       dbPath: "./test/database"
    }
  });
  console.log(await mongod.getConnectionString()  )
}

foo();