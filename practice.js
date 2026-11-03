// Builds the interactive activities on the Practice screen from window.PRACTICE_ACTIVITIES.
// Answers give instant feedback and an explanation; there is no score and nothing is saved.
(function () {
  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function optionLabel(activity, id) {
    return activity.options.filter(function (option) { return option.id === id; })[0].label;
  }

  function renderQuiz(activity) {
    var card = element("section", "practice-card");
    card.appendChild(element("h2", "practice-title", activity.title));
    card.appendChild(element("p", "lead", activity.intro));
    var body = element("div", "practice-body");
    card.appendChild(body);

    function showItem(index) {
      body.replaceChildren();
      if (index >= activity.items.length) {
        body.appendChild(element("p", null, "That's all " + activity.items.length + ". Nothing is scored."));
        var again = element("button", "compare-button", "Go through them again");
        again.type = "button";
        again.addEventListener("click", function () { showItem(0); });
        body.appendChild(again);
        return;
      }

      var item = activity.items[index];
      body.appendChild(element("p", "practice-progress", "Example " + (index + 1) + " of " + activity.items.length));
      body.appendChild(element("p", "practice-prompt", item.prompt));

      var options = element("div", "practice-options");
      var feedback = element("div", "practice-feedback");
      feedback.setAttribute("role", "status");
      var buttons = activity.options.map(function (option) {
        var button = element("button", "practice-option", option.label);
        button.type = "button";
        button.addEventListener("click", function () {
          buttons.forEach(function (other) { other.disabled = true; });
          var correct = option.id === item.answer;
          button.classList.add(correct ? "is-right" : "is-wrong");
          var verdict = correct
            ? "Yes: " + optionLabel(activity, item.answer) + "."
            : "Not quite. This one is: " + optionLabel(activity, item.answer) + ".";
          feedback.appendChild(element("p", "practice-verdict", verdict));
          feedback.appendChild(element("p", null, item.explanation));
          var next = element("button", "compare-button", index + 1 < activity.items.length ? "Next example" : "Finish");
          next.type = "button";
          next.addEventListener("click", function () { showItem(index + 1); });
          feedback.appendChild(next);
          next.focus();
        });
        options.appendChild(button);
        return button;
      });
      body.appendChild(options);
      body.appendChild(feedback);
    }

    showItem(0);
    return card;
  }

  function renderPoke(activity) {
    var card = element("section", "practice-card");
    card.appendChild(element("h2", "practice-title", activity.title));
    card.appendChild(element("p", "lead", activity.intro));
    card.appendChild(element("blockquote", "practice-claim", activity.claim));

    var asked = 0;
    var outro = element("p", "note", "");
    outro.setAttribute("role", "status");
    activity.questions.forEach(function (question) {
      var details = element("details", "practice-question");
      details.appendChild(element("summary", "practice-ask", question.ask));
      details.appendChild(element("p", "practice-why", question.why));
      details.addEventListener("toggle", function () {
        if (details.open && !details.dataset.seen) {
          details.dataset.seen = "yes";
          asked += 1;
          if (asked === activity.questions.length) outro.textContent = activity.outro;
        }
      });
      card.appendChild(details);
    });
    card.appendChild(outro);
    return card;
  }

  window.renderPractice = function (container) {
    var activities = window.PRACTICE_ACTIVITIES;
    container.replaceChildren(
      renderQuiz(activities.whoDecides),
      renderQuiz(activities.wordsOrRecord),
      renderPoke(activities.pokeAtClaim)
    );
  };
})();
