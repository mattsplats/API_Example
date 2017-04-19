'use strict';

const express = require('express'),
      router  = express.Router(),
      db      = require('../db/mock_db.js'),
      bowl    = require('../helpers/bowling.js');

/**
 * Attempt to find player first, then create if not found
 * Required inputs: playerName
 * 
 * Outputs created player as JSON
 */
router.post('/', (req, res) => {
  const name = req.body.name;
  
  if (name === undefined || name === '') {
    res.status(400).send('Name parameter required');
  
  } else {
    db.get(name)
      .then(player => {
        if (player !== undefined) {
          res.status(400).send('Player already exists');

        } else {
          db.create(name)
            .then(newPlayer => res.status(201).json(newPlayer))
            .catch(err      => res.status(500).send(err.message));
        }
      })
      .catch(err => res.status(500).send(err.message));
  }
});

/**
 * Retrieve all players in the system
 * 
 * Outputs array of player objects as JSON
 */
router.get('/', (req, res) => {
  db.getAll()
    .then(players => res.json(players))
    .catch(err    => res.status(500).send(err.message));
});

/**
 * Retrieve player by name
 * 
 * Outputs player object as JSON
 */
router.get('/:name', (req, res) => {
  const name = req.params.name;

  if (name === undefined || name === '') {
    res.status(400).send('Name parameter required');
  
  } else {
    db.get(name)
      .then(player => {
        if (typeof player === 'undefined') {
          res.status(404).send(`No player with the name: ${name}`);
        
        } else {
          res.json(player);
        }
      })
      .catch(err => res.status(500).send(err.message));
  }
});

/**
 * Modify player by adding new roll to existing score
 * POST is used here instead of PUT as the operation is not idempotent!
 * 
 * Outputs player object as JSON
 */
router.post('/:name', (req, res) => {
  const name  = req.params.name,
        roll  = req.body.roll;

  if (typeof name === 'undefined' || name === '') {
    res.status(400).send('Name parameter required');

  } else if (typeof roll !== 'number' || roll < 0 || roll > 10) {
    res.status(400).send('Roll must be a number between 0 and 10');
  
  } else {
    db.get(name)  
      .then(player => {
        if (typeof player === 'undefined') {
          res.status(404).send(`No player with the name: ${name}`);

        } else if (player.gameOver) {
          res.status(400).send(`Player's game is over - PUT /api/:name to reset game`);

        } else if (!bowl.validateRoll(player, roll)) {
          res.status(400).send('Invalid roll: open frame must not exceed 10 total');
        
        } else {
          bowl.updatePlayer(player, roll);
          db.update(name, player)  // Technically not necessary as the object has already been mutated...
            .then(update => res.json(update))
            .catch(err   => res.status(500).send(err.message));
        }
      })
      .catch(err => res.status(500).send(err.message));
  }
});

/**
 * Modify player by resetting game
 * 
 * Outputs player object as JSON
 */
router.put('/:name', (req, res) => {
  const name = req.params.name;

  if (typeof name === 'undefined' || name === '') {
    res.status(400).send('Name parameter required');

  } else {
    db.get(name)  
      .then(player => {
        if (typeof player === 'undefined') {
          res.status(404).send(`No player with the name: ${name}`);

        } else {
          player.score = 0;
          player.frames = [];
          player.onFrame = 1;
          player.gameOver = false;
          
          db.update(name, player)  // Technically not necessary as the object has already been mutated...
            .then(player => res.json(player))
            .catch(err   => res.status(500).send(err.message));
        }
      })
      .catch(err => res.status(500).send(err.message));
  }
});

/**
 * Delete player by name
 * 
 * Outputs no content
 */
router.delete('/:name', (req, res) => {
  const name = req.params.name;
  
  if (name === undefined || name === '') {
    res.status(400).send('Name parameter required');

  } else {
    const player = db.get(name);

    if (typeof player === 'undefined') {
      res.status(404).send(`No player with the name: ${name}`);
    
    } else {
      db.delete(name)
        .then(()   => res.sendStatus(204))
        .catch(err => res.status(500).send(err.message));
      ;
    }
  }
});

module.exports = router;