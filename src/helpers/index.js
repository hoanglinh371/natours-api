'use strict';

exports.min2Millis = (min) => {
  return min * 60 * 1000;
};

exports.hour2Millis = (hour) => {
  return hour * 60 * 60 * 1000;
};
