Shots = new Meteor.Collection('shots');

var time = new Deps.Dependency();

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
  Template.history.shots = function () {
    return Shots.find();
  };
  setInterval(function () {
    time.changed()
  }, 100)

    Template.bac.current = function () {
    time.depend();
    var all = Shots.find().fetch();
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
    'click .shot, tap .shot': function () {
      if (typeof console !== 'undefined')
        Shots.insert({time: new Date()});
    },
    'click .reset, tap .reset': function () {
      Meteor.call('clear');
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    return Meteor.methods({
      clear: function() {
        return Shots.remove({});
      }
    });
  });
}
