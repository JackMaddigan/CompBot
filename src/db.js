const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
  "./comp.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) return console.error(err.message);
  }
);

db.run(`
        CREATE TABLE IF NOT EXISTS guilds (
            guild_id TEXT PRIMARY KEY UNIQUE,
            guild_name TEXT,
            scramble_channel TEXT,
            results_channel TEXT,
            submit_channel TEXT,
            role_id TEXT,
            cron TEXT,
            week INTEGER,
            results_file BOOLEAN,
            initial_week INTEGER
        )
    `);

db.run(`
        CREATE TABLE IF NOT EXISTS events (
            event_id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_name TEXT,
            event_format TEXT,
            event_attempts INTEGER,
            scramble TEXT,
            guild_id TEXT,
            FOREIGN KEY (guild_id) REFERENCES guilds(guild_id)
        )
    `);

db.run(`CREATE TABLE IF NOT EXISTS results (
            result_id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER,
            guild_id TEXT,
            user_id TEXT,
            user_name TEXT,
            result_average INTEGER,
            result_best INTEGER,
            FOREIGN KEY (event_id) REFERENCES events(event_id),
            FOREIGN KEY (guild_id) REFERENCES guilds(guild_id),
            UNIQUE(event_id, guild_id, user_id)
  )`);

async function saveData(query, parameters) {
  try {
    return await new Promise((resolve, reject) => {
      db.run(query, parameters, function (err) {
        if (err) {
          console.error(err.message);
          reject();
        }
        resolve();
      });
    });
  } catch (err_1) {
    return console.error(err_1);
  }
}

function readData(query, parameters) {
  return new Promise((resolve, reject) => {
    db.all(query, parameters, function (err, rows) {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      resolve(rows);
    });
  });
}

function deleteData(query, parameters) {
  return new Promise((resolve, reject) => {
    db.run(query, parameters, function (err) {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      resolve();
    });
  });
}

module.exports = {
  saveData,
  readData,
  deleteData,
};
