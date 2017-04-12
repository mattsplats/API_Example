'use strict';

const express = require('express'),
      router  = express.Router(),
      db      = require('../db/mock_db.js');


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
  
  } if (db.get(name) !== undefined) {
    res.status(400).send('Player already exists');

  } else {
    res.status(201).json(db.create(name));
  }
});


/**
 * Retrieve all players in the system
 * 
 * Outputs array of player objects as JSON
 */
router.get('/', (req, res) => {
  res.json(db.getAll());
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
    res.json(db.get(name));
  }
});


/**
 * Update player by name
 * 
 * Outputs player object as JSON
 */
router.put('/:name', (req, res) => {
  const name     = req.params.name,
        lastRoll = req.body.lastRoll;

  if (typeof name === 'undefined' || name === '') {
    res.status(400).send('Name parameter required');

  } else if (typeof lastRoll !== 'number' || lastRoll < 0 || lastRoll > 10) {
    res.status(400).send('Last roll must be a number between 0 and 10');

  } else {
    res.json(db.update(name, lastRoll));
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
    db.delete(name);
    res.sendStatus(204);
  }
});

module.exports = router;