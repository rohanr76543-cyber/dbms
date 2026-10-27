const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.get('/', playerController.listPlayers);
router.get('/add', playerController.showAddPlayer);
router.post('/add', playerController.addPlayer);
router.get('/edit/:id', playerController.showEditPlayer);
router.post('/edit/:id', playerController.updatePlayer);
router.get('/delete/:id', playerController.deletePlayer);

module.exports = router;
