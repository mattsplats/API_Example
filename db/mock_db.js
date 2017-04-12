'use strict';

module.exports = (function () {
  const data = new Map();  // Players indexed by name
  let currID = 1;          // Autoincrement ID

  return {
    /**
     * Creates new player and adds to db
     * @param name - player name string
     * @returns {Object} - new player object
     */
    create: function (name) {
      const newPlayer = {
        id: currID++,  // Uses currID value, then increments
        name: name,
        score: 0,
        frames: [],
        lastFrame: 1,
        prevRoll1: -1,
        prevRoll2: -1,
        gameOver: false
      }
      
      data.set(name, newPlayer);
      return newPlayer;
    },

    /**
     * Retrieves player by name
     * @param name - player name string
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
     * @param name - player name string
     * @param currRoll - score of the current roll
     * @returns {Object} - player object
     */
    update: function(name, currRoll) {
      if (data.has(name)) {
        const p = data.get(name),  // Player object
              currFrame  = p.frames.length > p.lastFrame - 1 ? p.frames[p.lastFrame - 1] : p.frames[p.frames.push({score: p.score}) - 1],
              prevFrame1 = p.lastFrame > 1 ? p.frames[p.lastFrame - 2] : undefined,
              prevFrame2 = p.lastFrame > 2 ? p.frames[p.lastFrame - 3] : undefined;

        /**
         * Updates scores and cascades previous scores if needed
         */
        function updateScores () {
          currFrame.score += currRoll;

          // If both previous frames were strikes, add current roll's score to current and both previous frames
          if (p.prevRoll1 === 'X' && p.prevRoll2 === 'X') {
            currFrame.score  += currRoll;
            prevFrame1.score += currRoll;
            prevFrame2.score += currRoll;
          }

          // If the prev frame was a strike or spare, add current roll's score to current and previous frames
          if (p.prevRoll1 === 'X' || p.prevRoll1 === '/') {  
            currFrame.score  += currRoll;
            prevFrame1.score += currRoll;
          }

          p.score = currFrame.score;
        }

        // Input validation
        if (currRoll < 0 && currRoll > 10) return new Error();

        // Update if game is still going
        if (!p.gameOver) {
          /**
           * Last Frame
           */
          if (p.lastFrame === 10) {

            if (typeof currFrame.roll2 !== 'undefined') {
              
              // Input validation
              if ((p.prevRoll1 !== 'X' || p.prevRoll1 !== '/') && p.prevRoll1 + currRoll > 10) return new Error();

              currFrame.roll3  = currRoll === 10 ? 'X' : (currRoll > 0 && p.prevRoll1 + currRoll === 10) ? '/' : currRoll;
              currFrame.score += currRoll;
              p.score         += currRoll;
              p.gameOver      = true;
             
            } else if (typeof currFrame.roll1 !== 'undefined') {

              // Input validation
              if (p.prevRoll1 !== 'X' && p.prevRoll1 + currRoll > 10) return new Error();

              currFrame.roll2  = currRoll === 10 ? 'X' : (currRoll > 0 && p.prevRoll1 + currRoll === 10) ? '/' : currRoll;
              currFrame.score += currRoll;
              p.score         += currRoll;
              p.gameOver      = currFrame.roll1 === 'X' || currFrame.roll2 === '/' ? false : true;

              if (p.prevRoll1 === 'X' && p.prevRoll2 === 'X') {
                currFrame.score  += currRoll;
                prevFrame1.score += currRoll;
                p.score          += currRoll; 
              }

              p.prevRoll1 = currFrame.roll2;
            
            } else {

              currFrame.roll1  = currRoll === 10 ? 'X' : currRoll;

              updateScores();

              p.prevRoll2 = p.prevRoll1;
              p.prevRoll1 = currFrame.roll1;
            }
             
            return p;
          }

          // Input validation
          if (typeof currFrame.roll1 !== 'undefined' && p.prevRoll1 + currRoll > 10) return new Error();


          updateScores();


          /**
           * Frame Update
           */
          p.prevRoll2 = p.prevRoll1;

          // If the current frame is a strike
          if (currRoll === 10 && p.prevRoll1 !== 0) {
            p.frames[p.lastFrame - 1].roll1 = 'X';
            p.prevRoll1 = 'X';
            p.lastFrame++;
            
          // If the current frame is a spare
          } else if (typeof currFrame.roll1 !== undefined && p.prevRoll1 + currRoll === 10) {
            p.frames[p.lastFrame - 1].roll2 = '/';
            p.prevRoll1 = '/';
            p.lastFrame++;
          
          // If we're on the 2nd roll for the current frame
          } else if (typeof currFrame.roll1 !== 'undefined') {
            p.frames[p.lastFrame - 1].roll2 = currRoll;
            p.prevRoll1 = currRoll;
            p.lastFrame++;
          
          // If we're on the first roll for the current frame
          } else {
            p.frames[p.lastFrame - 1].roll1 = currRoll;
            p.prevRoll1 = currRoll;
          }
        } 

        return p;
      }
    },
    
    /**
     * Deletes player by name
     * @param key - player name string
     */
    delete: function (name) {
      data.delete(name);
    }
  };
})();