import { createPool } from "mysql";
import dotenv from "dotenv";
dotenv.config();

const options = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE,
};

const pool = createPool(options);

export function execQuery(query = "", params = []) {
  return new Promise((resolve, reject) => {
    pool.getConnection((errorPool, connection) => {
      if (errorPool) {
        console.log(`ErrorPool: ${errorPool}`);
        return createPool(options);
      } else {
        connection.query(query, [params], (error, results, _) => {
          console.log(query);
          connection.release();
          if (error) {
            console.log(`ErrorQuery: ${error}`);
            reject(error);
          }
          return resolve(results);
        });
      }
    });
  });
}

// export function execMutation({mutation = '', params = [], method = ''}) {
//   return new Promise((resolve, reject) => {
//     pool.getConnection((errorPool, connection) => {
//       if (errorPool) {
//         console.log(`ErrorPool: ${errorPool}`)
//         return createPool(options)
//       } else {
//         const param = method === 'UPDATE' ? params : [params]
//         connection.query(mutation, param, (error, results, _) => {
//           connection.release()
//           if (error) {
//             console.log(`ErrorMutation: ${error} - ${mutation}`)
//             reject(error)
//           }
//           return resolve(results)
//         })
//       }
//     })
//   })
// }
