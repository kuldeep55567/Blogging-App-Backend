const express = require('express');
const app = express();
const sequelize = require('./Config/db');
const {logger} = require("./Middlewares/Logger")
const  router = require("./Routes/UserRoute")
const {postRouter} = require("./Controllers/PostController")
const cors = require('cors');
require("dotenv").config()
app.use(express.json());
app.use(logger)
app.use(cors());
app.get('/', (req, res) => {
try {
  res.send('Welcome to the Backend of the Blogging App!');
} catch (error) {
  res.status(404).json({"error":error})
}
});
app.use(router)
app.use(postRouter)
const PORT = process.env.PORT
sequelize
  .authenticate()
  .then(() => {
    console.log('MySQL Database Connected Successfully');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
