// Interests: the topics a reader chooses to follow (the seven issues plus Elections).
// They are kept in this browser only (localStorage) and are never sent anywhere. Nothing is guessed from
// what a reader clicks: an interest exists only because the reader ticked it.
// Discover and Learn both read and write this one list, so the two screens cannot disagree.
(function () {
  var STORAGE_KEY = "electapp-interests";

  // Elections first, then the seven issues in their usual order. This is the only order ever used.
  function allTopicIds() {
    return ["elections"].concat(window.POSITION_TOPICS.map(function (topic) { return topic.id; }));
  }

  // Only real topic ids, once each, in the usual order, whatever was asked for or found in storage.
  function clean(ids) {
    return allTopicIds().filter(function (id) { return Array.isArray(ids) && ids.indexOf(id) !== -1; });
  }

  // The stored list, or null when nothing is stored or the browser will not let this page look.
  function readStored() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw === null ? null : clean(JSON.parse(raw));
    } catch (error) {
      return null;
    }
  }

  // True only when the list was stored and reads back the same; false when the browser refuses.
  function writeStored(ids) {
    try {
      var text = JSON.stringify(ids);
      localStorage.setItem(STORAGE_KEY, text);
      return localStorage.getItem(STORAGE_KEY) === text;
    } catch (error) {
      return false;
    }
  }

  // When the browser refuses to store a change, the choices live here for this visit only.
  var visitOnly = null;

  // Read fresh every time, so a change made in another tab is never overwritten by this one.
  function current() {
    if (visitOnly !== null) return visitOnly;
    return readStored() || [];
  }

  // Returns true when the change was stored for later visits, false when it only lasts for this visit.
  function toggle(id, on) {
    var ids = current().filter(function (existing) { return existing !== id; });
    if (on) ids.push(id);
    ids = clean(ids);
    var stored = writeStored(ids);
    visitOnly = stored ? null : ids;
    return stored;
  }

  window.INTERESTS = {
    ids: function () { return current().slice(); },
    has: function (id) { return current().indexOf(id) !== -1; },
    toggle: toggle,
    // A card matches when any one of its tags is an interest. With no interests, nothing matches.
    matches: function (card) {
      var ids = current();
      return card.tags.some(function (tag) { return ids.indexOf(tag) !== -1; });
    },
    // What to tell the reader when toggle() returns false.
    NOT_REMEMBERED: "Couldn't remember your choices. Your browser isn't letting this page store anything " +
      "(this can happen in a private window), so they will be gone when you leave this page."
  };

  // One labelled checkbox per topic, inside container, reading and writing the shared list. Learn and Discover
  // both use this, so their pickers look and behave the same. onChange(stored) runs after every change;
  // stored is false when the browser would not remember it. Returns a function that re-reads the list and
  // updates the checkboxes, for when the screen is shown again.
  window.renderInterestOptions = function (container, topics, onChange) {
    var boxes = [];
    container.replaceChildren();
    topics.forEach(function (topic) {
      var label = document.createElement("label");
      label.className = "issue-option";
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = topic.id;
      checkbox.checked = window.INTERESTS.has(topic.id);
      checkbox.addEventListener("change", function () {
        onChange(window.INTERESTS.toggle(topic.id, checkbox.checked));
      });
      var text = document.createElement("span");
      text.textContent = topic.label;
      label.appendChild(checkbox);
      label.appendChild(text);
      container.appendChild(label);
      boxes.push(checkbox);
    });
    return function syncCheckboxes() {
      boxes.forEach(function (box) { box.checked = window.INTERESTS.has(box.value); });
    };
  };
})();
