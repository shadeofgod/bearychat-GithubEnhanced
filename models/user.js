function query(db, sql, inserts) {
  return new Promise((resolve, reject) => {
    db.query(sql, inserts, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

class UserModel {
  async getAccessToken(user_id, team_id, req) {
    return await query(
      req.db,
      `SELECT token FROM users WHERE user_id = ? AND team_id = ?`,
      [user_id, team_id]
    );
  }

  async saveToken(user_id, team_id, token, req) {
    return await query(
      req.db,
      `INSERT INTO users (user_id, team_id, token) VALUES (?, ?, ?)`,
      [user_id, team_id, token],
    );
  }

  async removeToken(user_id, team_id, req) {
    return await query(
      req.db,
      `DELETE FROM users WHERE user_id = ? AND team_id = ?`,
      [user_id, team_id],
    );
  }
}

module.exports = new UserModel();
