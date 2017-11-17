# API_Example

This is an example API for computing player bowling scores as requested for a job interview.  It turns out the rules to calculate bowling scores are not entirely straightforward!  (Learn more [here](http://slocums.homestead.com/gamescore.html).)

The server runs in Node.js/Express.js - use `npm install` to download dependencies and `npm test` to start the server.  A complete RESTful test procedure (using Mocha and Chai) is also included, and can be run using the `npm test` command.

## API Reference:
* GET: /
    * Retrieves all player scores
* GET: /name/
    * Retrieves score & game state for specified player name
* POST: /
    * Takes JSON:
        * `name`: {string: new player name}
    * Creates a new player if none exists with that name
* POST: /name/
    * Takes JSON:
        * `roll`: {int: player's last roll (0 to 10 points)}
    * Returns updated player score & game state if roll is valid

* PUT: /name/
    * Resets game (i.e. new game) for specified player name
    * Returns updated player score & game state

* DELETE: /name/
    * Removes player from database
    