const fs = require("fs");
const moment = require("moment");

const SCHEDULE = '../schedule.txt';

if (!fs.existsSync(SCHEDULE)) {
  fs.truncateSync(SCHEDULE, 0); //Make it exist
}

/**
 * Represents times of future days
 */
class Schedule {
  constructor () {
    /**
     * The times stored
     * @type {[Moment]}
     */
    this._times = [];
  }
  
  /**
   * Adds the time if possible. Rejects if there already exists that date.
   *
   * @param time
   * @returns {Promise<Number>}
   */
  addTime (time) {
    return this.cleanUp().then(() => {
      const emptyDay = this.times.every(entry => {
        return entry.diff(time, "days") !== 0;
      });
      if (emptyDay) {
        this.times.push(time);
      }
      else {
        return Promise.reject("Day already has assigned time!")
      }
      return this.times.length;
    })
  }
  
  /**
   * Updates the time. or adds if it doesn't exist yet
   *
   * @param time
   * @returns {Promise}
   */
  updateTime (time) {
    return this.cleanUp().then(() => {
      const idx = this.times.indexOf(entry => {
        return entry.diff(time, "days") !== 0;
      });
      if (idx === -1) {
        this.times.push(time);
        return undefined;
      }
      else {
        const old = this.times[idx];
        this.times[idx] = time;
        return old;
      }
    })
  }
  
  removeTime (time) {
    return this.cleanUp().then(() => {
      this._times = this.times.filter(entry => {
        return entry.diff(time, "days") !== 0;
      });
      return this.times.length;
    })
  }
  
  cleanUp() {
    const invalid = this.times.filter(expired);
    const valid = this.times.filter(valid);
    this._times = valid.sort(diffTime);
    //TODO update file
    return Promise.resolve(this.times.length);
  }
  
  store() {
    //TODO store in file
  }
  
  rebuild() {
    //TODO read from file
  }
  
  get times () {
    return this._times;
  }
}

/**
 *
 * @param {Moment} a
 * @param {Moment} b
 * @returns {number}
 */
function diffTime (a, b) {
  return a.diff(b);
}

/**
 *
 * @param {Moment} time
 * @returns {boolean}
 */
function expired (time) {
  return moment().diff(time, "days") > 0;
}

/**
 *
 * @param {Moment} time
 * @returns {boolean}
 */
function valid (time) {
  return !expired(time);
}

/**
 * Official SH Schedule
 * @type {Schedule}
 */
const schedule = new Schedule();

schedule.rebuild(); //TODO implement

module.exports = { schedule };
