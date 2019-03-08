class UserModel {
  getAccessToken(user_id, team_id, req) {
    return new Promise((resolve, reject) => {
      req.db.query(
        `SELECT token FROM users
        WHERE user_id = ? AND team_id = ?`,
        [user_id, team_id],
        (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  saveToken(user_id, team_id, token, req) {
    return new Promise((resolve, reject) => {
      req.db.query(
        `INSERT INTO users (user_id, team_id, token)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE token = ?`,
        [user_id, team_id, token, token],
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }
}

module.exports = new UserModel();
