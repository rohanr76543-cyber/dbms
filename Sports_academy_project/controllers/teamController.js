const db = require('../config/db');

exports.listTeams = async (req, res) => {
  try {
    const [teams] = await db.query('SELECT * FROM TEAMS ORDER BY TEAM_ID');
    res.render('teams', { title: 'Teams', teams });
  } catch (error) {
    req.session.error = 'Unable to fetch teams.';
    res.redirect('/');
  }
};

exports.showAddTeam = (req, res) => {
  res.render('addTeam', { title: 'Add Team', team: null, formAction: '/teams/add' });
};

exports.addTeam = async (req, res) => {
  const { TEAM_NAME, COACH_NAME, HOME_GROUND } = req.body;

  if (!TEAM_NAME || !COACH_NAME || !HOME_GROUND) {
    req.session.error = 'All team fields are required.';
    return res.redirect('/teams/add');
  }

  try {
    await db.query(
      'INSERT INTO TEAMS (TEAM_NAME, COACH_NAME, HOME_GROUND) VALUES (?, ?, ?)',
      [TEAM_NAME, COACH_NAME, HOME_GROUND]
    );
    req.session.success = 'Team added successfully.';
    res.redirect('/teams');
  } catch (error) {
    req.session.error = 'Unable to add team.';
    res.redirect('/teams/add');
  }
};

exports.showEditTeam = async (req, res) => {
  try {
    const [teams] = await db.query('SELECT * FROM TEAMS WHERE TEAM_ID = ?', [req.params.id]);
    if (teams.length === 0) {
      req.session.error = 'Team not found.';
      return res.redirect('/teams');
    }
    res.render('addTeam', { title: 'Edit Team', team: teams[0], formAction: `/teams/edit/${req.params.id}` });
  } catch (error) {
    req.session.error = 'Unable to load team.';
    res.redirect('/teams');
  }
};

exports.updateTeam = async (req, res) => {
  const { TEAM_NAME, COACH_NAME, HOME_GROUND } = req.body;

  if (!TEAM_NAME || !COACH_NAME || !HOME_GROUND) {
    req.session.error = 'All team fields are required.';
    return res.redirect(`/teams/edit/${req.params.id}`);
  }

  try {
    await db.query(
      'UPDATE TEAMS SET TEAM_NAME = ?, COACH_NAME = ?, HOME_GROUND = ? WHERE TEAM_ID = ?',
      [TEAM_NAME, COACH_NAME, HOME_GROUND, req.params.id]
    );
    req.session.success = 'Team updated successfully.';
    res.redirect('/teams');
  } catch (error) {
    req.session.error = 'Unable to update team.';
    res.redirect(`/teams/edit/${req.params.id}`);
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    await db.query('DELETE FROM TEAMS WHERE TEAM_ID = ?', [req.params.id]);
    req.session.success = 'Team deleted successfully.';
  } catch (error) {
    req.session.error = 'Cannot delete team because related records exist.';
  }
  res.redirect('/teams');
};
