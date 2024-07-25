const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const indexRouter = require('./routes/index');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use('/', indexRouter);

const port = process.env.PORT || 3005;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});