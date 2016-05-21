'use strict';

const VectorSat = require('sat').Vector

module.exports = class Vector extends VectorSat {
  getRad() {
    return Math.atan2(this.y,this.x);
  }
}
