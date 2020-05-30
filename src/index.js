const path = require('path');
const express = require('express');
const ejs = require('ejs');

const port = process.env.PORT || 5000;
const publicDirPath = path.join(__dirname, '../public');

const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(express.static(publicDirPath));

app.get('/', (req, res) => {
    res.render('index');
})

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
})