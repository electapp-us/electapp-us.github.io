(function () {
  var zipScreen = document.getElementById("zip-screen");
  var resultsScreen = document.getElementById("results-screen");
  var compareScreen = document.getElementById("compare-screen");
  var zipForm = document.getElementById("zip-form");
  var zipInput = document.getElementById("zip-input");
  var zipError = document.getElementById("zip-error");
  var backButton = document.getElementById("back-button");
  var resultsSubtitle = document.getElementById("results-subtitle");
  var raceList = document.getElementById("race-list");
  var issuesScreen = document.getElementById("issues-screen");
  var issueList = document.getElementById("issue-list");
  var issuePickerOptions = document.getElementById("issue-picker-options");
  var issuePickerStatus = document.getElementById("issue-picker-status");
  var issuesReturnScreen = zipScreen;
  var issuesMode = "national";
  // The issue boxes read and write the shared interests list (interests.js), so Learn and Discover agree.
  var syncIssuePicker = function () {};
  var renderedInterests = "";
  // Which issues Learn shows right now is a separate thing from the interests (the saved, ticked boxes).
  // True means the reader chose "All issues" even though they have interests. It is kept while the page
  // stays open (also when leaving Learn and coming back) and is never saved, so a refresh starts on
  // My interests again.
  var issueView = document.getElementById("issue-view");
  var showingAllIssues = false;
  var practiceScreen = document.getElementById("practice-screen");
  var practiceList = document.getElementById("practice-list");
  var practiceReturnScreen = zipScreen;
  var discoverScreen = document.getElementById("discover-screen");
  var discoverReturnScreen = zipScreen;
  var discoverReturnIssueId = null;
  var quizScreen = document.getElementById("quiz-screen");
  var quizResultsScreen = document.getElementById("quiz-results-screen");
  var quizReturnScreen = zipScreen;
  var quizAnswers = {};
  var myScreen = document.getElementById("my-screen");
  var myReturnScreen = zipScreen;
  // A profile can be opened from the race cards, the comparison, and Learn's Illinois view; Back returns to
  // whichever one it was opened from, at the same place, with focus back on the button that was pressed.
  var profileScreen = document.getElementById("profile-screen");
  var profileReturnScreen = zipScreen;
  var profileOpener = null;
  var profileReturnScroll = 0;

  var ERROR_MESSAGES = {
    format: "Please enter a 5-digit zip code, like 61820.",
    "outside-illinois": "That zip code isn't in Illinois, and the election reference only covers Illinois. Learn about the issues, the quiz, and Practice work for everyone, without a zip code."
  };

  function showError(message) {
    zipError.textContent = message;
    zipError.hidden = false;
    zipInput.setAttribute("aria-invalid", "true");
  }

  function clearError() {
    zipError.hidden = true;
    zipError.textContent = "";
    zipInput.removeAttribute("aria-invalid");
  }

  function partyClass(party) {
    var known = ["democratic", "republican", "libertarian", "green"];
    var key = party.toLowerCase();
    return known.indexOf(key) === -1 ? "party-other" : "party-" + key;
  }
  window.partyClass = partyClass;

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // The way into a person's profile from anywhere a candidate is shown (only candidates linked to a person have one).
  function profileButton(candidate) {
    var button = element("button", "profile-link", "View profile →");
    button.type = "button";
    button.setAttribute("data-person", candidate.personId);
    button.setAttribute("aria-label", "View profile: " + candidate.name);
    button.addEventListener("click", function () { showProfile(candidate.personId, button); });
    return button;
  }

  function showProfile(personId, opener) {
    var person = window.personById(personId);
    if (!person) return;
    var from = document.querySelector(".screen:not([hidden])");
    profileReturnScreen = from;
    profileOpener = opener;
    profileReturnScroll = window.scrollY;
    var backLabels = { "results-screen": "races", "compare-screen": "comparison", "issues-screen": "Learn" };
    document.getElementById("profile-back-button").textContent = "← Back to " + (backLabels[from.id] || "where you were");
    window.renderProfileScreen(document.getElementById("profile-body"), person);
    from.hidden = true;
    profileScreen.hidden = false;
    window.scrollTo(0, 0);
    document.getElementById("profile-heading").focus();
  }

  function leaveProfile() {
    profileScreen.hidden = true;
    profileReturnScreen.hidden = false;
    if (profileOpener && document.body.contains(profileOpener)) profileOpener.focus({ preventScroll: true });
    window.scrollTo(0, profileReturnScroll);
  }

  function renderCandidate(candidate) {
    var item = element("li", "candidate");
    item.appendChild(element("span", "avatar", candidate.name.charAt(0)));

    var details = element("div", "candidate-details");
    details.appendChild(element("span", "candidate-name", candidate.name));
    if (candidate.runningMate) {
      details.appendChild(element("span", "running-mate", "with " + candidate.runningMate));
    }
    if (candidate.personId) details.appendChild(profileButton(candidate));
    item.appendChild(details);

    item.appendChild(element("span", "party-chip " + partyClass(candidate.party), candidate.party));
    return item;
  }

  function renderRace(race) {
    var card = element("li", "race-card");
    card.appendChild(element("p", "race-level", race.level));
    card.appendChild(element("h2", "race-office", race.office));
    card.appendChild(element("p", "race-explainer", race.explainer));

    var candidates = element("ul", "candidate-list");
    race.candidates.forEach(function (candidate) {
      candidates.appendChild(renderCandidate(candidate));
    });
    card.appendChild(candidates);

    if (race.positions) {
      var compareButton = element("button", "compare-button", "Compare positions");
      compareButton.type = "button";
      compareButton.addEventListener("click", function () {
        showComparison(race);
      });
      card.appendChild(compareButton);
    }

    var source = element("p", "race-source", "Source: ");
    var link = element("a", null, race.source.label);
    link.href = race.source.url;
    link.target = "_blank";
    link.rel = "noopener";
    source.appendChild(link);
    card.appendChild(source);
    return card;
  }

  function showResults(zip) {
    var election = window.ILLINOIS_ELECTION;
    resultsSubtitle.textContent =
      "Statewide races for the " + election.date + " general election, as we found them before Election Day " +
      "(zip code " + zip + "). Local and district races are not included.";
    raceList.replaceChildren();
    election.races.forEach(function (race) {
      raceList.appendChild(renderRace(race));
    });
    zipScreen.hidden = true;
    resultsScreen.hidden = false;
    window.scrollTo(0, 0);
    document.getElementById("results-heading").focus();
  }

  // Plain statement of who has a position on file for a topic; never a judgment of the positions.
  function describeCoverage(race, topicId) {
    var withPositions = race.candidates.filter(function (candidate) {
      var items = race.positions[topicId][candidate.name];
      return items && items.length > 0;
    });
    if (withPositions.length === race.candidates.length) return "Positions found for both candidates";
    if (withPositions.length === 0) return "No positions found";
    return "Position found only for " + withPositions[0].name;
  }

  function renderPositionItem(item) {
    var kind = window.itemKind(item);
    var entry = element("li", "position-item");
    entry.appendChild(element("span", "item-type item-type-" + kind, window.ITEM_LABELS[kind]));
    entry.appendChild(element("p", "item-text", item.text));
    var link = element("a", "item-source", "Source: " + item.source.label);
    link.href = item.source.url;
    link.target = "_blank";
    link.rel = "noopener";
    entry.appendChild(link);
    return entry;
  }

  function renderCandidatePositions(race, topicId, candidate) {
    var block = element("div", "topic-candidate");
    var header = element("div", "topic-candidate-header");
    header.appendChild(element("span", "candidate-name", candidate.name));
    header.appendChild(element("span", "party-chip " + partyClass(candidate.party), candidate.party));
    if (candidate.personId) header.appendChild(profileButton(candidate));
    block.appendChild(header);

    var items = race.positions[topicId][candidate.name] || [];
    if (items.length === 0) {
      block.appendChild(element("p", "no-position", "No position found"));
    } else {
      var list = element("ul", "position-list");
      items.forEach(function (item) {
        list.appendChild(renderPositionItem(item));
      });
      block.appendChild(list);
    }

    // For a person with a profile, say plainly when no action from official records has been added for this
    // issue yet. This is about what has been added, not a claim that they have done nothing.
    var hasDocumentedRecord = items.some(function (item) { return item.type === "record"; });
    if (candidate.personId && !hasDocumentedRecord) {
      block.appendChild(element("p", "no-position no-record", window.PEOPLE.noRecordText));
    }

    var gap = race.gaps && race.gaps[topicId] && race.gaps[topicId][candidate.name];
    if (gap) block.appendChild(element("p", "no-position", "Not addressed in the platform: " + gap));
    return block;
  }

  // One block per candidate, side by side on wide screens and stacked on narrow ones.
  function renderCandidateColumns(race, topicId) {
    var columns = element("div", "topic-columns");
    race.candidates.forEach(function (candidate) {
      columns.appendChild(renderCandidatePositions(race, topicId, candidate));
    });
    return columns;
  }

  function showComparison(race) {
    document.getElementById("compare-heading").textContent = race.office + ": compare positions";
    document.getElementById("compare-subtitle").textContent =
      "Where each candidate stood before Election Day, topic by topic. Positions first found " +
      race.positionsCheckedOn + "; sources rechecked " + race.sourcesRecheckedOn + ".";

    var topicList = document.getElementById("topic-list");
    topicList.replaceChildren();
    window.POSITION_TOPICS.forEach(function (topic, index) {
      var details = element("details", "topic");
      if (index === 0) details.open = true;

      var summary = element("summary", "topic-summary");
      summary.appendChild(element("span", "topic-label", topic.label));
      summary.appendChild(element("span", "topic-coverage", describeCoverage(race, topic.id)));
      details.appendChild(summary);

      details.appendChild(renderCandidateColumns(race, topic.id));
      topicList.appendChild(details);
    });

    resultsScreen.hidden = true;
    compareScreen.hidden = false;
    window.scrollTo(0, 0);
    document.getElementById("compare-heading").focus();
  }

  // The national Learn screen shows the major parties' platforms; the Illinois section shows the
  // Illinois races. Both have the same shape (candidates, positions, positionSummaries).
  function nationalSources() {
    return [window.PARTY_PLATFORMS];
  }

  function illinoisSources() {
    return window.ILLINOIS_ELECTION.races;
  }

  function renderIssueCandidates(topic, heading, sources) {
    var section = element("div", "issue-candidates");
    if (heading) section.appendChild(element("h3", "issue-heading", heading));

    var races = sources.filter(function (race) {
      return race.positions && race.positions[topic.id];
    });
    if (races.length === 0) {
      section.appendChild(element("p", "no-position", "No positions on file for this issue yet."));
      return section;
    }
    races.forEach(function (race) {
      section.appendChild(element("p", "issue-race", race.office));
      section.appendChild(renderCandidateColumns(race, topic.id));
      if (race.fullLinks) {
        var links = element("p", "full-links");
        race.fullLinks.forEach(function (fullLink) {
          var anchor = element("a", null, fullLink.label);
          anchor.href = fullLink.url;
          anchor.target = "_blank";
          anchor.rel = "noopener";
          links.appendChild(anchor);
        });
        section.appendChild(links);
      }
    });
    return section;
  }

  function renderIssue(topic) {
    var illinois = issuesMode === "illinois";
    var guide = (illinois ? window.ILLINOIS_ISSUE_GUIDES : window.ISSUE_GUIDES)[topic.id];
    var sources = illinois ? illinoisSources() : nationalSources();
    var details = element("details", "topic issue-card");
    details.setAttribute("data-issue", topic.id);
    var summary = element("summary", "topic-summary");
    summary.appendChild(element("span", "topic-label", topic.label));
    summary.appendChild(element("span", "issue-takeaway", guide.summary));
    var news = illinois ? [] : window.newsForTopic(topic.id);
    if (!illinois) {
      var latest = element("span", "issue-latest");
      latest.appendChild(element("strong", null, "Latest: "));
      latest.appendChild(document.createTextNode(
        news.length > 0 ? news[0].headline : "No verified recent development on this issue yet."));
      summary.appendChild(latest);

      // On the card face, right under "Latest", so it is visible while the card is collapsed.
      // A button inside the summary opens Discover without expanding or collapsing the card.
      var seeNews = element("button", "learn-discover-link", "See recent developments");
      seeNews.type = "button";
      // Seven identical buttons would sound the same to a screen reader, so each names its issue.
      seeNews.setAttribute("aria-label", "See recent developments about " + topic.label);
      var arrow = element("span", null, " →");
      arrow.setAttribute("aria-hidden", "true");
      seeNews.appendChild(arrow);
      seeNews.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        showDiscover(issuesScreen, { filter: topic.id, issueId: topic.id, backLabel: topic.label });
      });
      summary.appendChild(seeNews);
    }
    summary.appendChild(renderIssueGlance(topic, sources));
    details.appendChild(summary);

    var body = element("div", "issue-body");
    if (!illinois) {
      body.appendChild(renderIssueSection(
        topic,
        "Where things stand now (checked " + window.NEWS.checkedOn + ")",
        news.length > 0
          ? renderDevelopments(news)
          : element("p", "no-position", "We have not verified a recent development on this issue yet. We only list items we can check against their sources, so check back after the next update.")
      ));
    }
    body.appendChild(renderIssueSection(topic, "Who makes the decisions", element("p", null, guide.whoDecides)));

    var questions = element("ul", "issue-questions");
    guide.questions.forEach(function (question) {
      questions.appendChild(element("li", null, question));
    });
    body.appendChild(renderIssueSection(topic, "What people disagree about", questions));
    body.appendChild(renderIssueSection(
      topic,
      illinois ? "Full sourced positions" : "What the parties' latest platforms (2024) say, with sources",
      renderIssueCandidates(topic, null, sources)
    ));
    details.appendChild(body);
    return details;
  }

  // Dated, sourced list of recent laws, rulings, and what each party's leaders say they would do next.
  function renderDevelopments(cards) {
    var list = element("ul", "position-list");
    cards.forEach(function (card) {
      var entry = element("li", "position-item");
      entry.appendChild(element("span", "item-type", window.newsDateLabel(card)));
      entry.appendChild(element("p", "item-text", card.headline + ". " + card.summary));
      var link = element("a", "item-source", "Source: " + card.publisher);
      link.href = card.url;
      link.target = "_blank";
      link.rel = "noopener";
      entry.appendChild(link);
      list.appendChild(entry);
    });
    return list;
  }

  // Layer 1: one line per candidate, visible on the collapsed issue card.
  function renderIssueGlance(topic, sources) {
    var glance = element("span", "issue-glance");
    sources.forEach(function (race) {
      if (!race.positionSummaries || !race.positionSummaries[topic.id]) return;
      race.candidates.forEach(function (candidate) {
        var item = element("span", "glance-item");
        var who = element("span", "glance-who");
        who.appendChild(element("span", "glance-name", candidate.name));
        who.appendChild(element("span", "party-chip " + partyClass(candidate.party), candidate.party));
        item.appendChild(who);
        item.appendChild(element("span", "glance-text", race.positionSummaries[topic.id][candidate.name] || "No position found."));
        glance.appendChild(item);
      });
    });
    return glance;
  }

  // Layer 2 and 3: a titled section that opens on its own; opening one closes the others on the card.
  function renderIssueSection(topic, title, content) {
    var section = element("details", "issue-section");
    section.setAttribute("name", "issue-sections-" + topic.id);
    section.appendChild(element("summary", "issue-section-title", title));
    var inner = element("div", "issue-section-body");
    inner.appendChild(content);
    section.appendChild(inner);
    return section;
  }

  // The two chips above the picker: My interests (the issues the visitor ticked) and All issues. They only
  // change what is shown, never the interests themselves.
  function buildIssueViewChips() {
    var row = issueView.querySelector(".filter-row");
    ["interests", "all"].forEach(function (view) {
      var chip = element("button", "filter-chip", view === "all" ? "All issues" : "My interests");
      chip.type = "button";
      chip.setAttribute("data-view", view);
      chip.addEventListener("click", function () {
        showingAllIssues = view === "all";
        renderIssueList();
      });
      row.appendChild(chip);
    });
  }

  function updateIssueViewChips(interestCount, focused) {
    issueView.hidden = interestCount === 0;
    var interestsChip = issueView.querySelector('[data-view="interests"]');
    interestsChip.textContent = "My interests (" + interestCount + ")";
    interestsChip.setAttribute("aria-pressed", String(focused));
    issueView.querySelector('[data-view="all"]').setAttribute("aria-pressed", String(!focused));
  }

  // Shows the issues the visitor chose, or every issue. The choices are the visitor's interests, kept in this
  // browser and shared with Discover. Elections is an interest too, but Learn has no Elections section.
  function renderIssueList() {
    var topics = window.POSITION_TOPICS;
    var picked = topics.filter(function (topic) { return window.INTERESTS.has(topic.id); });
    // With nothing chosen there is nothing to switch between, so the next first choice narrows Learn again.
    if (picked.length === 0) showingAllIssues = false;
    var focused = picked.length > 0 && !showingAllIssues;
    var shown = focused ? picked : topics;
    renderedInterests = window.INTERESTS.ids().join();

    issueList.replaceChildren();
    shown.forEach(function (topic) {
      var card = renderIssue(topic);
      if (focused) card.open = true;
      issueList.appendChild(card);
    });
    updateIssueViewChips(picked.length, focused);

    if (focused) {
      issuePickerStatus.textContent = "Showing " + picked.length + " of " + topics.length +
        " issues, your interests. They are also used in Discover. Choose All issues to see everything; " +
        "your interests are kept.";
    } else if (picked.length > 0) {
      issuePickerStatus.textContent = "Showing all " + topics.length + " issues. " +
        (picked.length === 1 ? "Your 1 interest is" : "Your " + picked.length + " interests are") +
        " kept; choose My interests to focus on " + (picked.length === 1 ? "it" : "them") + ".";
    } else {
      issuePickerStatus.textContent = "Showing all " + topics.length +
        " issues. Check the ones you care about to focus on them." +
        (window.INTERESTS.has("elections") ? " Elections is also one of your interests; it applies in Discover." : "");
    }
  }

  function renderIssuePicker() {
    syncIssuePicker = window.renderInterestOptions(issuePickerOptions, window.POSITION_TOPICS, function (stored) {
      renderIssueList();
      if (!stored) issuePickerStatus.textContent += " " + window.INTERESTS.NOT_REMEMBERED;
    });
  }

  var ISSUES_SCREEN_TEXT = {
    national: {
      heading: "Learn about the issues",
      lead: "Each issue is explained in plain language: what it is, who makes the decisions, and what people disagree about. See what has happened recently, with dates and sources, and what each major party's latest official platform (2024) says. A platform describes the party, not every member of it."
    },
    illinois: {
      heading: "Illinois candidates by issue",
      lead: "The same issues, with the 2026 Illinois U.S. Senate candidates' own sourced positions (as found before Election Day) and the Illinois details."
    }
  };

  // options (optional): { openIssueId, backLabel } when arriving from My ELECTAPP, so that issue opens and
  // Back says where it goes.
  function showIssues(fromScreen, mode, options) {
    issuesReturnScreen = fromScreen;
    issuesMode = mode;
    document.getElementById("issues-heading").textContent = ISSUES_SCREEN_TEXT[mode].heading;
    document.getElementById("issues-lead").textContent = ISSUES_SCREEN_TEXT[mode].lead;
    document.getElementById("issues-back-button").textContent =
      "← Back" + (options && options.backLabel ? " to " + options.backLabel : "");
    syncIssuePicker();
    renderIssueList();
    fromScreen.hidden = true;
    issuesScreen.hidden = false;
    window.scrollTo(0, 0);
    var card = options && options.openIssueId &&
      issueList.querySelector('.issue-card[data-issue="' + options.openIssueId + '"]');
    if (card) {
      card.open = true;
      card.scrollIntoView();
      card.querySelector("summary").focus({ preventScroll: true });
    } else {
      document.getElementById("issues-heading").focus();
    }
  }

  function renderQuizTopic(topic) {
    var details = element("details", "topic");
    var summary = element("summary", "topic-summary");
    summary.appendChild(element("span", "topic-label", topic.label));
    details.appendChild(summary);

    var body = element("div", "issue-body");
    body.appendChild(element("h3", "issue-heading", "Your answers"));
    var answers = element("ul", "quiz-answers");
    window.QUIZ_STATEMENTS.filter(function (statement) {
      return statement.topic === topic.id;
    }).forEach(function (statement) {
      var item = element("li", null, statement.text + " ");
      item.appendChild(element("strong", null, window.describeAnswer(quizAnswers[statement.id])));
      answers.appendChild(item);
    });
    body.appendChild(answers);
    body.appendChild(renderIssueCandidates(topic, "Where the major parties stand", nationalSources()));
    body.appendChild(renderIssueCandidates(topic, "Illinois U.S. Senate candidates (2026 race)", illinoisSources()));
    details.appendChild(body);
    return details;
  }

  // Repeats the visitor's own answers back as plain lists, strongest first. No labels or interpretation.
  function renderStandFor(container) {
    container.replaceChildren();
    var groups = [
      { heading: "You agreed with", values: [2, 1] },
      { heading: "You disagreed with", values: [-2, -1] }
    ];
    var anyAnswered = false;
    groups.forEach(function (group) {
      var matching = window.QUIZ_STATEMENTS.filter(function (statement) {
        return group.values.indexOf(quizAnswers[statement.id]) !== -1;
      });
      if (matching.length === 0) return;
      anyAnswered = true;
      // Strong answers first, then the rest in the order asked.
      matching.sort(function (a, b) {
        return Math.abs(quizAnswers[b.id]) - Math.abs(quizAnswers[a.id]);
      });
      container.appendChild(element("h3", "issue-heading", group.heading));
      var list = element("ul", "quiz-answers");
      matching.forEach(function (statement) {
        var item = element("li", null, statement.text);
        if (Math.abs(quizAnswers[statement.id]) === 2) {
          item.appendChild(element("strong", null, " (strongly)"));
        }
        list.appendChild(item);
      });
      container.appendChild(list);
    });
    if (!anyAnswered) {
      container.appendChild(element("p", "no-position", "You skipped every statement, so there is nothing to show yet."));
    }
  }

  function showQuizResults() {
    renderStandFor(document.getElementById("quiz-stand"));
    window.renderCompassPlot(document.getElementById("quiz-plot"), window.scoreQuiz(quizAnswers));
    var topicList = document.getElementById("quiz-topic-list");
    topicList.replaceChildren();
    window.POSITION_TOPICS.forEach(function (topic) {
      topicList.appendChild(renderQuizTopic(topic));
    });
    quizScreen.hidden = true;
    quizResultsScreen.hidden = false;
    window.scrollTo(0, 0);
    document.getElementById("quiz-results-heading").focus();
  }

  function showQuiz(fromScreen) {
    quizReturnScreen = fromScreen;
    quizAnswers = {};
    window.renderQuiz(document.getElementById("quiz-body"), quizAnswers, showQuizResults);
    fromScreen.hidden = true;
    quizResultsScreen.hidden = true;
    quizScreen.hidden = false;
    window.scrollTo(0, 0);
  }

  function leaveQuiz() {
    quizScreen.hidden = true;
    quizResultsScreen.hidden = true;
    quizReturnScreen.hidden = false;
    refreshReturnedScreen(quizReturnScreen);
    window.scrollTo(0, 0);
  }

  // options (optional): { filter, issueId, backLabel } when arriving from a Learn issue, so Discover opens
  // on that issue and Back returns to it.
  function showDiscover(fromScreen, options) {
    discoverReturnScreen = fromScreen;
    discoverReturnIssueId = options && options.issueId ? options.issueId : null;
    document.getElementById("discover-back-button").textContent =
      "← Back" + (options && options.backLabel ? " to " + options.backLabel : "");
    window.renderDiscoverScreen({
      filters: document.getElementById("discover-filters"),
      list: document.getElementById("discover-list"),
      status: document.getElementById("discover-status"),
      checked: document.getElementById("discover-checked"),
      message: document.getElementById("discover-message"),
      interests: document.getElementById("discover-interests")
    }, window.NEWS, options && options.filter);
    fromScreen.hidden = true;
    discoverScreen.hidden = false;
    window.revealSelectedFilter(document.getElementById("discover-filters"));
    window.scrollTo(0, 0);
    document.getElementById("discover-heading").focus();
  }

  function leaveDiscover() {
    discoverScreen.hidden = true;
    discoverReturnScreen.hidden = false;
    refreshReturnedScreen(discoverReturnScreen);
    // Interests may have been changed in Discover. Redraw Learn only then, so cards the reader had
    // opened stay open when nothing changed.
    if (discoverReturnScreen === issuesScreen && window.INTERESTS.ids().join() !== renderedInterests) {
      syncIssuePicker();
      renderIssueList();
    }
    var card = discoverReturnIssueId &&
      issueList.querySelector('.issue-card[data-issue="' + discoverReturnIssueId + '"]');
    if (card) {
      card.open = true;
      card.scrollIntoView();
      card.querySelector("summary").focus({ preventScroll: true });
    } else {
      window.scrollTo(0, 0);
    }
  }

  // My ELECTAPP shows the reader's own interests and saved stories, and the first screen summarises them.
  // Those two screens are redrawn whenever they come back into view, so a change made in Discover, Learn,
  // or My ELECTAPP itself is never missing when the reader returns.
  function refreshMyEntry() {
    var interests = window.INTERESTS.ids().length;
    var saved = window.SAVED.count();
    document.getElementById("my-entry-summary").textContent = interests === 0 && saved === 0
      ? "Follow topics and save stories"
      : interests + (interests === 1 ? " interest" : " interests") + " · " + saved + " saved";
  }

  function openDiscoverFromMy(topicId) {
    showDiscover(myScreen, topicId ? { filter: topicId, backLabel: "My ELECTAPP" } : { backLabel: "My ELECTAPP" });
  }

  function openLearnFromMy(topicId) {
    showIssues(myScreen, "national", { openIssueId: topicId, backLabel: "My ELECTAPP" });
  }

  function renderMy() {
    window.renderMyScreen({
      message: document.getElementById("my-message"),
      pills: document.getElementById("my-pills"),
      interestsEmpty: document.getElementById("my-interests-empty"),
      add: document.getElementById("my-add"),
      addDone: document.getElementById("my-add-done"),
      options: document.getElementById("my-options"),
      briefingSection: document.getElementById("my-briefing-section"),
      briefing: document.getElementById("my-briefing"),
      saved: document.getElementById("my-saved"),
      savedLead: document.getElementById("my-saved-lead"),
      savedHeading: document.getElementById("my-saved-heading")
    }, { openDiscover: openDiscoverFromMy, openLearn: openLearnFromMy });
  }

  function refreshReturnedScreen(screen) {
    if (screen === zipScreen) refreshMyEntry();
    else if (screen === myScreen) renderMy();
  }

  function showMy(fromScreen) {
    myReturnScreen = fromScreen;
    renderMy();
    fromScreen.hidden = true;
    myScreen.hidden = false;
    window.scrollTo(0, 0);
    document.getElementById("my-heading").focus();
  }

  function leaveMy() {
    myScreen.hidden = true;
    myReturnScreen.hidden = false;
    refreshReturnedScreen(myReturnScreen);
    window.scrollTo(0, 0);
  }

  function showPractice(fromScreen) {
    practiceReturnScreen = fromScreen;
    window.renderPractice(practiceList);
    fromScreen.hidden = true;
    practiceScreen.hidden = false;
    window.scrollTo(0, 0);
    document.getElementById("practice-heading").focus();
  }

  function leavePractice() {
    practiceScreen.hidden = true;
    practiceReturnScreen.hidden = false;
    refreshReturnedScreen(practiceReturnScreen);
    window.scrollTo(0, 0);
  }

  function leaveIssues() {
    issuesScreen.hidden = true;
    issuesReturnScreen.hidden = false;
    refreshReturnedScreen(issuesReturnScreen);
    window.scrollTo(0, 0);
  }

  function showResultsAgain() {
    compareScreen.hidden = true;
    resultsScreen.hidden = false;
  }

  function showZipScreen() {
    resultsScreen.hidden = true;
    zipScreen.hidden = false;
    refreshMyEntry();
    zipInput.focus();
  }

  zipForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var zip = zipInput.value.trim();
    var result = window.checkZip(zip);
    if (!result.ok) {
      showError(ERROR_MESSAGES[result.reason]);
      zipInput.focus();
      return;
    }
    clearError();
    showResults(zip);
  });

  zipInput.addEventListener("input", clearError);
  backButton.addEventListener("click", showZipScreen);
  document.getElementById("compare-back-button").addEventListener("click", showResultsAgain);
  document.getElementById("profile-back-button").addEventListener("click", leaveProfile);
  document.getElementById("learn-from-zip").addEventListener("click", function () {
    showIssues(zipScreen, "national");
  });
  document.getElementById("learn-from-results").addEventListener("click", function () {
    showIssues(resultsScreen, "national");
  });
  document.getElementById("discover-from-zip").addEventListener("click", function () {
    showDiscover(zipScreen);
  });
  document.getElementById("discover-back-button").addEventListener("click", leaveDiscover);
  document.getElementById("my-from-zip").addEventListener("click", function () {
    showMy(zipScreen);
  });
  document.getElementById("my-back-button").addEventListener("click", leaveMy);
  document.getElementById("illinois-by-issue").addEventListener("click", function () {
    showIssues(resultsScreen, "illinois");
  });
  document.getElementById("issues-back-button").addEventListener("click", leaveIssues);
  document.getElementById("practice-from-zip").addEventListener("click", function () {
    showPractice(zipScreen);
  });
  document.getElementById("practice-from-results").addEventListener("click", function () {
    showPractice(resultsScreen);
  });
  document.getElementById("practice-from-issues").addEventListener("click", function () {
    showPractice(issuesScreen);
  });
  document.getElementById("practice-back-button").addEventListener("click", leavePractice);
  document.getElementById("quiz-from-zip").addEventListener("click", function () {
    showQuiz(zipScreen);
  });
  document.getElementById("quiz-from-issues").addEventListener("click", function () {
    showQuiz(issuesScreen);
  });
  document.getElementById("quiz-back-button").addEventListener("click", leaveQuiz);
  document.getElementById("quiz-results-back-button").addEventListener("click", leaveQuiz);
  document.getElementById("quiz-retake").addEventListener("click", function () {
    showQuiz(quizReturnScreen);
  });
  renderIssuePicker();
  buildIssueViewChips();
  refreshMyEntry();
  document.getElementById("results-heading").setAttribute("tabindex", "-1");
})();
