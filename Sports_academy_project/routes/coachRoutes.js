const express = require('express');
const router = express.Router();
const coachController = require('../controllers/coachController');

router.get('/', coachController.listCoaches);
router.get('/add', coachController.showAddCoach);
router.post('/add', coachController.addCoach);
router.get('/edit/:id', coachController.showEditCoach);
router.post('/edit/:id', coachController.updateCoach);
router.get('/delete/:id', coachController.deleteCoach);

module.exports = router;
