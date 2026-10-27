const db = require('../config/db');

async function getMatches() {
  const [matches] = await db.query(`
    SELECT M.MATCH_ID, M.DATE, HT.TEAM_NAME AS HOME_TEAM, AT.TEAM_NAME AS AWAY_TEAM
    FROM MATCHS M
    JOIN TEAMS HT ON M.HOME_TEAM_ID = HT.TEAM_ID
    JOIN TEAMS AT ON M.AWAY_TEAM_ID = AT.TEAM_ID
    ORDER BY M.MATCH_ID
  `);
  return matches;
}

exports.listScores = async (req, res) => {
  try {
    const [scores] = await db.query(`
      SELECT SCORE.*, M.DATE, HT.TEAM_NAME AS HOME_TEAM, AT.TEAM_NAME AS AWAY_TEAM
      FROM SCORE
      JOIN MATCHS M ON SCORE.MATCH_ID = M.MATCH_ID
      JOIN TEAMS HT ON M.HOME_TEAM_ID = HT.TEAM_ID
      JOIN TEAMS AT ON M.AWAY_TEAM_ID = AT.TEAM_ID
      ORDER BY SCORE.MATCH_ID
    `);
    res.render('scores', { title: 'Scores', scores });
  } catch (error) {
    req.session.error = 'Unable to fetch scores.';
    res.redirect('/');
  }
};

exports.showAddScore = async (req, res) => {
  const matches = await getMatches();
  res.render('addScore', { title: 'Add Score', score: null, matches, formAction: '/scores/add' });
};

exports.addScore = async (req, res) => {
  const { MATCH_ID, HOME_SCORE, AWAY_SCORE, WIN_TEAM } = req.body;

  if (!MATCH_ID || HOME_SCORE === '' || AWAY_SCORE === '' || !WIN_TEAM) {
    req.session.error = 'All score fields are required.';
    return res.redirect('/scores/add');
  }

  try {
    await db.query(
      'INSERT INTO SCORE (MATCH_ID, HOME_SCORE, AWAY_SCORE, WIN_TEAM) VALUES (?, ?, ?, ?)',
      [MATCH_ID, HOME_SCORE, AWAY_SCORE, WIN_TEAM]
    );
    req.session.success = 'Score added successfully.';
    res.redirect('/scores');
  } catch (error) {
    req.session.error = 'Unable to add score. Each match can have only one score entry.';
    res.redirect('/scores/add');
  }
};

exports.showEditScore = async (req, res) => {
  try {
    const [scores] = await db.query('SELECT * FROM SCORE WHERE MATCH_ID = ?', [req.params.id]);
    if (scores.length === 0) {
      req.session.error = 'Score not found.';
      return res.redirect('/scores');
    }
    const matches = await getMatches();
    res.render('addScore', { title: 'Edit Score', score: scores[0], matches, formAction: `/scores/edit/${req.params.id}` });
  } catch (error) {
    req.session.error = 'Unable to load score.';
    res.redirect('/scores');
  }
};

exports.updateScore = async (req, res) => {
  const { MATCH_ID, HOME_SCORE, AWAY_SCORE, WIN_TEAM } = req.body;

  if (!MATCH_ID || HOME_SCORE === '' || AWAY_SCORE === '' || !WIN_TEAM) {
    req.session.error = 'All score fields are required.';
    return res.redirect(`/scores/edit/${req.params.id}`);
  }

  try {
    await db.query(
      'UPDATE SCORE SET MATCH_ID = ?, HOME_SCORE = ?, AWAY_SCORE = ?, WIN_TEAM = ? WHERE MATCH_ID = ?',
      [MATCH_ID, HOME_SCORE, AWAY_SCORE, WIN_TEAM, req.params.id]
    );
    req.session.success = 'Score updated successfully.';
    res.redirect('/scores');
  } catch (error) {
    req.session.error = 'Unable to update score. Match must be valid and unique.';
    res.redirect(`/scores/edit/${req.params.id}`);
  }
};

exports.deleteScore = async (req, res) => {
  try {
    await db.query('DELETE FROM SCORE WHERE MATCH_ID = ?', [req.params.id]);
    req.session.success = 'Score deleted successfully.';
  } catch (error) {
    req.session.error = 'Unable to delete score.';
  }
  res.redirect('/scores');
};
