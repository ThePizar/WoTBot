
class Cache {
  constructor () {
    this.cache = {}
  }
  
  add (key, value) {
    if (key instanceof String) {
      this.cache[key] = value;
    }
    else {
      console.log(key, 'is not a string')
    }
  }
  
  get (key) {
    if (key instanceof String) {
      return this.cache[key];
    }
    else {
      console.log(key, 'is not a string')
    }
  }
  
  clear () {
    this.cache = {};
  }
}

module.exports = Cache;