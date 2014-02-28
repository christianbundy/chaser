Shots = new Meteor.Collection('shots');

var time = new Deps.Dependency();

var getTime = function (date) {

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return hour + ":" + min;
}

Person = {
  pounds: 122,
  penis: 0
}

bac = function (shots, pounds, penis, hours) {
  if (penis) {
    var ratio = 0.73;
  } else {
    var ratio = 0.66;
  }
  var result = ((shots * 0.55 * 5.14 / (pounds * ratio)) - 0.015 * hours);
  return Math.max(result, 0);
}

if (Meteor.isClient) {
  Meteor.loginVisitor()

  Template.history.shots = function () {
    return Shots.find({user: Meteor.userId()});
  };
  setInterval(function () {
    time.changed()
  }, 1000)

    Template.bac.current = function () {
    time.depend();
    var all = Shots.find({user: Meteor.userId()}).fetch();
    if (all[0] != null) {
      var diff = (new Date() - new Date(all[0].time)) / 1000 / 60 / 60;
    if (all.length > 0) {
      var content = bac(all.length, Person.pounds, Person.penis, diff);
    } else {
      var content = 0;
    }
    return + content.toFixed(6);
    } else {
      return 0;
    }
  }

  Template.action.events({
    'click .shot': function () {
      if (typeof console !== 'undefined')
      var now = new Date();
        Shots.insert({time: now, easy: getTime(now), user: Meteor.userId()});
    },
    'click .reset': function () {
      Meteor.call('clear');
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    return Meteor.methods({
      clear: function() {
        return Shots.remove({user: Meteor.userId()});
      }
    });
  });
}
