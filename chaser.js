Shots = new Meteor.Collection('shots');

var time = new Deps.Dependency();

var getTime = function (date) {

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    return hour + ":" + min;
}

var Person = {
  pounds: 150,
  gender: 'male'
};

bac = function (drinks, pounds, gender, hours) {
  if (gender === 'male') {
    var ratio = 0.58;
    var mt = 0.015;
  } else {
    var ratio = 0.49;
    var mt = 0.017;
  }
  var kg = pounds * 0.453592;

  var ebac = (0.806*drinks*1.2)/(ratio*kg) - (mt*hours);

  hours = (0.806*drinks*1.2)/(ratio*kg) / mt
  return Math.max(ebac, 0);
}

sober = function (drinks, pounds, gender, hours) {
  if (gender) {
    var ratio = 0.58;
    var mt = 0.015;
  } else {
    var ratio = 0.49;
    var mt = 0.017;
  }
  var kg = pounds * 0.453592;

  var sobriety = (0.806*drinks*1.2)/(ratio*kg) / mt

  return Math.max(sobriety, 0);
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
      var content = bac(all.length, Person.pounds, Person.gender, diff);
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
      var now = new Date();
        Shots.insert({time: now, easy: getTime(now), user: Meteor.userId()});
    },
    'click .reset': function () {
      Meteor.call('clear');
    }
  });

  Template.person.events({
    'change input, change select': function() {
      Person.pounds = $('#weight').val();
      Person.gender = $('#gender').val();
    }
})
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
