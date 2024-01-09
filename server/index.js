if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const authRouter = require('./routes/auth');
const mongoose = require('mongoose');


//INIT
const app = express();
const PORT = 3000

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authRouter);
//connect
//0.0.0.0 IS FOR LOCALHOST
mongoose.connect(process.env.DB).then(() => console.log("Connected to MongoDB")).catch((err) => console.log(err)); 
app.listen(PORT,"0.0.0.0",() => console.log(`Listening on port ${PORT}`))