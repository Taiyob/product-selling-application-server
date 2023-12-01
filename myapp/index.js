const express = require('express');
const cors = require('cors');
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());


app.get('/', (req,res)=>{
    res.send('Server is running');
})
app.listen(port, (req, res)=>{
    console.log(`Server is running on port: ${port}`);
})