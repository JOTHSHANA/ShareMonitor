const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const subjectRoutes = require('./routes/subjectRoutes');
const levelRoutes = require('./routes/levelroutes');
const documentRoutes = require('./routes/documentroutes');
const folderRoutes = require('./routes/folderroutes');

const cors = require('cors');
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use('/api', subjectRoutes);
app.use('/api', levelRoutes);
app.use('/api', documentRoutes);
app.use('/api', folderRoutes);

app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;