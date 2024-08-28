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
const resources = require('./routes/auth/res_route')


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


app.use("/api", resources);
app.use("/auth", auth);
app.use('/api', subjectRoutes);
app.use('/api', levelRoutes);
app.use('/api', documentRoutes);
app.use('/api', folderRoutes);
app.use('/api', trashRoutes);
app.use('/api', loginRoutes);


app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;

