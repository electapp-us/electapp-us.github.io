// Discover: shows the hand-checked list in window.NEWS as compact cards with a topic filter.
// The same list is shared with Learn through window.newsForTopic, so news lives in one place.
// Colors on cards and filters identify the topic only. They never rate a source or a political side.
// Readers can save a card with its Save button. A saved card is a copy of the card as it was when saved,
// kept in this browser only (localStorage), so later edits to data/news.js never change what someone saved.
// The saved list itself lives in saved.js (window.SAVED), which this file and My ELECTAPP share.
(function () {
  var MONTHS = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
  var DATE_WORDS = { published: "Published", updated: "Updated", decided: "Decided" };

  // Short names for the filter buttons and tags, so they fit on a phone.
  var SHORT_LABELS = {
    all: "All",
    interests: "My interests",
    saved: "Saved",
    elections: "Elections",
    economy: "Economy",
    health: "Health care",
    education: "Education",
    environment: "Environment",
    reproductive: "Reproductive health",
    safety: "Public safety",
    military: "Military"
  };

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function formatDate(iso) {
    var parts = iso.split("-");
    return MONTHS[Number(parts[1]) - 1] + " " + Number(parts[2]) + ", " + parts[0];
  }

  // For example "Published Nov. 4, 2026". Court opinions say "Decided" and updated pages say "Updated".
  window.newsDateLabel = function (card) {
    return DATE_WORDS[card.dateKind || "published"] + " " + formatDate(card.published);
  };

  // For example "Nov. 4, 2026", from a date written "2026-11-04".
  window.formatNewsDate = formatDate;

  // The label for an election result that news organizations have called but states have not certified yet
  // (empty for every other card). Discover and My ELECTAPP show the same words.
  window.newsStatusLabel = function (card) {
    return card.resultStatus === "called" ? "Called by AP · not yet officially certified" : "";
  };

  // Newest first; cards with the same date keep their order from the data file.
  function newestFirst(cards) {
    return cards
      .map(function (card, index) { return { card: card, index: index }; })
      .sort(function (a, b) {
        if (a.card.published !== b.card.published) return a.card.published < b.card.published ? 1 : -1;
        return a.index - b.index;
      })
      .map(function (entry) { return entry.card; });
  }

  window.newsForTopic = function (topicId) {
    return newestFirst(window.NEWS.cards.filter(function (card) {
      return card.tags.indexOf(topicId) !== -1;
    }));
  };

  // The filter buttons come in two groups: Browse (ways of looking at the whole list) and Explore by topic
  // (one button per topic). Only one button is selected at a time across both groups.
  function filterGroups() {
    return [
      { id: "browse", label: "Browse", filters: ["all", "interests", "saved"] },
      {
        id: "topics",
        label: "Explore by topic",
        scrolls: true,
        filters: ["elections"].concat(window.POSITION_TOPICS.map(function (topic) { return topic.id; }))
      }
    ];
  }

  function filterIds() {
    return filterGroups().reduce(function (all, group) { return all.concat(group.filters); }, []);
  }

  // The topics a reader can choose as interests: Elections and the seven issues, with the short names
  // used on the filter buttons.
  function interestTopics() {
    return ["elections"].concat(window.POSITION_TOPICS.map(function (topic) { return topic.id; })).map(function (id) {
      return { id: id, label: SHORT_LABELS[id] };
    });
  }

  window.interestTopics = interestTopics;

  // ["Elections", "Economy", "Health care"] becomes "Elections, Economy and Health care".
  function listInWords(items) {
    if (items.length < 2) return items.join("");
    return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
  }

  // What to tell the reader about a saved copy whose original has changed or gone (see SAVED.status in saved.js).
  // My ELECTAPP shows the same sentences.
  var SAVED_STATUS_TEXT = {
    updated: "We have updated this story since. You are seeing the version you saved.",
    removed: "We no longer list this development."
  };

  window.savedStatusText = function (status) { return SAVED_STATUS_TEXT[status] || ""; };

  function savedNote(entry, currentCards) {
    var note = "Saved " + formatDate(entry.savedOn) + ". This is a copy from when you saved it, " +
      "so it may not reflect the latest developments.";
    var status = window.SAVED.status(entry, currentCards);
    return status === "same" ? note : note + " " + SAVED_STATUS_TEXT[status];
  }

  function bookmarkIcon() {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M6 3h12v18l-6-4.5L6 21z");
    svg.appendChild(path);
    return svg;
  }

  // state: "save" (not saved yet), "saved" (saved; pressing removes it), or "remove" (inside the Saved list).
  // The accessible name says what pressing does and includes the headline, so every button's name is unique.
  function setBookmarkButton(button, card, state) {
    button.setAttribute("data-state", state);
    button.setAttribute("aria-label", (state === "save" ? "Save for later: " : "Remove from saved: ") + card.headline);
    button.replaceChildren();
    if (state !== "remove") button.appendChild(bookmarkIcon());
    button.appendChild(element("span", null, state === "save" ? "Save" : state === "saved" ? "Saved" : "Remove"));
  }

  function renderBookmarkButton(card, state, onPress) {
    var button = element("button", "bookmark-button");
    button.type = "button";
    setBookmarkButton(button, card, state);
    button.addEventListener("click", function () { onPress(card, button); });
    return button;
  }

  function renderTag(tag) {
    var chip = element("li", "tag-chip", SHORT_LABELS[tag] || tag);
    chip.setAttribute("data-tag", tag);
    return chip;
  }

  function addDetail(list, term, definition) {
    list.appendChild(element("dt", null, term));
    list.appendChild(typeof definition === "string" ? element("dd", null, definition) : definition);
  }

  function renderDetails(card) {
    var details = element("details", "news-details");
    var summary = element("summary");
    summary.appendChild(element("span", "details-more", "More details"));
    summary.appendChild(element("span", "details-less", "Hide details"));
    details.appendChild(summary);
    var more = element("div", "news-more");
    var list = element("dl", "news-detail-list");

    addDetail(list, "The full story", card.summary);
    addDetail(list, "What happened", card.happened);

    if (card.moreSources && card.moreSources.length > 0) {
      var sources = element("dd");
      card.moreSources.forEach(function (source) {
        var line = element("div", "news-more-source");
        var link = element("a", null, source.publisher);
        link.href = source.url;
        link.target = "_blank";
        link.rel = "noopener";
        line.appendChild(link);
        line.appendChild(document.createTextNode(" (" + source.published + ")"));
        sources.appendChild(line);
      });
      addDetail(list, "Also reported by", sources);
    }

    if (card.uncertain) addDetail(list, "What remains uncertain", card.uncertain);

    more.appendChild(list);
    details.appendChild(more);
    return details;
  }

  // options: { state, onPress } for the Save button (see setBookmarkButton), and an optional note shown
  // above the footer (used on saved copies).
  function renderCard(card, options) {
    var item = element("li", "news-card");
    item.setAttribute("data-id", card.id);
    item.setAttribute("data-published", card.published);
    item.setAttribute("data-topic", card.tags[0]);

    var tags = element("ul", "news-tags");
    card.tags.forEach(function (tag) { tags.appendChild(renderTag(tag)); });
    item.appendChild(tags);

    item.appendChild(element("h2", "news-headline", card.headline));

    if (window.newsStatusLabel(card)) {
      item.appendChild(element("p", "news-status", window.newsStatusLabel(card)));
    }

    item.appendChild(element("p", "news-preview", card.preview));
    if (options.note) item.appendChild(element("p", "saved-note", options.note));

    var footer = element("div", "news-footer");
    var meta = element("p", "news-meta");
    meta.appendChild(element("span", "news-publisher", card.publisher));
    meta.appendChild(document.createTextNode(" · "));
    meta.appendChild(element("span", "news-date", window.newsDateLabel(card)));
    footer.appendChild(meta);

    var actions = element("div", "news-actions");
    var link = element("a", "news-link", "Read the source →");
    link.href = card.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", "Read the source at " + card.publisher + " (opens in a new tab)");
    actions.appendChild(link);
    actions.appendChild(renderBookmarkButton(card, options.state, options.onPress));
    footer.appendChild(actions);
    item.appendChild(footer);

    item.appendChild(renderDetails(card));
    return item;
  }

  // els: { filters, list, status, checked, message, interests } elements on the Discover screen (message and
  // interests are optional); news: { checkedOn, cards }; initialFilter (optional): a filter id such as "health",
  // used when arriving from a Learn issue. Without one, Discover opens on My interests when the reader has
  // chosen some, and on All otherwise.
  window.renderDiscoverScreen = function (els, news, initialFilter) {
    var defaultFilter = window.INTERESTS.ids().length > 0 ? "interests" : "all";
    var selected = filterIds().indexOf(initialFilter) !== -1 ? initialFilter : defaultFilter;
    var cards = newestFirst(news.cards);
    var interestsPanel = null;

    els.checked.textContent = "Last checked " + news.checkedOn + ". A hand-checked list, not a live news feed.";

    // The message line confirms saving and removing, and explains when the browser will not store anything.
    function showMessage(text, isError) {
      if (!els.message) return;
      els.message.textContent = text;
      els.message.classList.toggle("is-error", Boolean(isError));
    }

    function updateSavedCount() {
      var count = window.SAVED.count();
      els.filters.querySelector('[data-filter="saved"]').textContent = count > 0 ? "Saved (" + count + ")" : "Saved";
    }

    // The "Edit my interests" panel under the filters. It is built once and then only updated, so keyboard
    // focus stays on a checkbox while the choice changes the list below it.
    function buildInterestsPanel() {
      var details = element("details", "interests-edit");
      var summary = element("summary");
      var summaryText = element("span");
      summary.appendChild(summaryText);
      details.appendChild(summary);

      var body = element("div", "interests-body");
      var intro = element("p", "interests-intro",
        "Choose the topics you care about, and My interests will show the recent developments about them. " +
        "You can change your choices any time.");
      body.appendChild(intro);
      var fieldset = element("fieldset", "interest-picker");
      fieldset.appendChild(element("legend", null, "Topics you care about"));
      var options = element("div", "interest-options");
      var syncCheckboxes = window.renderInterestOptions(options, interestTopics(), interestsChanged);
      fieldset.appendChild(options);
      body.appendChild(fieldset);
      body.appendChild(element("p", "note interests-note",
        "Your choices stay in this browser on this device. They are not sent anywhere, " +
        "and nothing is guessed from what you click."));
      // Done closes the panel so the cards are the main thing on screen again, and puts keyboard focus
      // back on the bar that opened it.
      var done = element("button", "interests-done", "Done");
      done.type = "button";
      done.addEventListener("click", function () {
        details.open = false;
        summary.focus();
      });
      body.appendChild(done);
      details.appendChild(body);
      els.interests.replaceChildren(details);
      els.interests.hidden = true;

      function describe() {
        var count = window.INTERESTS.ids().length;
        summaryText.textContent = count === 0 ? "Choose your interests" : "Edit interests (" + count + " chosen)";
        intro.hidden = count > 0;
        done.hidden = count === 0;
      }

      interestsPanel = {
        // Shown when My interests opens: match the boxes to the saved list, and open the panel by itself
        // only for a reader who has not chosen anything yet.
        show: function () {
          syncCheckboxes();
          describe();
          details.open = window.INTERESTS.ids().length === 0;
          els.interests.hidden = false;
        },
        hide: function () { els.interests.hidden = true; },
        describe: describe
      };
    }

    function interestsChanged(stored) {
      interestsPanel.describe();
      showCards();
      showMessage(stored ? "" : window.INTERESTS.NOT_REMEMBERED, !stored);
    }

    function select(id) {
      selected = id;
      showMessage("");
      [].forEach.call(els.filters.querySelectorAll("button"), function (button) {
        button.setAttribute("aria-pressed", String(button.getAttribute("data-filter") === selected));
      });
      if (interestsPanel) {
        // Tapping My interests again while it is already open leaves the panel as the reader had it.
        if (id !== "interests") interestsPanel.hide();
        else if (els.interests.hidden) interestsPanel.show();
      }
      showCards();
    }

    function saveCard(card, button) {
      if (!window.SAVED.save(card)) {
        showMessage("Couldn't save this. Your browser isn't letting this page store anything (this can happen " +
          "in a private window), so nothing was saved.", true);
        return;
      }
      setBookmarkButton(button, card, "saved");
      updateSavedCount();
      showMessage("Saved. A copy is kept in this browser on this device only. Find it under Saved.");
    }

    function removeCard(card, button, inSavedList) {
      if (!window.SAVED.remove(card.id)) {
        showMessage("Couldn't remove this. Your browser isn't letting this page change what is stored, " +
          "so nothing was changed.", true);
        return;
      }
      updateSavedCount();
      if (inSavedList) {
        // The pressed button is about to disappear, so keep keyboard focus nearby instead of losing it.
        var position = [].indexOf.call(els.list.children, button.closest("li"));
        showCards();
        var buttons = els.list.querySelectorAll(".bookmark-button");
        (buttons[Math.min(position, buttons.length - 1)] || els.filters.querySelector('[data-filter="saved"]')).focus();
      } else {
        setBookmarkButton(button, card, "save");
      }
      showMessage("Removed from Saved.");
    }

    function pressBookmark(card, button) {
      var inSavedList = selected === "saved";
      if (!inSavedList && button.getAttribute("data-state") === "save") {
        saveCard(card, button);
      } else {
        removeCard(card, button, inSavedList);
      }
    }

    function emptyText() {
      if (selected === "saved") {
        return "Nothing saved yet. Press Save on any development to keep a copy here. " +
          "Saved items stay in this browser on this device only.";
      }
      if (selected === "interests") {
        return window.INTERESTS.ids().length === 0
          ? "Nothing here yet. Choose the topics you care about above, and the developments about them will appear here."
          : "No developments match your interests yet. We only list items we have been able to verify, " +
            "so some topics can be empty for now.";
      }
      return "No developments are tagged " + SHORT_LABELS[selected] +
        " yet. We only list items we have been able to verify, so some issues can be empty for now.";
    }

    function renderEmptyState() {
      var item = element("li", "news-empty no-position");
      if (selected === "all") {
        item.textContent = "No developments to show yet.";
        return item;
      }
      item.appendChild(element("span", null, emptyText()));
      var showAll = element("button", "compare-button empty-show-all", "Show all developments");
      showAll.type = "button";
      showAll.addEventListener("click", function () { select("all"); });
      item.appendChild(document.createElement("br"));
      item.appendChild(showAll);
      return item;
    }

    function showSavedCards() {
      var entries = window.SAVED.entries();
      els.list.replaceChildren();
      if (entries.length === 0) {
        els.list.appendChild(renderEmptyState());
        els.status.textContent = "No saved developments yet.";
        return;
      }
      entries.forEach(function (entry) {
        els.list.appendChild(renderCard(entry.card, {
          state: "remove",
          note: savedNote(entry, cards),
          onPress: pressBookmark
        }));
      });
      els.status.textContent = "Showing " + entries.length + " saved " +
        (entries.length === 1 ? "development" : "developments") +
        ", newest saved first. They are kept in this browser on this device only.";
    }

    function showCards() {
      if (selected === "saved") {
        showSavedCards();
        return;
      }
      var savedIds = {};
      window.SAVED.entries().forEach(function (entry) { savedIds[entry.card.id] = true; });
      var shown = cards.filter(function (card) {
        if (selected === "all") return true;
        if (selected === "interests") return window.INTERESTS.matches(card);
        return card.tags.indexOf(selected) !== -1;
      });
      els.list.replaceChildren();
      if (shown.length === 0) {
        els.list.appendChild(renderEmptyState());
      } else {
        shown.forEach(function (card) {
          els.list.appendChild(renderCard(card, { state: savedIds[card.id] ? "saved" : "save", onPress: pressBookmark }));
        });
      }
      var status = "Showing " + shown.length + " of " + cards.length + " developments";
      if (selected === "interests") {
        var interestIds = window.INTERESTS.ids();
        els.status.textContent = interestIds.length === 0
          ? "You haven't chosen any interests yet."
          : status + " about " + listInWords(interestIds.map(function (id) { return SHORT_LABELS[id]; })) +
            ". Choose All to see everything.";
      } else {
        els.status.textContent = status + (selected === "all" ? "." : ", tagged " + SHORT_LABELS[selected] + ".");
      }
    }

    els.filters.replaceChildren();
    filterGroups().forEach(function (group) {
      var section = element("div", "filter-group");
      var label = element("p", "filter-group-label", group.label);
      label.id = "discover-group-" + group.id;
      section.setAttribute("role", "group");
      section.setAttribute("aria-labelledby", label.id);
      var row = element("div", group.scrolls ? "filter-row filter-row-scroll" : "filter-row");
      group.filters.forEach(function (id) {
        var button = element("button", "filter-chip", SHORT_LABELS[id]);
        button.type = "button";
        button.setAttribute("data-filter", id);
        button.addEventListener("click", function () { select(id); });
        row.appendChild(button);
      });
      section.appendChild(label);
      section.appendChild(row);
      els.filters.appendChild(section);
    });
    updateSavedCount();
    if (els.interests) buildInterestsPanel();
    select(selected);
  };

  // On phones the topic row scrolls sideways; bring the chosen filter into view. Call this once the
  // screen is visible, because a hidden element has no position to measure.
  window.revealSelectedFilter = function (filters) {
    var chosen = filters.querySelector('[aria-pressed="true"]');
    if (!chosen) return;
    var row = chosen.parentElement;
    row.scrollLeft = Math.max(0,
      chosen.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft - 16);
  };
})();
