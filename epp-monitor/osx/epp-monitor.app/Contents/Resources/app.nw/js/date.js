'use strict';

exports.calendar = function() {
  var d = new Date();
  var months = [
    'JAN', 'FEB', 'MAR', 'APR',
    'MAY', 'JUN', 'JUL', 'AUG',
    'SEP', 'OCT', 'NOV', 'DEC'
  ];

  return {
    month: months[d.getMonth()],
    day: d.getDate()
  }
};