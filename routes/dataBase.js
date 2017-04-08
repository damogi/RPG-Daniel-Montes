var pg = require('pg');

//Properties
//Execute function
var pool = new pg.Pool();

function execute (query, onCompleted) {
  pool.connect (function (error, client) {
    if (error) return console.error('Error fetching client from pool', error);

    client.query (query, function (error, result) {
      if (error) return console.error('Error running query', error);

      onCompleted (result.rows);

      client.end (function (error) {
        if (error) return console.error('Error ending the client', error);
      });
    });
  });

  pool.on ('error', function (error, client) {
    console.error('Idle client error', error.message, error.stack);
  });
}

//Exporting module
module.exports.execute = execute;
