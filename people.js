// Links the races to the people in data/people.js.
// A candidate with a personId gets their positions from that person, so what someone says and what they have
// done is kept in one place (data/people.js) and every screen reads the same copy.
// For each topic, a candidate's list is what they say (and what news reports they said), followed by what they
// have done from official records. The items keep their kind, so the screens can label each one accurately.
// Runs after data/illinois-races.js and data/people.js, and before app.js.
(function () {
  function findPerson(id) {
    return window.PEOPLE.people.filter(function (person) { return person.id === id; })[0];
  }
  window.personById = findPerson;

  // What kind of information an item is, in plain words. A politician's own account of what they did ("I helped
  // pass...") is still their own statement, so it is labelled as that and never as a documented record.
  window.ITEM_LABELS = {
    says: "Their stated position",
    ownRecord: "Their own account of their record",
    record: "Documented record",
    reported: "As reported by news",
    platform: "Party platform"
  };
  window.itemKind = function (item) {
    return item.aboutOwnRecord ? "ownRecord" : item.type;
  };

  window.ILLINOIS_ELECTION.races.forEach(function (race) {
    var allLinked = race.candidates.every(function (candidate) { return candidate.personId && findPerson(candidate.personId); });
    if (!allLinked) return;

    race.positions = {};
    race.positionSummaries = {};
    race.sourcesRecheckedOn = window.PEOPLE.checkedOn;
    window.POSITION_TOPICS.forEach(function (topic) {
      race.positions[topic.id] = {};
      race.positionSummaries[topic.id] = {};
      race.candidates.forEach(function (candidate) {
        var person = findPerson(candidate.personId);
        var documented = (person.record[topic.id] || []).map(function (item) {
          return { type: "record", text: item.text, source: item.source, audit: item.audit };
        });
        race.positions[topic.id][candidate.name] = (person.statements[topic.id] || []).concat(documented);
        race.positionSummaries[topic.id][candidate.name] = person.summaries[topic.id];
      });
    });
  });
})();
