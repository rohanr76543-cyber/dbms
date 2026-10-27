const db = require('../config/db');

async function getTeams() {
  const [teams] = await db.query('SELECT TEAM_ID, TEAM_NAME FROM TEAMS ORDER BY TEAM_NAME');
  return teams;
}

exports.listPlayers = async (req, res) => {
  try {
    const [players] = await db.query(`
      SELECT PLAYERS.*, TEAMS.TEAM_NAME
      FROM PLAYERS
      JOIN TEAMS ON PLAYERS.TEAM_ID = TEAMS.TEAM_ID
      ORDER BY PLAYERS.PLY_ID
    `);
    res.render('players', { title: 'Players', players });
  } catch (error) {
    req.session.error = 'Unable to fetch players.';
    res.redirect('/');
  }
};

exports.showAddPlayer = async (req, res) => {
  const teams = await getTeams();
  res.render('addPlayer', { title: 'Add Player', player: null, teams, formAction: '/players/add' });
};

exports.addPlayer = async (req, res) => {
  const { PLY_NAME, POSITION, TEAM_ID } = req.body;

  if (!PLY_NAME || !POSITION || !TEAM_ID) {
    req.session.error = 'All player fields are required.';
    return res.redirect('/players/add');
  }

  try {
    await db.query(
      'INSERT INTO PLAYERS (PLY_NAME, POSITION, TEAM_ID) VALUES (?, ?, ?)',
      [PLY_NAME, POSITION, TEAM_ID]
    );
    req.session.success = 'Player added successfully.';
    res.redirect('/players');
  } catch (error) {
    req.session.error = 'Unable to add player. Please select a valid team.';
    res.redirect('/players/add');
  }
};

exports.showEditPlayer = async (req, res) => {
  try {
    const [players] = await db.query('SELECT * FROM PLAYERS WHERE PLY_ID = ?', [req.params.id]);
    if (players.length === 0) {
      req.session.error = 'Player not found.';
      return res.redirect('/players');
    }
    const teams = await getTeams();
    res.render('addPlayer', { title: 'Edit Player', player: players[0], teams, formAction: `/players/edit/${req.params.id}` });
  } catch (error) {
    req.session.error = 'Unable to load player.';
    res.redirect('/players');
  }
};

exports.updatePlayer = async (req, res) => {
  const { PLY_NAME, POSITION, TEAM_ID } = req.body;

  if (!PLY_NAME || !POSITION || !TEAM_ID) {
    req.session.error = 'All player fields are required.';
    return res.redirect(`/players/edit/${req.params.id}`);
  }

  try {
    await db.query(
      'UPDATE PLAYERS SET PLY_NAME = ?, POSITION = ?, TEAM_ID = ? WHERE PLY_ID = ?',
      [PLY_NAME, POSITION, TEAM_ID, req.params.id]
    );
    req.session.success = 'Player updated successfully.';
    res.redirect('/players');
  } catch (error) {
    req.session.error = 'Unable to update player. Please select a valid team.';
    res.redirect(`/players/edit/${req.params.id}`);
  }
};

exports.deletePlayer = async (req, res) => {
  try {
    await db.query('DELETE FROM PLAYERS WHERE PLY_ID = ?', [req.params.id]);
    req.session.success = 'Player deleted successfully.';
  } catch (error) {
    req.session.error = 'Unable to delete player.';
  }
  res.redirect('/players');
};
