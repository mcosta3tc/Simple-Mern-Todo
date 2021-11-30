require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.port || 3000

app.listen(port, () => {
    console.log(`Listen on : ${port}`);
});
