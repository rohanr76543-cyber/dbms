const db = require('../config/db');

async function getTeams() {
  const [teams] = await db.query('SELECT TEAM_ID, TEAM_NAME FROM TEAMS ORDER BY TEAM_NAME');
  return teams;
}

exports.listMatches = async (req, res) => {
  try {
    const [matches] = await db.query(`
      SELECT M.MATCH_ID, M.DATE, M.GROUND,
             HT.TEAM_NAME AS HOME_TEAM,
             AT.TEAM_NAME AS AWAY_TEAM
      FROM MATCHS M
      JOIN TEAMS HT ON M.HOME_TEAM_ID = HT.TEAM_ID
      JOIN TEAMS AT ON M.AWAY_TEAM_ID = AT.TEAM_ID
      ORDER BY M.MATCH_ID
    `);
    res.render('matches', { title: 'Matches', matches });
  } catch (error) {
    req.session.error = 'Unable to fetch matches.';
    res.redirect('/');
  }
};

exports.showAddMatch = async (req, res) => {
  const teams = await getTeams();
  res.render('addMatch', { title: 'Add Match', match: null, teams, formAction: '/matches/add' });
};

exports.addMatch = async (req, res) => {
  const { DATE, GROUND, HOME_TEAM_ID, AWAY_TEAM_ID } = req.body;

  if (!DATE || !GROUND || !HOME_TEAM_ID || !AWAY_TEAM_ID) {
    req.session.error = 'All match fields are required.';
    return res.redirect('/matches/add');
  }

  if (HOME_TEAM_ID === AWAY_TEAM_ID) {
    req.session.error = 'Home team and away team must be different.';
    return res.redirect('/matches/add');
  }

  try {
    await db.query(
      'INSERT INTO MATCHS (DATE, GROUND, HOME_TEAM_ID, AWAY_TEAM_ID) VALUES (?, ?, ?, ?)',
      [DATE, GROUND, HOME_TEAM_ID, AWAY_TEAM_ID]
    );
    req.session.success = 'Match added successfully.';
    res.redirect('/matches');
  } catch (error) {
    req.session.error = 'Unable to add match. Please select valid teams.';
    res.redirect('/matches/add');
  }
};

exports.showEditMatch = async (req, res) => {
  try {
    const [matches] = await db.query('SELECT * FROM MATCHS WHERE MATCH_ID = ?', [req.params.id]);
    if (matches.length === 0) {
      req.session.error = 'Match not found.';
      return res.redirect('/matches');
    }
    const teams = await getTeams();
    res.render('addMatch', { title: 'Edit Match', match: matches[0], teams, formAction: `/matches/edit/${req.params.id}` });
  } catch (error) {
    req.session.error = 'Unable to load match.';
    res.redirect('/matches');
  }
};

exports.updateMatch = async (req, res) => {
  const { DATE, GROUND, HOME_TEAM_ID, AWAY_TEAM_ID } = req.body;

  if (!DATE || !GROUND || !HOME_TEAM_ID || !AWAY_TEAM_ID) {
    req.session.error = 'All match fields are required.';
    return res.redirect(`/matches/edit/${req.params.id}`);
  }

  if (HOME_TEAM_ID === AWAY_TEAM_ID) {
    req.session.error = 'Home team and away team must be different.';
    return res.redirect(`/matches/edit/${req.params.id}`);
  }

  try {
    await db.query(
      'UPDATE MATCHS SET DATE = ?, GROUND = ?, HOME_TEAM_ID = ?, AWAY_TEAM_ID = ? WHERE MATCH_ID = ?',
      [DATE, GROUND, HOME_TEAM_ID, AWAY_TEAM_ID, req.params.id]
    );
    req.session.success = 'Match updated successfully.';
    res.redirect('/matches');
  } catch (error) {
    req.session.error = 'Unable to update match. Please select valid teams.';
    res.redirect(`/matches/edit/${req.params.id}`);
  }
};

exports.deleteMatch = async (req, res) => {
  try {
    await db.query('DELETE FROM MATCHS WHERE MATCH_ID = ?', [req.params.id]);
    req.session.success = 'Match deleted successfully.';
  } catch (error) {
    req.session.error = 'Cannot delete match because a score entry exists.';
  }
  res.redirect('/matches');
};
