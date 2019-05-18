var util = require('util');

var bleno = require('bleno');

const utils = require('../forward');

var BlenoCharacteristic = bleno.Characteristic;

const UUID = '00000000-0000-0000-0000-000000000001'

var ForwardCharacteristic = function(state) {
  ForwardCharacteristic.super_.call(this, {
    uuid: UUID,
    properties: ['write', 'notify'],
    value: null
  });

  this.state = state;
  this._updateValueCallback = null;
};

util.inherits(ForwardCharacteristic, BlenoCharacteristic);

ForwardCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('ForwardCharacteristic - onWriteRequest: value = ' + this._value.toString('utf8'));
  console.log(this._value);
  forwardToPeripherals(state, data);

  callback(this.RESULT_SUCCESS);
};

ForwardCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('ForwardCharacteristic - onSubscribe');
  this.state.central = this;
  this._updateValueCallback = updateValueCallback;
};

ForwardCharacteristic.prototype.onUnsubscribe = function() {
  console.log('ForwardCharacteristic - onUnsubscribe');
  this.state.central = null;
  this._updateValueCallback = null;
};

module.exports = ForwardCharacteristic;
