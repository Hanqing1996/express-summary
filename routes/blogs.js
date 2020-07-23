var express = require('express');
var router = express.Router();

/* GET users listing. */
router.use('/:id', function(req, res, next) {
    res.send('blog/:id');
});

router.use('/:id/edit', function(req, res, next) {
    res.send('blog/:id/edit');
});

module.exports = router;
