'use strict';

module.exports = (function () {
  const data = new Map();  // Players indexed by name
  let currID = 1;          // Autoincrement ID

  return {
    /**
     * Creates new player and adds to db
     * @param {string} name - player name string
     * @returns {Object} - new player object
     */
    create: function (name) {
      const newPlayer = {
        id: currID++,  // Uses currID value, then increments
        name: name,
        score: 0,
        frames: [],
        onFrame: 1,
        gameOver: false
      }
      
      data.set(name, newPlayer);
      return newPlayer;
    },

    /**
     * Retrieves player by name
     * @param {string} name - player name string
     * @returns {Object} - player object
     */
    get: function (name) {
      return data.get(name);
    },

    /**
     * Retrieves all players in db
     * @returns {Array} - all player objects
     */
    getAll: function () {
      return [...data.values()];  // Values returns an iterator, spread operator converts to array
    },

    /**
     * Updates player by name
     * @param {string} name - player name string
     * @param {Object} player - score of the current roll
     * @returns {Object} - player object
     */
    update: function(name, player) {
      if (data.has(name)) {
        data.set(name, player);
        return data.get(name);
      }
    },
    
    /**
     * Deletes player by name
     * @param {string} name - player name string
     */
    delete: function (name) {
      data.delete(name);
    }
  };
})();