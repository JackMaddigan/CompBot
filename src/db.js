const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
  "./comp.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) return console.error(err.message);
  }
);

db.run(`
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            guildId TEXT NOT NULL,
            userId TEXT NOT NULL,
            username TEXT NOT NULL,
            eventId TEXT NOT NULL,
            attempts TEXT NOT NULL,
            best INTEGER,
            average INTEGER,
            UNIQUE(guildId, userId, eventId)
        )
    `);

db.run(`
        CREATE TABLE IF NOT EXISTS guilds (
            guildId TEXT PRIMARY KEY UNIQUE,
            events TEXT,
            resultsChannelId,
            scramblesChannelId,
            botChannelId,
            cron
        )
    `);

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
