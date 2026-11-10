// Discover: shows the hand-checked list in window.NEWS as compact cards with a topic filter.
// The same list is shared with Learn through window.newsForTopic, so news lives in one place.
// Colors on cards and filters identify the topic only. They never rate a source or a political side.
(function () {
  var MONTHS = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
  var DATE_WORDS = { published: "Published", updated: "Updated", decided: "Decided" };

  // Short names for the filter buttons and tags, so they fit on a phone.
  var SHORT_LABELS = {
    all: "All",
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

  function filterIds() {
    return ["all", "elections"].concat(window.POSITION_TOPICS.map(function (topic) { return topic.id; }));
  }

  function renderTag(tag) {
    var chip = element("li", "tag-chip", SHORT_LABELS[tag]);
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

  function renderCard(card) {
    var item = element("li", "news-card");
    item.setAttribute("data-id", card.id);
    item.setAttribute("data-published", card.published);
    item.setAttribute("data-topic", card.tags[0]);

    var tags = element("ul", "news-tags");
    card.tags.forEach(function (tag) { tags.appendChild(renderTag(tag)); });
    item.appendChild(tags);

    item.appendChild(element("h2", "news-headline", card.headline));

    if (card.resultStatus === "called") {
      item.appendChild(element("p", "news-status", "Called by AP · not yet officially certified"));
    }

    item.appendChild(element("p", "news-preview", card.preview));

    var footer = element("div", "news-footer");
    var meta = element("p", "news-meta");
    meta.appendChild(element("span", "news-publisher", card.publisher));
    meta.appendChild(document.createTextNode(" · "));
    meta.appendChild(element("span", "news-date", window.newsDateLabel(card)));
    footer.appendChild(meta);

    var link = element("a", "news-link", "Read the source →");
    link.href = card.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", "Read the source at " + card.publisher + " (opens in a new tab)");
    footer.appendChild(link);
    item.appendChild(footer);

    item.appendChild(renderDetails(card));
    return item;
  }

  // els: { filters, list, status, checked } elements on the Discover screen; news: { checkedOn, cards };
  // initialFilter (optional): a filter id such as "health", used when arriving from a Learn issue.
  window.renderDiscoverScreen = function (els, news, initialFilter) {
    var selected = filterIds().indexOf(initialFilter) !== -1 ? initialFilter : "all";
    var cards = newestFirst(news.cards);

    els.checked.textContent = "Last checked " + news.checkedOn + ". A hand-checked list, not a live news feed.";

    function select(id) {
      selected = id;
      [].forEach.call(els.filters.children, function (button) {
        button.setAttribute("aria-pressed", String(button.getAttribute("data-filter") === selected));
      });
      showCards();
    }

    function renderEmptyState() {
      var item = element("li", "news-empty no-position");
      if (selected === "all") {
        item.textContent = "No developments to show yet.";
        return item;
      }
      item.appendChild(element("span", null, "No developments are tagged " + SHORT_LABELS[selected] +
        " yet. We only list items we have been able to verify, so some issues can be empty for now."));
      var showAll = element("button", "compare-button empty-show-all", "Show all developments");
      showAll.type = "button";
      showAll.addEventListener("click", function () { select("all"); });
      item.appendChild(document.createElement("br"));
      item.appendChild(showAll);
      return item;
    }

    function showCards() {
      var shown = cards.filter(function (card) {
        return selected === "all" || card.tags.indexOf(selected) !== -1;
      });
      els.list.replaceChildren();
      if (shown.length === 0) {
        els.list.appendChild(renderEmptyState());
      } else {
        shown.forEach(function (card) { els.list.appendChild(renderCard(card)); });
      }
      els.status.textContent = "Showing " + shown.length + " of " + cards.length + " developments" +
        (selected === "all" ? "." : ", tagged " + SHORT_LABELS[selected] + ".");
    }

    els.filters.replaceChildren();
    filterIds().forEach(function (id) {
      var button = element("button", "filter-chip", SHORT_LABELS[id]);
      button.type = "button";
      button.setAttribute("data-filter", id);
      button.addEventListener("click", function () { select(id); });
      els.filters.appendChild(button);
    });
    select(selected);
  };

  // On phones the filter row scrolls sideways; bring the chosen filter into view. Call this once the
  // screen is visible, because a hidden element has no position to measure.
  window.revealSelectedFilter = function (filters) {
    var chosen = filters.querySelector('[aria-pressed="true"]');
    if (!chosen) return;
    filters.scrollLeft = Math.max(0,
      chosen.getBoundingClientRect().left - filters.getBoundingClientRect().left + filters.scrollLeft - 16);
  };
})();
