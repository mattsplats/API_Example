'use strict';

module.exports = {
  /**
   * Gets the current and previous two frames
   * @param p - player object
   * @returns {Object} - contains current and previous two frames
   */
  getRecentFrames: function (p) {
    const currFrame  = p.frames[p.onFrame - 1],
          prevFrame1 = p.onFrame > 1 ? p.frames[p.onFrame - 2] : undefined,
          prevFrame2 = p.onFrame > 2 ? p.frames[p.onFrame - 3] : undefined;

    return {currFrame, prevFrame1, prevFrame2};
  },

  /**
   * Updates player score and scores across frames as needed
   * @param p - player object
   * @param currRoll - value of current roll (where 0 <= roll <= 10)
   */
  updateScores: function (p, currRoll) {
    const {currFrame, prevFrame1, prevFrame2} = this.getRecentFrames(p);

      // Update frame scores and player score
      // If both previous frames were strikes, add current roll's score to current and both previous frames
      if (prevFrame1 && prevFrame2 && prevFrame1.roll1 === 'X' && prevFrame2.roll1 === 'X') {
        currFrame.score  += currRoll * 3;
        prevFrame1.score += currRoll * 2;
        prevFrame2.score += currRoll;
      }

      // If the prev frame was a strike or spare, add current roll's score to current and previous frame
      else if (prevFrame1 && prevFrame1.roll1 === 'X' || prevFrame1.roll2 === '/') {  
        currFrame.score  += currRoll * 2;
        prevFrame1.score += currRoll;
      
      } else currFrame.score += currRoll;  // Default case: add current roll to current frame score

      // Assign current frame score to player score
      p.score = currFrame.score;
  },

  /**
   * Updates frames and player score
   * @param p - player object
   * @param currRoll - value of current roll (where 0 <= roll <= 10)
   * @returns p - mutated player object
   */
  updatePlayer: function (p, currRoll) {
    if (p.gameOver) return p;
    
    if (p.frames.length === p.onFrame) p.frames.push({score: p.score});  // Create current frame object if missing
    
    // If on frame ten, handle in frameTenUpdate
    if (p.onFrame === 10) {
      return this.frameTenUpdate(p, currRoll);

    } else {
      this.updateScores(p, currRoll);

      const currFrame = p.frames[p.onFrame - 1];

      // If we're on the first roll for the current frame
      if (typeof currFrame.ball1 === 'undefined') {
        
        // If the current roll is a strike
        if (currRoll === 10) {
          currFrame.roll1 = 'X';
          p.onFrame++;  // Advance to the next frame
        
        } else currFrame.roll1 = currRoll;
        
      // If we're on the second roll for the current frame
      } else {
        p.onFrame++;  // Advance to the next frame

        if (currFrame.ball1 + currRoll === 10) currFrame.roll2 = '/';  // If the current roll is a spare
        else currFrame.roll2 = currRoll;
      }
    }

    return p;
  },

  /**
   * Special player update logic for dealing with the tenth frame
   * @param p - player object
   * @param currRoll - value of current roll (where 0 <= roll <= 10)
   * @returns p - mutated player object
   */
  frameTenUpdate: function (p, currRoll) {
    const {currFrame, prevFrame1, prevFrame2} = this.getRecentFrames(p);

    // On third roll
    if (typeof currFrame.roll2 !== 'undefined') {             

      // Strike, spare, or number?
      if (currFrame.roll2 === 'X' || currFrame.roll2 === '/') {
        if (currRoll === 10) currFrame.roll3 = 'X';
        else currFrame.roll3 = currRoll;
      
      } else {
        if (currFrame.roll2 + currRoll === 10) currFrame.roll3 = '/';
        else currFrame.roll3 = currRoll;
      }

      // Nonstandard score update: roll3 cannot cascade, so just update the frame and total scores
      currFrame.score += currRoll;
      p.score         += currRoll;

      // The game MUST be over
      p.gameOver = true;
    

    // On second roll
    } else if (typeof currFrame.roll1 !== 'undefined') {

      // Strike, spare, or number?
      if (currFrame.roll1 === 'X' && currRoll === 10) currFrame.roll2 = 'X';
      else if (currFrame.roll1 + currRoll === 10)     currFrame.roll2 = '/';
      else                                            currFrame.roll2 = currRoll;

      // Nonstandard score update: only update frame 9 if both frame 10: roll1 AND frame 9 were strikes
      if (currFrame.roll1 === 'X' && prevFrame1.ball1 === 'X') {
        currFrame.score  += currRoll * 2;
        prevFrame1.score += currRoll;

      } else currFrame.score += currRoll;
      p.score = currFrame.score;

      // Unless there's a strike or spare to be resolved, the game is over
      p.gameOver = currFrame.roll1 === 'X' || currFrame.roll2 === '/' ? false : true;  


    // On first roll
    } else {
      currFrame.roll1 = currRoll === 10 ? 'X' : currRoll;
      this.updateScores(p, currRoll);  // Normal update works for the first roll
    }
      
    return p;
  },

  /**
   * Validates roll value input
   * @param p - player object
   * @param currRoll - value of current roll (where 0 <= roll <= 10)
   * @returns {boolean} - true if valid, otherwise false
   */
  validateRoll: function (p, currRoll) {
    if (currRoll < 0 && currRoll > 10) return false;
    
    const {currFrame, prevFrame1, prevFrame2} = this.getRecentFrames(p);
    
    // The remaining tests are for attempts to roll a combined value > 10 on a single rack of pins.
    // Frames 1 - 9
    if (p.onFrame < 10) {
      if (typeof currFrame.roll1 !== 'undefined' && currFrame.roll1 + currRoll > 10) return false;

    // Frame 10
    } else {
    
      // If we're on the third roll, and the previous roll was not a strike or spare
      if (typeof currFrame.roll2 === 'number') {
       if (currFrame.roll2 + currRoll > 10) return false;

      // If we're on the second roll, and the previous roll was not a strike
      } else if (typeof currFrame.roll1 === 'number' && currFrame.roll1 + currRoll > 10) return false;
    }

    return true;
  }
}