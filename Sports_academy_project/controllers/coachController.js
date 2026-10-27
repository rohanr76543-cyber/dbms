const db = require('../config/db');

async function getTeams() {
  const [teams] = await db.query('SELECT TEAM_ID, TEAM_NAME FROM TEAMS ORDER BY TEAM_NAME');
  return teams;
}

exports.listCoaches = async (req, res) => {
  try {
    const [coaches] = await db.query(`
      SELECT COACH.*, TEAMS.TEAM_NAME
      FROM COACH
      JOIN TEAMS ON COACH.TEAM_ID = TEAMS.TEAM_ID
      ORDER BY COACH.COACH_ID
    `);
    res.render('coaches', { title: 'Coaches', coaches });
  } catch (error) {
    req.session.error = 'Unable to fetch coaches.';
    res.redirect('/');
  }
};

exports.showAddCoach = async (req, res) => {
  const teams = await getTeams();
  res.render('addCoach', { title: 'Add Coach', coach: null, teams, formAction: '/coaches/add' });
};

exports.addCoach = async (req, res) => {
  const { COACH_NAME, EXPERIENCE, COACH_AGE, TEAM_ID } = req.body;

  if (!COACH_NAME || !EXPERIENCE || !COACH_AGE || !TEAM_ID) {
    req.session.error = 'All coach fields are required.';
    return res.redirect('/coaches/add');
  }

  try {
    await db.query(
      'INSERT INTO COACH (COACH_NAME, EXPERIENCE, COACH_AGE, TEAM_ID) VALUES (?, ?, ?, ?)',
      [COACH_NAME, EXPERIENCE, COACH_AGE, TEAM_ID]
    );
    req.session.success = 'Coach added successfully.';
    res.redirect('/coaches');
  } catch (error) {
    req.session.error = 'Unable to add coach. Please select a valid team.';
    res.redirect('/coaches/add');
  }
};

exports.showEditCoach = async (req, res) => {
  try {
    const [coaches] = await db.query('SELECT * FROM COACH WHERE COACH_ID = ?', [req.params.id]);
    if (coaches.length === 0) {
      req.session.error = 'Coach not found.';
      return res.redirect('/coaches');
    }
    const teams = await getTeams();
    res.render('addCoach', { title: 'Edit Coach', coach: coaches[0], teams, formAction: `/coaches/edit/${req.params.id}` });
  } catch (error) {
    req.session.error = 'Unable to load coach.';
    res.redirect('/coaches');
  }
};

exports.updateCoach = async (req, res) => {
  const { COACH_NAME, EXPERIENCE, COACH_AGE, TEAM_ID } = req.body;

  if (!COACH_NAME || !EXPERIENCE || !COACH_AGE || !TEAM_ID) {
    req.session.error = 'All coach fields are required.';
    return res.redirect(`/coaches/edit/${req.params.id}`);
  }

  try {
    await db.query(
      'UPDATE COACH SET COACH_NAME = ?, EXPERIENCE = ?, COACH_AGE = ?, TEAM_ID = ? WHERE COACH_ID = ?',
      [COACH_NAME, EXPERIENCE, COACH_AGE, TEAM_ID, req.params.id]
    );
    req.session.success = 'Coach updated successfully.';
    res.redirect('/coaches');
  } catch (error) {
    req.session.error = 'Unable to update coach. Please select a valid team.';
    res.redirect(`/coaches/edit/${req.params.id}`);
  }
};

exports.deleteCoach = async (req, res) => {
  try {
    await db.query('DELETE FROM COACH WHERE COACH_ID = ?', [req.params.id]);
    req.session.success = 'Coach deleted successfully.';
  } catch (error) {
    req.session.error = 'Unable to delete coach.';
  }
  res.redirect('/coaches');
};
