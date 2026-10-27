# Sports Tournament Management System

A full-stack DBMS mini project built with Node.js, Express.js, MySQL, express-session, and EJS using strict MVC architecture.

## Project Description

This project manages the entities from the given ER diagram:

- Teams
- Coaches
- Players
- Matches
- Scores

It includes CRUD operations for every entity, a dashboard with record counts, EJS views, MySQL scripts, reusable partials, and responsive styling.

## Installation

1. Open the project folder:

```bash
cd Sports_Tournament_Management
```

2. Install dependencies:

```bash
npm install
```

3. The project is configured for MySQL user `root`, password `Manipal@123`, and database `sports_academy`.

## Database Setup

Log in to MySQL and run:

```sql
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

To reset the database:

```sql
SOURCE database/reset.sql;
SOURCE database/seed.sql;
```

## Run Project

```bash
npm start
```

Open:

```text
http://localhost:3000
```

## Screenshots

Add screenshots here:

- Dashboard screenshot
- Teams page screenshot
- Players page screenshot
- Matches page screenshot
- Scores page screenshot
