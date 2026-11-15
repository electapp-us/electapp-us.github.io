// The profile screen: one person, in four sections (About, Their positions, Documented actions, News and sources).
// It only reads data/people.js (through people.js); it keeps no storage of its own.
// Three kinds of information stay apart and are labelled: what the person says, what they have done (official
// records only), and what news organizations report. A person's own account of what they did is shown as their
// statement, never as a documented action. Nothing here rates, scores, or judges anyone.
(function () {
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var TABS = [
    { key: "about", label: "About" },
    { key: "positions", label: "Their positions" },
    { key: "actions", label: "Documented actions" },
    { key: "news", label: "News and sources" }
  ];

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function link(source, text, className) {
    var anchor = element("a", className || null, text || source.label);
    anchor.href = source.url;
    anchor.target = "_blank";
    anchor.rel = "noopener";
    return anchor;
  }

  // "March 27, 2023" becomes "2023-03-27", for the machine-readable date and for sorting newest first.
  function isoDate(text) {
    var parts = /^([A-Z][a-z]+) (\d{1,2}), (\d{4})$/.exec(text);
    if (!parts) return "";
    var month = MONTHS.indexOf(parts[1]) + 1;
    return parts[3] + "-" + (month < 10 ? "0" : "") + month + "-" + (parts[2].length < 2 ? "0" : "") + parts[2];
  }

  function topicLabel(topicId) {
    var topic = window.POSITION_TOPICS.filter(function (candidate) { return candidate.id === topicId; })[0];
    return topic ? topic.label : topicId;
  }

  function initials(name) {
    var words = name.split(" ").filter(Boolean);
    return (words[0].charAt(0) + (words.length > 1 ? words[words.length - 1].charAt(0) : "")).toUpperCase();
  }

  // The race this person is a candidate in, so the header can say which election and that no results are shown.
  function raceFor(person) {
    return window.ILLINOIS_ELECTION.races.filter(function (race) {
      return race.candidates.some(function (candidate) { return candidate.personId === person.id; });
    })[0];
  }

  function renderHeader(person, race) {
    var header = element("header", "profile-header");
    var identity = element("div", "profile-identity");
    var heading = element("h1", null, person.name);
    heading.id = "profile-heading";
    heading.tabIndex = -1;
    identity.appendChild(heading);
    var role = element("p", "profile-role", person.tagline.text + " ");
    role.appendChild(element("span", "profile-asof", "(as of " + person.tagline.asOf + ")"));
    identity.appendChild(role);
    var facts = element("p", "profile-facts");
    facts.appendChild(element("span", "party-chip " + window.partyClass(person.party), person.party));
    identity.appendChild(facts);
    header.appendChild(identity);

    var avatar = element("div", "profile-avatar", initials(person.name));
    avatar.setAttribute("aria-hidden", "true");
    header.appendChild(avatar);

    if (race) {
      header.appendChild(element("p", "profile-race",
        person.party + " nominee for " + race.office + " in Illinois (election held " + window.ILLINOIS_ELECTION.date +
        "). This profile does not show election results."));
    }
    header.appendChild(element("p", "profile-checked", "Information checked " + window.PEOPLE.checkedOn + "."));
    return header;
  }

  function renderAbout(person) {
    var panel = document.createDocumentFragment();
    var bio = element("div", "profile-bio");
    bio.appendChild(element("p", null, person.summary.text));
    (person.background || []).forEach(function (fact) {
      var paragraph = element("p", null, fact.text + " ");
      paragraph.appendChild(link(fact.source, "Source"));
      bio.appendChild(paragraph);
    });
    var sources = element("p", "profile-bio-sources", "Sources: ");
    person.summary.sources.forEach(function (source, index) {
      if (index > 0) sources.appendChild(document.createTextNode("; "));
      sources.appendChild(link(source));
    });
    bio.appendChild(sources);
    panel.appendChild(bio);

    panel.appendChild(element("h2", "profile-subheading", "Offices, leadership, and campaigns"));
    var timeline = element("ol", "role-timeline");
    person.roles.forEach(function (role) {
      var item = element("li");
      item.appendChild(element("span", "role-title", role.title));
      item.appendChild(element("span", "role-when", role.when));
      item.appendChild(link(role.source, "Source: " + role.source.label, "role-source"));
      timeline.appendChild(item);
    });
    panel.appendChild(timeline);
    return panel;
  }

  // One statement: what they say, their own account of what they did, or what the news reports. Quotes sit in a
  // quote block with who said it; the reporter's own description is kept apart from the quote.
  function renderStatement(item) {
    var entry = element("li", "profile-item");
    var quoted = item.type === "reported" && item.basis === "quote";
    var summarized = item.type === "reported" && item.basis === "summary";
    var label = window.ITEM_LABELS[window.itemKind(item)];
    if (quoted) label = "Their words, as quoted by news";
    if (summarized) label = "Reporter's summary, not their own words";
    entry.appendChild(element("span", "item-type", label));

    if (quoted) {
      if (item.setting) entry.appendChild(element("p", "item-setting", item.setting));
      var quote = element("blockquote", "item-quote");
      quote.appendChild(element("p", null, "“" + item.quote + "”"));
      entry.appendChild(quote);
      entry.appendChild(element("p", "item-quote-by", "— " + item.quoteBy + ", " + item.source.label));
      if (item.reporterSays) {
        var reporter = element("p", "item-reporter");
        reporter.appendChild(element("strong", null, "The outlet's description: "));
        reporter.appendChild(document.createTextNode(item.reporterSays));
        entry.appendChild(reporter);
      }
      if (item.note) entry.appendChild(element("p", "item-note", item.note));
    } else {
      entry.appendChild(element("p", "item-text", item.text));
    }
    entry.appendChild(link(item.source, "Source: " + item.source.label, "item-source"));
    return entry;
  }

  function renderPositions(person, race) {
    var panel = document.createDocumentFragment();
    var note = "What " + person.name + " says, as found before the " + window.ILLINOIS_ELECTION.date + " election";
    if (race) note += " (first found " + race.positionsCheckedOn + "; sources rechecked " + window.PEOPLE.checkedOn + ")";
    note += ". Their own accounts of what they did are labelled as theirs and are not independently verified.";
    panel.appendChild(element("p", "profile-panel-note", note));

    var missing = [];
    window.POSITION_TOPICS.forEach(function (topic) {
      var items = person.statements[topic.id];
      if (!items || items.length === 0) {
        missing.push(topic.label);
        return;
      }
      var card = element("details", "topic issue-card");
      card.setAttribute("data-topic", topic.id);
      var summary = element("summary", "topic-summary");
      summary.appendChild(element("span", "topic-label", topic.label));
      summary.appendChild(element("span", "issue-takeaway", person.summaries[topic.id]));
      card.appendChild(summary);
      var list = element("ul", "position-list");
      items.forEach(function (item) { list.appendChild(renderStatement(item)); });
      card.appendChild(list);
      panel.appendChild(card);
    });
    if (missing.length > 0) {
      panel.appendChild(element("p", "no-position profile-missing", "No position found yet on: " + missing.join("; ") + "."));
    }
    return panel;
  }

  function renderActions(person) {
    var panel = document.createDocumentFragment();
    panel.appendChild(element("p", "profile-panel-note",
      "Things " + person.name + " has done that are backed by official records, such as bill pages, committee hearing " +
      "records, and government announcements. A candidate's own account of what they did is shown under Their " +
      "positions, labelled as their own."));

    var actions = [];
    Object.keys(person.record).forEach(function (topicId) {
      person.record[topicId].forEach(function (item) {
        actions.push({ topicId: topicId, item: item, iso: isoDate(item.date) });
      });
    });
    actions.sort(function (a, b) { return a.iso < b.iso ? 1 : a.iso > b.iso ? -1 : 0; });

    if (actions.length === 0) {
      panel.appendChild(element("p", "profile-empty", person.actionsEmpty ||
        "No documented actions have been added for " + person.name + " yet. That reflects what we have added so far, " +
        "not whether " + person.name + " has done anything."));
      return panel;
    }
    var list = element("ul", "action-list");
    actions.forEach(function (action) {
      var card = element("li", "action-card");
      var top = element("div", "action-top");
      var time = element("time", "action-date", action.item.date);
      time.setAttribute("datetime", action.iso);
      top.appendChild(time);
      var tag = element("span", "tag-chip", topicLabel(action.topicId));
      tag.setAttribute("data-tag", action.topicId);
      top.appendChild(tag);
      card.appendChild(top);
      card.appendChild(element("p", "item-text", action.item.text));
      card.appendChild(link(action.item.source, "Source: " + action.item.source.label, "item-source"));
      list.appendChild(card);
    });
    panel.appendChild(list);
    return panel;
  }

  // Every distinct source used anywhere on the profile, once each, grouped by what kind of source it is.
  function collectSources(person) {
    var found = [];
    function add(source) {
      if (!source || found.some(function (existing) { return existing.url === source.url; })) return;
      found.push(source);
    }
    person.summary.sources.forEach(add);
    person.tagline.sources.forEach(add);
    person.roles.forEach(function (role) { add(role.source); });
    (person.background || []).forEach(function (fact) { add(fact.source); });
    Object.keys(person.statements).forEach(function (topicId) {
      person.statements[topicId].forEach(function (item) { add(item.source); });
    });
    Object.keys(person.record).forEach(function (topicId) {
      person.record[topicId].forEach(function (item) { add(item.source); });
    });
    person.coverage.forEach(function (group) {
      group.entries.forEach(function (entry) { add(entry.source); });
    });
    return found;
  }

  // The news reports behind the positions, one line each, with the issues each one was used for.
  function reportingUsed(person) {
    var rows = [];
    Object.keys(person.statements).forEach(function (topicId) {
      person.statements[topicId].forEach(function (item) {
        if (item.type !== "reported") return;
        var row = rows.filter(function (existing) { return existing.source.url === item.source.url; })[0];
        if (!row) {
          row = { source: item.source, topics: [] };
          rows.push(row);
        }
        if (row.topics.indexOf(topicLabel(topicId)) === -1) row.topics.push(topicLabel(topicId));
      });
    });
    return rows;
  }

  function renderNews(person) {
    var panel = document.createDocumentFragment();

    panel.appendChild(element("h2", "profile-subheading", "In the news"));
    if (person.coverage.length === 0) {
      panel.appendChild(element("p", "profile-empty", "No other news coverage has been added yet."));
    }
    person.coverage.forEach(function (group) {
      var card = element("article", "coverage-group");
      card.appendChild(element("h3", null, group.title));
      var entries = element("ol", "coverage-entries");
      group.entries.forEach(function (entry) {
        var item = element("li", "coverage-entry");
        item.appendChild(element("span", "coverage-when", entry.when));
        item.appendChild(element("p", "item-text", entry.text));
        item.appendChild(link(entry.source, "Source: " + entry.source.label, "item-source"));
        entries.appendChild(item);
      });
      card.appendChild(entries);
      if (group.caveat) card.appendChild(element("p", "coverage-caveat", group.caveat));
      panel.appendChild(card);
    });

    var used = reportingUsed(person);
    if (used.length > 0) {
      panel.appendChild(element("h2", "profile-subheading", "Reporting behind the positions"));
      var list = element("ul", "reporting-list");
      used.forEach(function (row) {
        var item = element("li");
        item.appendChild(link(row.source));
        item.appendChild(document.createTextNode(" — used for: " + row.topics.join(", ")));
        list.appendChild(item);
      });
      panel.appendChild(list);
    }

    panel.appendChild(element("h2", "profile-subheading", "All sources"));
    var kinds = [
      { kind: "official", title: "Official records" },
      { kind: "campaign", title: "Their own websites" },
      { kind: "news", title: "News reports" }
    ];
    var sources = collectSources(person);
    kinds.forEach(function (group) {
      var inGroup = sources.filter(function (source) { return source.kind === group.kind; });
      if (inGroup.length === 0) return;
      var section = element("section", "source-group");
      section.appendChild(element("h3", null, group.title));
      var sourceList = element("ul", "source-list");
      inGroup.forEach(function (source) {
        var item = element("li");
        item.appendChild(link(source));
        sourceList.appendChild(item);
      });
      section.appendChild(sourceList);
      panel.appendChild(section);
    });
    return panel;
  }

  function renderTabs(person, race) {
    var wrapper = element("div", "profile-main");
    var tablist = element("div", "profile-tabs");
    tablist.id = "profile-tabs";
    tablist.setAttribute("role", "tablist");
    tablist.setAttribute("aria-label", "Sections of " + person.name + "'s profile");
    wrapper.appendChild(tablist);

    var builders = {
      about: function () { return renderAbout(person); },
      positions: function () { return renderPositions(person, race); },
      actions: function () { return renderActions(person); },
      news: function () { return renderNews(person); }
    };
    var tabs = [];
    var panels = [];

    function select(index, moveFocus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (moveFocus) tabs[index].focus();
    }

    TABS.forEach(function (definition, index) {
      var tab = element("button", "profile-tab", definition.label);
      tab.type = "button";
      tab.id = "profile-tab-" + definition.key;
      tab.setAttribute("role", "tab");
      tab.setAttribute("data-tab", definition.key);
      tab.setAttribute("aria-controls", "profile-panel-" + definition.key);
      tab.addEventListener("click", function () { select(index, false); });
      tablist.appendChild(tab);
      tabs.push(tab);

      var panel = element("div", "profile-panel");
      panel.id = "profile-panel-" + definition.key;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tab.id);
      panel.tabIndex = 0;
      panel.appendChild(builders[definition.key]());
      panels.push(panel);
    });

    // Arrow keys move between the sections; Home and End jump to the first and last.
    tablist.addEventListener("keydown", function (event) {
      var current = tabs.indexOf(document.activeElement);
      if (current === -1) return;
      var next = -1;
      if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (current + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      if (next === -1) return;
      event.preventDefault();
      select(next, true);
    });

    panels.forEach(function (panel) { wrapper.appendChild(panel); });
    select(0, false);
    return wrapper;
  }

  // body: the element to draw into. person: an entry of window.PEOPLE.people.
  window.renderProfileScreen = function (body, person) {
    var race = raceFor(person);
    body.replaceChildren();
    var layout = element("div", "profile-layout");
    layout.appendChild(renderHeader(person, race));
    layout.appendChild(renderTabs(person, race));
    body.appendChild(layout);
  };
})();
