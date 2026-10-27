const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

router.get('/', scoreController.listScores);
router.get('/add', scoreController.showAddScore);
router.post('/add', scoreController.addScore);
router.get('/edit/:id', scoreController.showEditScore);
router.post('/edit/:id', scoreController.updateScore);
router.get('/delete/:id', scoreController.deleteScore);

module.exports = router;
