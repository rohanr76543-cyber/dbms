const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.listTeams);
router.get('/add', teamController.showAddTeam);
router.post('/add', teamController.addTeam);
router.get('/edit/:id', teamController.showEditTeam);
router.post('/edit/:id', teamController.updateTeam);
router.get('/delete/:id', teamController.deleteTeam);

module.exports = router;
