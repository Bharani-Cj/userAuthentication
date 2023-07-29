const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION');
  process.exit(1);
});

const app = require(`${__dirname}/app`);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB CONNECTED');
  });

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Port is listening on ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION🫡 ');
  server.close(() => {
    process.exit(1);
  });
});
