
class Cache {
  constructor () {
    this.cache = {}
  }
  
  add (key, value) {
    if (typeof key === 'string') {
      this.cache[key] = value;
    }
    else {
      console.log(key, 'is not a string (add)')
    }
  }
  
  get (key) {
    if (typeof key === 'string') {
      return this.cache[key];
    }
    else {
      console.log(key, 'is not a string (get)')
    }
  }
  
  clear () {
    this.cache = {};
  }
}

module.exports = Cache;