const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.get('/', matchController.listMatches);
router.get('/add', matchController.showAddMatch);
router.post('/add', matchController.addMatch);
router.get('/edit/:id', matchController.showEditMatch);
router.post('/edit/:id', matchController.updateMatch);
router.get('/delete/:id', matchController.deleteMatch);

module.exports = router;
