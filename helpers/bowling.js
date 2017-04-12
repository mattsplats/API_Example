'use strict';

module.exports = {
  /**
   * Gets the current and previous two frames.
   * If no frame object exists for the current frame, creates the object and pushes it to the frames array.
   * @param p - player object
   * @returns {Object} - contains current and previous two frames
   */
  getRecentFrames: function (p) {
    const currFrame  = p.frames.length === p.onFrame ? p.frames[p.onFrame - 1] : p.frames[p.frames.push({score: p.score}) - 1],
          prevFrame1 = p.onFrame > 1 ? p.frames[p.onFrame - 2] : undefined,
          prevFrame2 = p.onFrame > 2 ? p.frames[p.onFrame - 3] : undefined;

    return {currFrame, prevFrame1, prevFrame2};
  },

  /**
   * Updates scores and cascades previous scores if needed
   */
  updateScores: function (currFrame, prevFrame1, prevFrame2) {
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
  }

  /**
   * Updates frames and player score
   * @param p - player object
   * @param currRoll - value of current roll (where 0 <= roll <= 10)
   */
  updatePlayer: function (p, currRoll) {
    // Get or create current frame object
    const currFrame = p.frames.length === p.onFrame ? p.frames[p.onFrame - 1] : p.frames[p.frames.push({score: p.score}) - 1];
    
    if (p.onFrame === 10) {
      this.frameTenUpdate(p, currRoll)

    } else {
      


      // Update frames with new roll information
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
  },

  validateRoll: function () {

  }
}