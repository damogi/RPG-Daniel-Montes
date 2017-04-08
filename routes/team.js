var express = require('express');
var router = express.Router();
var databaseModule=require('./dataBase.js');
var bodyParser = require('body-parser');

var query='';

router.get('/:playerId', function(req, res) {
  var playerId = req.params.playerId;

  var query='';

  var character1 = '';
  var character2 = '';
  var character3 = '';

  query = 'SELECT "character_id_1","character_id_2","character_id_3" FROM "team" WHERE player_id IN ({0});';
  query = query.replace('{0}',playerId);

  try {
    databaseModule.execute(query,function(result){
       character1 = result[0].character_id_1;
       character2 = result[0].character_id_2;
       character3 = result[0].character_id_3;

       query = 'SELECT health_points, attack_points, defense_points, sp_attack_points,sp_defense_points, character.character_name, character.element FROM playercharacter INNER JOIN character ON character.character_id = playercharacter.character_id WHERE player_id IN ({0}) AND (playercharacter.character_id IN ({1}) OR playercharacter.character_id IN ({2}) OR playercharacter.character_id IN ({3}));'
       query = query.replace('{0}',playerId);
       query = query.replace('{1}',character1);
       query = query.replace('{2}',character2);
       query = query.replace('{3}',character3);
       try {
         databaseModule.execute(query,function(result){
            res.send(JSON.stringify(result));
         });
       } catch (e) {
          console.log(e);
       }
    });
  } catch (e) {
      console.log(e);
  }
});

router.post('/:playerId', function(req, res) {
  var playerId = req.params.playerId;
  // Body elements
  var charactersID = [
    req.body.character_id_1,
    req.body.character_id_2,
    req.body.character_id_3
  ];
  console.log(charactersID);
  // Response
  var queries = [
    'SELECT "base_health", "base_attack", "base_defense", "base_sp_attack", "base_sp_defense" FROM "character" WHERE "character_id" IN ({0})',
    'SELECT "base_health", "base_attack", "base_defense", "base_sp_attack", "base_sp_defense" FROM "character" WHERE "character_id" IN ({0})',
    'SELECT "base_health", "base_attack", "base_defense", "base_sp_attack", "base_sp_defense" FROM "character" WHERE "character_id" IN ({0})'
  ];
  var baseCharacters = [];

  for (var i = 0; i < queries.length; i++) {
    queries[i] = queries[i].replace('{0}', charactersID[i]);
  }

  try {
    databaseModule.execute(queries[0], function(result) {
      baseCharacters[0] = result[0];

      try {
        databaseModule.execute(queries[1], function(result) {
          baseCharacters[1] = result[0];

          try {
            databaseModule.execute(queries[2], function(result) {
              baseCharacters[2] = result[0];

              queries = [
                'INSERT INTO playercharacter (player_id, character_id, health_points, attack_points, defense_points, sp_attack_points, sp_defense_points) VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}) ON CONFLICT (player_id, character_id) DO NOTHING;',
                'INSERT INTO playercharacter (player_id, character_id, health_points, attack_points, defense_points, sp_attack_points, sp_defense_points) VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}) ON CONFLICT (player_id, character_id) DO NOTHING;',
                'INSERT INTO playercharacter (player_id, character_id, health_points, attack_points, defense_points, sp_attack_points, sp_defense_points) VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}) ON CONFLICT (player_id, character_id) DO NOTHING;'
              ];

              for (var i = 0; i < queries.length; i++) {
                queries[i] = queries[i].replace('{0}', playerId);
                queries[i] = queries[i].replace('{1}', charactersID[i]);
                queries[i] = queries[i].replace('{2}', baseCharacters[i].base_health);
                queries[i] = queries[i].replace('{3}', baseCharacters[i].base_attack);
                queries[i] = queries[i].replace('{4}', baseCharacters[i].base_defense);
                queries[i] = queries[i].replace('{5}', baseCharacters[i].base_sp_attack);
                queries[i] = queries[i].replace('{6}', baseCharacters[i].base_sp_defense);
              }

              try {
                databaseModule.execute(queries[0], function(result) {
                  try {
                    databaseModule.execute(queries[1], function(result) {
                      try {
                        databaseModule.execute(queries[2], function(result) {
                          query = 'UPDATE team SET character_id_1 = {0}, character_id_2 = {1}, character_id_3 = {2} WHERE player_id IN ({3});';
                          query = query.replace('{0}', charactersID[0]);
                          query = query.replace('{1}', charactersID[1]);
                          query = query.replace('{2}', charactersID[2]);
                          query = query.replace('{3}', playerId);

                          try {
                            databaseModule.execute(query, function(result) {
                              res.send('Team modified!');
                            });

                          } catch (error) {
                            console.error(error);
                          }
                        });

                      } catch (error) {
                        console.error(error);
                      }
                    });

                  } catch (error) {
                    console.error(error);
                  }
                });

              } catch (error) {
                console.error(error);
              }
            });

          } catch (error) {
            console.error(error);
          }
        });

      } catch (error) {
        console.error(error);
      }
    });

  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
