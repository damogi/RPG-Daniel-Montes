var express = require('express');
var router = express.Router();
var databaseModule=require('./dataBase.js');
var bodyParser = require('body-parser');

var query='';

router.post('/:winnerId/:losserId', function(req,res){
    var winnerId = req.params.winnerId;
    var losserId = req.params.losserId;

    var pointsForWinner = req.body.pointsForWinner;
    var pointsForLosser = req.body.pointsForLosser;

    query = 'SELECT "player_id", "score" FROM "leaderboard" WHERE "player_id" = 1 OR player_id = 2;';
    query = query.replace('{0}', winnerId);
    query = query.replace('{1}', losserId);

    var winnerScore = 0;
    var losserScore = 0;

    try {
      databaseModule.execute(query,function(result){

        winnerScore = result[0].score;
        losserScore = result[1].score;

        winnerScore = +winnerScore + +pointsForWinner;
        losserScore = +losserScore + +pointsForLosser;

        try {
          query = 'UPDATE "leaderboard" SET "score" = {0} WHERE "player_id" = {1};';
          query = query.replace('{0}', winnerScore);
          query = query.replace('{1}', winnerId);

          databaseModule.execute(query,function(result){

            try {
              query = 'UPDATE "leaderboard" SET "score" = ({0}) WHERE "player_id" = ({1});';
              query = query.replace('{0}',losserScore);
              query = query.replace('{1}',losserId);

              databaseModule.execute(query,function(result){
                res.send('Battle Reported!');
              });
            } catch (e) {
              console.log(e);
            }
          });
        } catch (e) {
          console.log(e);
        }
      });
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
