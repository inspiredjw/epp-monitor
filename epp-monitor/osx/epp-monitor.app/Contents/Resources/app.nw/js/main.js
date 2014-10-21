var parseFile = require('./js/parse.js').parseFile;
var watchFile = require('./js/parse.js').watchFile;
var lightFile = require('./js/parse.js').lightFile;
var getCalendar = require('./js/date.js').calendar;
var fs = require('fs');

var TheFilename = 'Pure10A.txt';

// clear up the log file every 5 minutes
lightFile(TheFilename);

function readAndSet() {
  // change values
  var data = parseFile(TheFilename);
  $flowData.html(data[data.length - 1][0]);
  $ozoneData.html(data[data.length - 1][1]);
  $tempData.html(data[data.length - 1][2]);
  $humidData.html(data[data.length - 1][3]);

  // calculate percentage based on given range
  var max = {
    flow: 4.5,
    ozone: 30
  };

  var percent = {
    flow: (data[data.length - 1][0] / max.flow) * 100,
    ozone: (data[data.length - 1][1] / max.ozone) * 100,
  };

  // change bar color
  var barClass = {
    flow: '',
    ozone: ''
  };

  var statusMessage = {
    flow: '',
    ozone: ''
  };

  // flow bar color
  if (percent.flow <= 10.00) {
    barClass.flow = 'progress-bar-danger';
    statusMessage.flow = 'No Flow';
  }
  else if (percent.flow <= 40.00) {
    barClass.flow = 'progress-bar-warning';
    statusMessage.flow = 'Flow';
  }
  else {
    barClass.flow = 'progress-bar-success';
    statusMessage.flow = 'Flowing';
  }

  // ozone bar color
  if (percent.ozone <= 33.33) {
    barClass.ozone = 'progress-bar-success';
    statusMessage.ozone = 'Moderate';
  }
  else if (percent.ozone <= 66.67) {
    barClass.ozone = 'progress-bar-warning';
    statusMessage.ozone = 'High';
  }
  else {
    barClass.ozone = 'progress-bar-danger';
    statusMessage.ozone = 'Extreme';
  }

  // apply changes on progerss bars
  $flowBar
  .css('width', percent.flow + '%')
  .removeClass('progress-bar-success progress-bar-warning progress-bar-danger')
  .addClass(barClass.flow);

  $ozoneBar
  .css('width', percent.ozone + '%')
  .removeClass('progress-bar-success progress-bar-warning progress-bar-danger')
  .addClass(barClass.ozone);

  // change status message
  $flowStatus.html(statusMessage.flow);
  $ozoneStatus.html(statusMessage.ozone);
}

function updateCalendar() {
  var data = getCalendar();

  if (data.month === calendarData.month && data.day === calendarData.day) {}
  else {
    $calendarMonth.html(data.month);
    $calendarDay.html(data.day);

    calendarData = {
      month: data.month,
      day: data.day
    };
  }
}

var $container = $('.container'),
    $calendarMonth = $container.find('.calendar .month'),
    $calendarDay = $container.find('.calendar .day'),

    $flowData = $container.find('.flow-data .data-span'),
    $ozoneData = $container.find('.ozone-data .data-span'),
    $tempData = $container.find('.temp-data .data-span'),
    $humidData = $container.find('.humid-data .data-span'),

    $flowBar = $container.find('.cell-flow .progress-bar'),
    $ozoneBar = $container.find('.cell-ozone .progress-bar'),

    $flowStatus = $flowBar.parent().siblings().filter('.status'),
    $ozoneStatus = $ozoneBar.parent().siblings().filter('.status');

var calendarData = { month: '', day: 0 };

var $h1 = $('h1');

$(function() {
  // set padding top to 50% of the screen
  $('body').css(
    'padding-top',
    ($(window).height() / 2) - parseInt($('.cell-container').css('height')) + 'px');

  readAndSet();
  updateCalendar();

  setInterval(function() {
    readAndSet();
  }, 1000); //  1 second

  setInterval(function() {
    updateCalendar();
  }, 1000 * 60 * 10); //  10 minutes
  // watchFile(TheFilename, function(e, filename) {
  //   readAndSet();
  // });
});

// [0] flow sensor (V)  fa-flask
// [1] ozone leakage (ppb) fa-eyedropper
// [2] temperature (°C)  fa-tachometer
// [3] Humidity (%RH)  fa-tint