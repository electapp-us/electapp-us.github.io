// Saved stories: the one place that reads and writes the reader's saved list. Discover (the Save button and
// the Saved filter) and My ELECTAPP both use it, so there is a single copy of what someone saved.
// A saved story is a copy of the card as it was when saved, kept in this browser only (localStorage), so a
// later edit to data/news.js never changes what someone saved. Nothing is sent anywhere.
(function () {
  var STORAGE_KEY = "electapp-saved";
  // The date words a card may use (the same three as DATE_WORDS in discover.js). Anything else is not a
  // well-formed copy.
  var DATE_KINDS = ["published", "updated", "decided"];

  // Saved cards come back from storage, which anyone can edit, so only well-formed copies are used and
  // links must be https. Anything else is dropped instead of being shown.
  function isText(value) { return typeof value === "string" && value.length > 0; }

  function looksLikeCard(card) {
    if (!card || typeof card !== "object") return false;
    var fields = ["id", "headline", "preview", "summary", "happened", "publisher", "url", "published"];
    if (!fields.every(function (field) { return isText(card[field]); })) return false;
    if (!/^https:\/\//.test(card.url) || !/^\d{4}-\d{2}-\d{2}$/.test(card.published)) return false;
    if (!Array.isArray(card.tags) || card.tags.length === 0 || !card.tags.every(isText)) return false;
    if (card.dateKind !== undefined && DATE_KINDS.indexOf(card.dateKind) === -1) return false;
    if (card.uncertain !== undefined && typeof card.uncertain !== "string") return false;
    if (card.resultStatus !== undefined && typeof card.resultStatus !== "string") return false;
    return (card.moreSources === undefined || (Array.isArray(card.moreSources) && card.moreSources.every(function (source) {
      return source && isText(source.publisher) && /^https:\/\//.test(source.url) && isText(source.published);
    })));
  }

  // Newest saved first. Returns [] when nothing is saved, storage is blocked, or the stored text is damaged.
  function readSaved() {
    try {
      var items = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!Array.isArray(items)) return [];
      var seen = {};
      return items.filter(function (entry) {
        var valid = entry && /^\d{4}-\d{2}-\d{2}$/.test(entry.savedOn) && looksLikeCard(entry.card) && !seen[entry.card.id];
        if (valid) seen[entry.card.id] = true;
        return valid;
      });
    } catch (error) {
      return [];
    }
  }

  // True only when the list was stored and reads back the same; false when the browser refuses.
  function writeSaved(items) {
    try {
      var text = JSON.stringify(items);
      localStorage.setItem(STORAGE_KEY, text);
      return localStorage.getItem(STORAGE_KEY) === text;
    } catch (error) {
      return false;
    }
  }

  // The same card has the same text whatever order its fields were written in.
  function stableText(value) {
    if (Array.isArray(value)) return "[" + value.map(stableText).join(",") + "]";
    if (value && typeof value === "object") {
      return "{" + Object.keys(value).sort().map(function (key) {
        return JSON.stringify(key) + ":" + stableText(value[key]);
      }).join(",") + "}";
    }
    return JSON.stringify(value);
  }

  function todayIso() {
    function twoDigits(number) { return (number < 10 ? "0" : "") + number; }
    var now = new Date();
    return now.getFullYear() + "-" + twoDigits(now.getMonth() + 1) + "-" + twoDigits(now.getDate());
  }

  window.SAVED = {
    // Every saved story as { savedOn: "YYYY-MM-DD", card }, newest saved first.
    entries: function () { return readSaved(); },
    count: function () { return readSaved().length; },
    has: function (id) { return readSaved().some(function (entry) { return entry.card.id === id; }); },
    // Saves a copy of the card (saving it again moves it to the front). Returns true when it was stored,
    // false when the browser would not store it.
    save: function (card) {
      var items = readSaved().filter(function (entry) { return entry.card.id !== card.id; });
      items.unshift({ savedOn: todayIso(), card: JSON.parse(JSON.stringify(card)) });
      return writeSaved(items);
    },
    // Returns true when the change was stored, false when the browser would not store it.
    remove: function (id) {
      return writeSaved(readSaved().filter(function (entry) { return entry.card.id !== id; }));
    },
    // How a saved copy compares with the current list: "same", "updated" (the card in data/news.js has since
    // changed), or "removed" (the card is no longer in the list).
    status: function (entry, currentCards) {
      var current = currentCards.filter(function (card) { return card.id === entry.card.id; })[0];
      if (!current) return "removed";
      return stableText(current) === stableText(entry.card) ? "same" : "updated";
    }
  };
})();
