var express = require('express');
var router = express.Router();
var databaseModule=require('./dataBase.js');
var bodyParser = require('body-parser');

var query='';

router.post('/:playerId/:characterId', function(req,res){
  var playerId = req.params.playerId;
  var characterId = req.params.characterId;

  var statsToIncrease = req.body.statsToIncrease;
  var pointsToAdd = req.body.pointsToAdd;

  query = 'SELECT {0} FROM playercharacter WHERE player_id IN ({1}) AND character_id IN ({2});';
  query = query.replace('{0}',statsToIncrease);
  query = query.replace('{1}', playerId);
  query = query.replace('{2}',characterId);

  var stats = 0;

  try {
      databaseModule.execute(query, function(result){
        switch (statsToIncrease) {
          case "health_points":
            stats = +result[0].health_points + +pointsToAdd;
            break;
          case "attack_points":
            stats = +result[0].attack_points + +pointsToAdd;
            break;
          case "defense_points":
            stats = +result[0].defense_points + +pointsToAdd;
            break;
          case "sp_attack_points":
            stats = +result[0].sp_attack_points + +pointsToAdd;
            break;
          case "sp_defense_points":
            stats = +result[0].sp_defense_points + +pointsToAdd;
            break;
          default:
            console.warn('This is not an stat!')
        }

        query = 'UPDATE playercharacter SET {0} = {1} WHERE player_id IN ({2}) AND character_id IN ({3});';
        query = query.replace('{0}', statsToIncrease);
        query = query.replace('{1}', stats);
        query = query.replace('{2}', playerId);
        query = query.replace('{3}', characterId);
        try {
          databaseModule.execute(query,function(result){
              res.send('Stats Added!');
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
