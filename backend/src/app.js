const express = require('express');
const app = express();
const subjectRoutes = require('./routes/subjectRoutes');
const levelRoutes = require('./routes/levelroutes');
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use('/api', subjectRoutes);
app.use('/api', levelRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
