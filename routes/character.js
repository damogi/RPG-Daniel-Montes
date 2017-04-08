var express = require('express');
var router = express.Router();
var databaseModule=require('./dataBase.js');
var bodyParser = require('body-parser');

var query = '';

router.get('/:playerId/:characterId', function(req,res){
  var playerId = req.params.playerId;
  var characterId = req.params.characterId;

  query = 'SELECT "character_id", "health_points", "attack_points", "defense_points", "sp_attack_points", "sp_defense_points" FROM "playercharacter" WHERE "player_id" IN ({0}) AND "character_id" IN ({1});';
  query = query.replace('{0}',playerId);
  query = query.replace('{1}',characterId);

  try {
    databaseModule.execute(query, function(result){
      res.send(JSON.stringify(result));
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/:playerId/:characterId', function(req,res){
  var playerId = req.params.playerId;
  var characterId = req.params.characterId;

  query = 'SELECT base_health, base_attack, base_defense, base_sp_attack, base_sp_defense FROM character WHERE character_id IN ({0});';
  query = query.replace('{0}',characterId);

  if(characterId<=5){
    try {
      databaseModule.execute(query, function(result){

      var health_points = result[0].base_health;
      var attack_points = result[0].base_attack;
      var defense_points = result[0].base_defense;
      var sp_attack = result[0].base_sp_attack
      var sp_defense = result[0].base_sp_defense;

      query = "INSERT INTO playercharacter (player_id, character_id, health_points, attack_points, defense_points, sp_attack_points, sp_defense_points) VALUES ('{0}','{1}','{2}','{3}','{4}','{5}','{6}') ON CONFLICT (player_id, character_id) DO NOTHING;";
      query = query.replace('{0}', playerId);
      query = query.replace('{1}', characterId);
      query = query.replace('{2}', health_points);
      query = query.replace('{3}', attack_points);
      query = query.replace('{4}', defense_points);
      query = query.replace('{5}', sp_attack);
      query = query.replace('{6}', sp_defense);

      try {
        databaseModule.execute(query, function(result){
            res.send('Character added');
        });
      } catch (e) {
          console.log(e);
      }
    });
  } catch (e) {
      console.log(e);
    }
  }else{
    res.send('El personaje no existe!');
  }
});

module.exports = router;
