'use strict';

module.exports = (function () {
  const data = new Map();  // Players indexed by name
  let currID = 1;          // Autoincrement ID

  return {
    /**
     * Creates new player and adds to db
     * @param {string} name - player name string
     * @returns {Promise} - when resolved, data = player object
     */
    create: function (name) {
      return new Promise((resolve, reject) => {
        const newPlayer = {
          id: currID++,  // Uses currID value, then increments
          name: name,
          score: 0,
          frames: [],
          onFrame: 1,
          gameOver: false
        }

        data.set(name, newPlayer);
        return resolve(newPlayer);
      });
    },

    /**
     * Retrieves player by name
     * @param {string} name - player name string
     * @returns {Promise} - when resolved, data = player object
     */
    get: function (name) {
      return new Promise((resolve, reject) => resolve(data.get(name)));
    },

    /**
     * Retrieves all players in db
     * @returns {Array} - all player objects
     */
    getAll: function () {
      return new Promise((resolve, reject) => resolve([...data.values()]));  // Values returns an iterator, spread operator converts to array
    },

    /**
     * Updates player by name
     * @param {string} name - player name string
     * @param {Object} player - score of the current roll
     * @returns {Promise} - when resolved, data = player object
     */
    update: function(name, player) {
      return new Promise((resolve, reject) => {
        if (data.has(name)) {
          data.set(name, player);
          return resolve(player);
        }

        return reject(new Error('Update on non-existing entity'));
      });
    },
    
    /**
     * Deletes player by name
     * @param {string} name - player name string
     * @returns {Promise} - contains no data
     */
    delete: function (name) {
      return new Promise((resolve, reject) => {
        data.delete(name);
        return resolve();
      })
    }
  };
})();