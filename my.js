// My ELECTAPP: one personal page that brings together the topics the reader chose, the newest verified
// development on each of them, and their saved stories.
// It adds no storage of its own. Interests come from interests.js and saved stories from saved.js, the same two
// lists Discover and Learn use, so a change made here shows up there and the other way round.
// Everything stays in this browser. Nothing is ranked or recommended: topics are the ones the reader ticked,
// and the development shown for each is simply the newest one in data/news.js.
(function () {
  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function sourceLink(card, text) {
    var link = element("a", "news-link", text || "Read the source →");
    link.href = card.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", "Read the source at " + card.publisher + " (opens in a new tab)");
    return link;
  }

  function metaLine(card) {
    var meta = element("p", "news-meta");
    meta.appendChild(element("span", "news-publisher", card.publisher));
    meta.appendChild(document.createTextNode(" · "));
    meta.appendChild(element("span", "news-date", window.newsDateLabel(card)));
    return meta;
  }

  // Until the reader asks for all of them, this many saved stories show, so the topic
  // briefings below stay within reach however many stories are saved.
  var SAVED_SHOWN_AT_FIRST = 3;

  // The topic tags of a saved story, like the tags on Discover's cards, so a card's color never carries meaning alone.
  function topicTags(card, topics) {
    var list = element("ul", "news-tags");
    card.tags.forEach(function (tag) {
      var match = topics.filter(function (topic) { return topic.id === tag; })[0];
      var chip = element("li", "tag-chip", match ? match.label : tag);
      chip.setAttribute("data-tag", tag);
      list.appendChild(chip);
    });
    return list;
  }

  // The page order depends on the width, and the page's own order (what a keyboard or
  // screen reader follows) is kept the same as what is shown: on a phone it is interests, saved stories, then
  // the topic briefings, so saved stories are not buried under a long briefing; on a laptop the briefing is the
  // left column and the saved stories the right one. The same breakpoint as the two-column layout in styles.css.
  var wideScreen = window.matchMedia ? window.matchMedia("(min-width: 900px)") : null;
  var shownElements = null;

  function placeSections() {
    if (!shownElements) return;
    var briefing = shownElements.briefingSection;
    var saved = shownElements.saved.closest("section");
    var focused = document.activeElement;
    var wide = Boolean(wideScreen && wideScreen.matches);
    briefing.parentNode.insertBefore(wide ? briefing : saved, wide ? saved : briefing);
    // Moving an element can drop keyboard focus; put it back.
    if (focused && focused !== document.body && document.activeElement !== focused && document.body.contains(focused)) focused.focus();
  }

  if (wideScreen) {
    if (wideScreen.addEventListener) wideScreen.addEventListener("change", placeSections);
    else if (wideScreen.addListener) wideScreen.addListener(placeSections);
    // Also on resize, in case a browser reports the change late (it is cheap and does nothing if nothing moved).
    window.addEventListener("resize", placeSections);
  }

  // els: the elements of the My ELECTAPP screen (see index.html).
  // actions: { openDiscover(topicId or null), openLearn(topicId) }, which open those screens from here.
  window.renderMyScreen = function (els, actions) {
    var topics = window.interestTopics();
    var savedOpen = false; // whether "Show all" has been pressed since this screen was opened
    shownElements = els;

    // Confirms a removal, or explains that the browser would not store a change.
    function showMessage(text, isError) {
      els.message.textContent = text;
      els.message.classList.toggle("is-error", Boolean(isError));
    }

    function chosenTopics() {
      return topics.filter(function (topic) { return window.INTERESTS.has(topic.id); });
    }

    function renderPills() {
      var picked = chosenTopics();
      els.pills.replaceChildren();
      els.interestsEmpty.hidden = picked.length > 0;
      els.addDone.hidden = picked.length === 0;
      picked.forEach(function (topic) {
        var pill = element("li", "interest-pill");
        pill.setAttribute("data-topic", topic.id);
        pill.appendChild(element("span", "interest-pill-label", topic.label));
        var remove = element("button", "interest-pill-remove");
        remove.type = "button";
        remove.setAttribute("aria-label", "Remove " + topic.label + " from my interests");
        var glyph = element("span", null, "×");
        glyph.setAttribute("aria-hidden", "true");
        remove.appendChild(glyph);
        remove.addEventListener("click", function () { removeInterest(topic, pill); });
        pill.appendChild(remove);
        els.pills.appendChild(pill);
      });
    }

    // One short row of actions under a briefing card: the source of the newest development, then the topic in
    // Discover (where the full stories are) and, for issues, in Learn. The labels are short so the row fits on
    // a phone; each button's full name is in its aria-label.
    function topicActions(topic, newest) {
      var row = element("div", "briefing-actions");
      if (newest) row.appendChild(sourceLink(newest, "Source →"));
      var discover = element("button", "briefing-discover my-action", "Discover →");
      discover.type = "button";
      discover.setAttribute("aria-label", "More in Discover: " + topic.label);
      discover.addEventListener("click", function () { actions.openDiscover(topic.id); });
      row.appendChild(discover);
      // Elections has no Learn section.
      if (topic.id !== "elections") {
        var learn = element("button", "briefing-learn my-action", "Learn →");
        learn.type = "button";
        learn.setAttribute("aria-label", "Learn about this issue: " + topic.label);
        learn.addEventListener("click", function () { actions.openLearn(topic.id); });
        row.appendChild(learn);
      }
      return row;
    }

    function renderBriefing() {
      var picked = chosenTopics();
      els.briefingSection.hidden = picked.length === 0;
      els.briefing.replaceChildren();
      picked.forEach(function (topic) {
        var cards = window.newsForTopic(topic.id);
        var newest = cards[0];
        var row = element("li", "briefing-row");
        row.setAttribute("data-topic", topic.id);
        // The topic and how many developments there are sit on one line; the full stories stay in Discover.
        var head = element("div", "briefing-head");
        head.appendChild(element("h3", "briefing-topic", topic.label));
        if (newest) {
          head.appendChild(element("span", "briefing-count",
            cards.length + (cards.length === 1 ? " development" : " developments")));
        }
        row.appendChild(head);
        if (!newest) {
          row.appendChild(element("p", "no-position", "No verified recent development on this topic yet."));
        } else {
          row.appendChild(element("p", "briefing-headline", newest.headline));
          if (window.newsStatusLabel(newest)) row.appendChild(element("p", "news-status", window.newsStatusLabel(newest)));
          // The whole preview stays in the page; the style shows two lines of it.
          row.appendChild(element("p", "briefing-preview", newest.preview));
          row.appendChild(metaLine(newest));
        }
        row.appendChild(topicActions(topic, newest));
        els.briefing.appendChild(row);
      });
    }

    function renderSaved() {
      var entries = window.SAVED.entries();
      els.saved.replaceChildren();
      els.savedLead.hidden = entries.length === 0;
      if (entries.length === 0) {
        var empty = element("li", "my-empty no-position");
        empty.appendChild(element("span", null, "Stories you save in Discover will appear here."));
        empty.appendChild(document.createElement("br"));
        var open = element("button", "my-action my-open-discover", "Open Discover");
        open.type = "button";
        open.addEventListener("click", function () { actions.openDiscover(null); });
        empty.appendChild(open);
        els.saved.appendChild(empty);
        return;
      }
      entries.forEach(function (entry) {
        var card = entry.card;
        var status = window.SAVED.status(entry, window.NEWS.cards);
        var row = element("li", "my-saved-row");
        row.setAttribute("data-id", card.id);
        row.setAttribute("data-status", status);
        row.setAttribute("data-topic", card.tags[0]);
        row.appendChild(topicTags(card, topics));
        row.appendChild(element("p", "briefing-headline", card.headline));
        if (window.newsStatusLabel(card)) row.appendChild(element("p", "news-status", window.newsStatusLabel(card)));
        row.appendChild(metaLine(card));
        row.appendChild(element("p", "news-meta saved-date", "Saved " + window.formatNewsDate(entry.savedOn)));
        if (status !== "same") row.appendChild(element("p", "saved-note", window.savedStatusText(status)));
        var footer = element("div", "news-actions");
        footer.appendChild(sourceLink(card));
        var remove = element("button", "bookmark-button", "Remove");
        remove.type = "button";
        remove.setAttribute("data-state", "remove");
        remove.setAttribute("aria-label", "Remove from saved: " + card.headline);
        remove.addEventListener("click", function () { removeSaved(card, row); });
        footer.appendChild(remove);
        row.appendChild(footer);
        els.saved.appendChild(row);
      });
      if (entries.length > SAVED_SHOWN_AT_FIRST) els.saved.appendChild(moreSavedButton(entries.length));
    }

    // The "Show all 8 saved stories" / "Show fewer" button at the end of a long saved list.
    function moreSavedButton(total) {
      var item = element("li", "saved-more");
      var button = element("button", "my-action saved-more-toggle");
      button.type = "button";
      button.setAttribute("aria-controls", els.saved.id);
      function show() {
        button.setAttribute("aria-expanded", String(savedOpen));
        button.textContent = savedOpen ? "Show fewer" : "Show all " + total + " saved stories";
        [].forEach.call(els.saved.querySelectorAll(".my-saved-row"), function (row, index) {
          row.hidden = !savedOpen && index >= SAVED_SHOWN_AT_FIRST;
        });
      }
      button.addEventListener("click", function () {
        savedOpen = !savedOpen;
        show();
      });
      show();
      item.appendChild(button);
      return item;
    }

    function removeInterest(topic, pill) {
      var position = [].indexOf.call(els.pills.children, pill);
      var stored = window.INTERESTS.toggle(topic.id, false);
      renderPills();
      renderBriefing();
      syncOptions();
      if (window.INTERESTS.ids().length === 0) els.add.open = true;
      // The pressed pill is gone, so keep keyboard focus nearby instead of losing it.
      var remaining = els.pills.querySelectorAll(".interest-pill-remove");
      (remaining[Math.min(position, remaining.length - 1)] || els.add.querySelector("summary")).focus();
      showMessage(stored ? topic.label + " removed from your interests." : window.INTERESTS.NOT_REMEMBERED, !stored);
    }

    function removeSaved(card, row) {
      var position = [].indexOf.call(els.saved.children, row);
      if (!window.SAVED.remove(card.id)) {
        showMessage("Couldn't remove this. Your browser isn't letting this page change what is stored, " +
          "so nothing was changed.", true);
        return;
      }
      renderSaved();
      // Only stories that are shown can take focus (the rest of a long list is folded away).
      var buttons = els.saved.querySelectorAll(".my-saved-row:not([hidden]) .bookmark-button");
      (buttons[Math.min(position, buttons.length - 1)] || els.savedHeading).focus();
      showMessage("Removed from Saved.");
    }

    // The same checkboxes Discover and Learn use, so choosing a topic here is choosing it everywhere.
    var syncOptions = window.renderInterestOptions(els.options, topics, function (stored) {
      renderPills();
      renderBriefing();
      showMessage(stored ? "" : window.INTERESTS.NOT_REMEMBERED, !stored);
    });

    // Done closes the picker so the briefing is the main thing on screen again, and puts keyboard focus back on
    // the bar that opened it. (The listener is replaced each time the screen is drawn.)
    els.addDone.onclick = function () {
      els.add.open = false;
      els.add.querySelector("summary").focus();
    };

    renderPills();
    renderBriefing();
    renderSaved();
    // Open by itself only for someone with no interests yet, so the cards stay the main thing otherwise.
    els.add.open = window.INTERESTS.ids().length === 0;
    showMessage("");
    placeSections();
  };
})();
