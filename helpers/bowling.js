'use strict';

/**
 * Updates player score and scores across frames as needed
 * @param {Object} p - player object
 * @param {Object} currFrame - current frame object
 * @param {Object} prevFrame1 - prev frame object
 * @param {Object} prevFrame2 - prev prev frame object
 * @param {number} currRoll - value of current roll (where 0 <= roll <= 10)
 */
function updateScores (p, currFrame, prevFrame1, prevFrame2, currRoll) {    
    function singleUpdate () {  // Last roll was not a strike or spare
      currFrame.score += currRoll;
    }

    function doubleUpdate () {  // Last roll was a strike or spare
      currFrame.score  += currRoll * 2;
      prevFrame1.score += currRoll;
    }

    function tripleUpdate () {  // Last two rolls were strikes
      currFrame.score  += currRoll * 3;
      prevFrame1.score += currRoll * 2;
      prevFrame2.score += currRoll;
    }
    
    // If we're on the first frame (does prevFrame1 exist?)
    if (!prevFrame1) singleUpdate();
    else {

      // If we are on our first roll this frame
      if (typeof currFrame.roll1 === 'undefined') {

        // Previous frame was a strike?
        if (prevFrame1.roll1 === 'X') {
          if (prevFrame2 && prevFrame2.roll1 === 'X') tripleUpdate();  // BOTH previous frames were strikes?
          else doubleUpdate();
        
        // Previous frame was a spare?
        } else if (prevFrame1.roll2 === '/') doubleUpdate();
        else singleUpdate();

      // If we are on our second roll this frame
      } else {
      
        // Previous frame was a strike?
        if (prevFrame1.roll1 === 'X') doubleUpdate();
        else singleUpdate();
      }
    }

    // Assign current frame score to player score
    p.score = currFrame.score;
}

/**
 * Special player update logic for dealing with the tenth frame
 * @param {Object} p - player object
 * @param {Object} currFrame - current frame object
 * @param {Object} prevFrame1 - prev frame object
 * @param {Object} prevFrame2 - prev prev frame object
 * @param {number} currRoll - value of current roll (where 0 <= roll <= 10)
 * @returns {Object} - mutated player object (currently unused)
 */
function frameTenUpdate (p, currFrame, prevFrame1, prevFrame2, currRoll) {

  // On third roll
  if (typeof currFrame.roll2 !== 'undefined') {

    // Nonstandard score update: roll3 cannot cascade, so just update the frame and total scores
    currFrame.score += currRoll;
    p.score         += currRoll;           

    // Strike, spare, or number?
    if (currFrame.roll2 === 'X' || currFrame.roll2 === '/') {
      if (currRoll === 10) currFrame.roll3 = 'X';
      else currFrame.roll3 = currRoll;
    
    } else {
      if (currFrame.roll2 + currRoll === 10) currFrame.roll3 = '/';
      else currFrame.roll3 = currRoll;
    }

    // The game MUST be over!
    p.gameOver = true;
  

  // On second roll
  } else if (typeof currFrame.roll1 !== 'undefined') {

    // Nonstandard score update: only update frame 9 if it was a strike
    if (prevFrame1.roll1 === 'X') {
      currFrame.score  += currRoll * 2;
      prevFrame1.score += currRoll;

    } else currFrame.score += currRoll;
    p.score = currFrame.score;

    // Strike, spare, or number?
    if (currFrame.roll1 === 'X' && currRoll === 10) currFrame.roll2 = 'X';
    else if (currFrame.roll1 + currRoll === 10)     currFrame.roll2 = '/';
    else                                            currFrame.roll2 = currRoll;

    // Unless there's a strike or spare to be resolved, the game is over
    p.gameOver = currFrame.roll1 === 'X' || currFrame.roll2 === '/' ? false : true;  


  // On first roll
  } else {
    updateScores(p, currFrame, prevFrame1, prevFrame2, currRoll);  // Standard update works for the first roll
    currFrame.roll1 = currRoll === 10 ? 'X' : currRoll;
  }
    
  return p;
}

module.exports = {
  /**
   * Updates frames and player score
   * @param {Object} p - player object
   * @param {number} currRoll - value of current roll (where 0 <= roll <= 10)
   * @returns {Object} - mutated player object (currently unused)
   */
  updatePlayer: function (p, currRoll) {
    if (p.gameOver) return p;
    
    if (p.frames.length < p.onFrame) p.frames.push({score: p.score});  // Create current frame object if missing
    
    const currFrame  = p.frames[p.onFrame - 1],
          prevFrame1 = p.onFrame > 1 ? p.frames[p.onFrame - 2] : undefined,
          prevFrame2 = p.onFrame > 2 ? p.frames[p.onFrame - 3] : undefined;

    // If on frame ten, handle in frameTenUpdate
    if (p.onFrame === 10) {
      return frameTenUpdate(p, currFrame, prevFrame1, prevFrame2, currRoll);

    } else {
      updateScores(p, currFrame, prevFrame1, prevFrame2, currRoll);

      // If we're on the first roll for the current frame
      if (typeof currFrame.roll1 === 'undefined') {
        
        // If the current roll is a strike
        if (currRoll === 10) {
          currFrame.roll1 = 'X';
          p.onFrame++;  // Advance to the next frame
        
        } else currFrame.roll1 = currRoll;
        
      // If we're on the second roll for the current frame
      } else {
        p.onFrame++;  // Advance to the next frame

        if (currFrame.roll1 + currRoll === 10) currFrame.roll2 = '/';  // If the current roll is a spare
        else currFrame.roll2 = currRoll;
      }
    }

    return p;
  },

  /**
   * Validates roll value input
   * @param {Object} p - player object
   * @param {number} currRoll - value of current roll (where 0 <= roll <= 10)
   * @returns {boolean} - true if valid, otherwise false
   */
  validateRoll: function (p, currRoll) {
    if (currRoll < 0 && currRoll > 10) return false;
    if (p.frames.length < p.onFrame)   return true;  // Nothing rolled yet this frame
    
    // The remaining tests are for attempts to roll a combined value > 10 on a single rack of pins.
    
    const currFrame = p.frames[p.onFrame - 1];

    // Frames 1 - 9
    if (p.onFrame < 10) {
      if (typeof currFrame.roll1 !== 'undefined' && currFrame.roll1 + currRoll > 10) return false;

    // Frame 10
    } else {
    
      // If we're on the third roll, and the previous roll was not a strike or spare
      if (typeof currFrame.roll2 !== 'undefined') {
       if (typeof currFrame.roll2 === 'number' && currFrame.roll2 + currRoll > 10) return false;

      // If we're on the second roll, and the previous roll was not a strike
      } else if (typeof currFrame.roll1 === 'number' && currFrame.roll1 + currRoll > 10) return false;
    }

    return true;
  }
}