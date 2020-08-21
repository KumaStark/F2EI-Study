const dbPool = require("./database")();

module.exports = {
  saveToDatabase: async (fileName) => {
    return new Promise((resolve, reject) => {
      dbPool.getConnection(function (error, conn) {
        conn.query(
          "insert into `photos` (`fileName`) values (?)",
          [fileName],
          function (err, rs) {
            if (err) {
              reject(err);
            } else {
              resolve(rs);
            }
            conn.release();
          }
        );
      });
    });
  },
  getAllPhotos: async () => {
    return new Promise((resolve, reject) => {
      dbPool.getConnection(function (error, conn) {
        conn.query("select * from `photos`", function (err, rs) {
          if (err) {
            reject(err);
          } else {
            resolve(rs);
          }
          conn.release();
        });
      });
    });
  },
  clearAllPhotos: async()=>{
    return new Promise((resolve, reject) => {
      dbPool.getConnection(function (error, conn) {
        conn.query("truncate table `photos`", function (err, rs) {
          if (err) {
            reject(err);
          } else {
            resolve(rs);
          }
          conn.release();
        });
      });
    });
  }
};
