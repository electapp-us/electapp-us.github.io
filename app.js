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
  var pickedIssueIds = [];
  var practiceScreen = document.getElementById("practice-screen");
  var practiceList = document.getElementById("practice-list");
  var practiceReturnScreen = zipScreen;
  var quizScreen = document.getElementById("quiz-screen");
  var quizResultsScreen = document.getElementById("quiz-results-screen");
  var quizReturnScreen = zipScreen;
  var quizAnswers = {};

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

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function renderCandidate(candidate) {
    var item = element("li", "candidate");
    item.appendChild(element("span", "avatar", candidate.name.charAt(0)));

    var details = element("div", "candidate-details");
    details.appendChild(element("span", "candidate-name", candidate.name));
    if (candidate.runningMate) {
      details.appendChild(element("span", "running-mate", "with " + candidate.runningMate));
    }
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

  var ITEM_TYPE_LABELS = {
    says: "Their stated position",
    record: "Record in office",
    reported: "As reported by news",
    platform: "Party platform"
  };

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
    var entry = element("li", "position-item");
    entry.appendChild(element("span", "item-type item-type-" + item.type, ITEM_TYPE_LABELS[item.type]));
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
      "Where each candidate stands, topic by topic. Last checked " + race.positionsCheckedOn + ".";

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
    var summary = element("summary", "topic-summary");
    summary.appendChild(element("span", "topic-label", topic.label));
    summary.appendChild(element("span", "issue-takeaway", guide.summary));
    var current = !illinois && window.CURRENT_DEVELOPMENTS.topics[topic.id];
    if (current) {
      var latest = element("span", "issue-latest");
      latest.appendChild(element("strong", null, "Latest: "));
      latest.appendChild(document.createTextNode(current.latest));
      summary.appendChild(latest);
    }
    summary.appendChild(renderIssueGlance(topic, sources));
    details.appendChild(summary);

    var body = element("div", "issue-body");
    if (current) {
      body.appendChild(renderIssueSection(
        topic,
        "Where things stand now (updated " + window.CURRENT_DEVELOPMENTS.checkedOn + ")",
        renderDevelopments(current)
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
  function renderDevelopments(current) {
    var list = element("ul", "position-list");
    current.items.forEach(function (item) {
      var entry = element("li", "position-item");
      entry.appendChild(element("span", "item-type", item.date));
      entry.appendChild(element("p", "item-text", item.text));
      var link = element("a", "item-source", "Source: " + item.source.label);
      link.href = item.source.url;
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

  // Shows every issue, or only the ones the visitor picked. Picks live in memory only, never saved.
  function renderIssueList() {
    var topics = window.POSITION_TOPICS;
    var picked = topics.filter(function (topic) {
      return pickedIssueIds.indexOf(topic.id) !== -1;
    });
    var shown = picked.length > 0 ? picked : topics;

    issueList.replaceChildren();
    shown.forEach(function (topic) {
      var card = renderIssue(topic);
      if (picked.length > 0) card.open = true;
      issueList.appendChild(card);
    });
    issuePickerStatus.textContent = picked.length > 0
      ? "Showing " + picked.length + " of " + topics.length + " issues. Uncheck them to see all issues."
      : "Showing all " + topics.length + " issues. Check the ones you care about to focus on them.";
  }

  function renderIssuePicker() {
    window.POSITION_TOPICS.forEach(function (topic) {
      var label = element("label", "issue-option");
      var checkbox = element("input");
      checkbox.type = "checkbox";
      checkbox.value = topic.id;
      checkbox.addEventListener("change", function () {
        pickedIssueIds = pickedIssueIds.filter(function (id) { return id !== topic.id; });
        if (checkbox.checked) pickedIssueIds.push(topic.id);
        renderIssueList();
      });
      label.appendChild(checkbox);
      label.appendChild(element("span", null, topic.label));
      issuePickerOptions.appendChild(label);
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

  function showIssues(fromScreen, mode) {
    issuesReturnScreen = fromScreen;
    issuesMode = mode;
    document.getElementById("issues-heading").textContent = ISSUES_SCREEN_TEXT[mode].heading;
    document.getElementById("issues-lead").textContent = ISSUES_SCREEN_TEXT[mode].lead;
    renderIssueList();
    fromScreen.hidden = true;
    issuesScreen.hidden = false;
    window.scrollTo(0, 0);
    document.getElementById("issues-heading").focus();
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
    window.scrollTo(0, 0);
  }

  function leaveIssues() {
    issuesScreen.hidden = true;
    issuesReturnScreen.hidden = false;
    window.scrollTo(0, 0);
  }

  function showResultsAgain() {
    compareScreen.hidden = true;
    resultsScreen.hidden = false;
  }

  function showZipScreen() {
    resultsScreen.hidden = true;
    zipScreen.hidden = false;
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
  document.getElementById("learn-from-zip").addEventListener("click", function () {
    showIssues(zipScreen, "national");
  });
  document.getElementById("learn-from-results").addEventListener("click", function () {
    showIssues(resultsScreen, "national");
  });
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
  document.getElementById("results-heading").setAttribute("tabindex", "-1");
})();
