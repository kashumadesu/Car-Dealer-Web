const express = require('express');
const cors = require('cors');
const apiRoutes = require('../server/routes/api');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

app.use(express.json());
app.use('/api', apiRoutes);

module.exports = app;
