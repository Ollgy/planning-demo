const mongoose = require('mongoose');
const config = require('./config.js');

mongoose.Promise = global.Promise; 

const connectionURL = `${config.db.protocol}` +
  `://${config.db.user}:${config.db.password}` +
  `@${config.db.host}` +
  `${config.db.port ? `:${config.db.port}` : ""}` +
  `/${config.db.name}${config.db.reqBody ? config.db.reqBody : ''}`;

mongoose.set('useCreateIndex', true);

mongoose.connect(connectionURL, { useNewUrlParser: true, useFindAndModify: false })
  .catch(e => console.error(e));
  
global.db = mongoose.connection;

db.on('connected', () => {
  console.log(`Mongoose connection open  on ${connectionURL}`)
});

db.on('error', (err) => console.error(err));

db.on('disconnected', () => {
  console.log('mongoose connection disconnected')
});

process.on('SIGINT', () => {
  db.close(() => {
    console.log('mongoose connection closed throw app terminatatnio');
    process.exit(0);
  });
});