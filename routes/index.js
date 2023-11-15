const express = require('express');
const router = express.Router();

const routes = require('./web');

router.use(routes);

router.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = router;