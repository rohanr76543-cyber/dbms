const express = require('express');
const path = require('path');
const sessionConfig = require('./config/sessionConfig');

const teamRoutes = require('./routes/teamRoutes');
const coachRoutes = require('./routes/coachRoutes');
const playerRoutes = require('./routes/playerRoutes');
const matchRoutes = require('./routes/matchRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure EJS template engine.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse form submissions and serve static assets.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionConfig);

// Make flash-style session messages available in all views.
app.use((req, res, next) => {
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;
  delete req.session.success;
  delete req.session.error;
  next();
});

// Dashboard route.
app.get('/', async (req, res) => {
  try {
    const [[teamCount], [playerCount], [coachCount], [matchCount]] = await Promise.all([
      db.query('SELECT COUNT(*) AS total FROM TEAMS'),
      db.query('SELECT COUNT(*) AS total FROM PLAYERS'),
      db.query('SELECT COUNT(*) AS total FROM COACH'),
      db.query('SELECT COUNT(*) AS total FROM MATCHS')
    ]);

    res.render('index', {
      title: 'Dashboard',
      counts: {
        teams: teamCount[0].total,
        players: playerCount[0].total,
        coaches: coachCount[0].total,
        matches: matchCount[0].total
      }
    });
  } catch (error) {
    res.status(500).render('index', {
      title: 'Dashboard',
      counts: { teams: 0, players: 0, coaches: 0, matches: 0 },
      pageError: 'Unable to load dashboard. Please check the database connection.'
    });
  }
});

// MVC route modules.
app.use('/teams', teamRoutes);
app.use('/coaches', coachRoutes);
app.use('/players', playerRoutes);
app.use('/matches', matchRoutes);
app.use('/scores', scoreRoutes);

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Sports Tournament Management System running at http://localhost:${PORT}`);
});
