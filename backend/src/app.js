const express = require('express');
const app = express();
const path = require("path");
const cors = require('cors')
const bodyParser = require('body-parser');
const passport = require("passport");
const session = require("express-session");
const passportConfig = require("./config/passport")
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const subjectRoutes = require('./routes/subjectRoutes');
const levelRoutes = require('./routes/levelroutes');
const documentRoutes = require('./routes/documentroutes');
const folderRoutes = require('./routes/folderroutes');
const trashRoutes = require('./routes/trashRoutes');
const loginRoutes = require('./routes/loginRoutes');
const auth = require('./routes/auth/auth')
const resources = require('./routes/auth/res_route');
const authenticateGoogleJWT = require('./middleware/authenticate')


app.use(
    session({
        secret: "this is my secrect code",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    })
);

app.use(passport.initialize());
app.use(passport.session());

const cors_config = {
    origin: "*",
};
app.use(cors(cors_config));
app.use(express.json());
app.use(bodyParser.json());

console.log(process.env.API)

app.use(`${process.env.API}/api`, resources);
app.use(`${process.env.API}/api/auth`, auth);
app.use(`${process.env.API}/api`, authenticateGoogleJWT, subjectRoutes);
app.use(`${process.env.API}/api`, authenticateGoogleJWT, levelRoutes);
app.use(`${process.env.API}/api`, authenticateGoogleJWT, documentRoutes);
app.use(`${process.env.API}/api`, authenticateGoogleJWT, folderRoutes);
app.use(`${process.env.API}/api`, authenticateGoogleJWT, trashRoutes);
app.use(`${process.env.API}/api`, authenticateGoogleJWT, loginRoutes);


app.use(`${process.env.API}/uploads`, express.static('uploads'));


const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;

