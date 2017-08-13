const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./config/database');
const mongoose = require('mongoose');
const passport = require('passport')


mongoose.connect(db.database)

mongoose.connection.on('connected', () => {
	console.log("connected to database" + db.database)
})

mongoose.connection.on('error', (err) => {
	console.log("Database Error: " + err)
})


const app = express();

const port = 3000;

const users = require('./routes/users');
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport)


app.use("/users", users)

app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () => {
	console.log("listening on " + port)
})
