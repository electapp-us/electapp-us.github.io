// The "Where do my views fall?" quiz: asks one statement at a time, scores the answers on two axes,
// and draws the result as a dot on a grid. Answers live in memory only; nothing is saved or sent.
(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var MIN_ANSWERS_PER_AXIS = 3;

  window.QUIZ_CHOICES = [
    { value: 2, label: "Strongly agree" },
    { value: 1, label: "Agree" },
    { value: -1, label: "Disagree" },
    { value: -2, label: "Strongly disagree" }
  ];

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // Average of the answered statements on one axis, from -1 to 1; null if too few were answered.
  function axisScore(answers, axis) {
    var total = 0;
    var count = 0;
    window.QUIZ_STATEMENTS.forEach(function (statement) {
      var answer = answers[statement.id];
      if (statement.axis !== axis || typeof answer !== "number") return;
      total += answer * statement.direction;
      count += 1;
    });
    return count < MIN_ANSWERS_PER_AXIS ? null : total / (2 * count);
  }

  window.scoreQuiz = function (answers) {
    return { x: axisScore(answers, "economic"), y: axisScore(answers, "social") };
  };

  window.describeAnswer = function (value) {
    var match = window.QUIZ_CHOICES.filter(function (choice) { return choice.value === value; })[0];
    return match ? match.label : "Skipped";
  };

  window.renderQuiz = function (container, answers, onFinish) {
    var statements = window.QUIZ_STATEMENTS;

    function showQuestion(index) {
      if (index >= statements.length) {
        onFinish();
        return;
      }
      var statement = statements[index];
      container.replaceChildren();
      container.appendChild(element("p", "practice-progress", "Statement " + (index + 1) + " of " + statements.length));

      var prompt = element("p", "practice-prompt", statement.text);
      prompt.tabIndex = -1;
      container.appendChild(prompt);

      var exampleId = "quiz-example-" + statement.id;
      var exampleToggle = element("button", "example-toggle", "? Show an example");
      exampleToggle.type = "button";
      exampleToggle.setAttribute("aria-expanded", "false");
      exampleToggle.setAttribute("aria-controls", exampleId);
      var exampleText = element("p", "example-text", "For example: " + statement.example);
      exampleText.id = exampleId;
      exampleText.hidden = true;
      exampleToggle.addEventListener("click", function () {
        exampleText.hidden = !exampleText.hidden;
        exampleToggle.setAttribute("aria-expanded", String(!exampleText.hidden));
        exampleToggle.textContent = exampleText.hidden ? "? Show an example" : "? Hide the example";
      });
      container.appendChild(exampleToggle);
      container.appendChild(exampleText);

      var options = element("div", "practice-options");
      window.QUIZ_CHOICES.forEach(function (choice) {
        var button = element("button", "practice-option", choice.label);
        button.type = "button";
        if (answers[statement.id] === choice.value) button.classList.add("is-chosen");
        button.addEventListener("click", function () {
          answers[statement.id] = choice.value;
          showQuestion(index + 1);
        });
        options.appendChild(button);
      });
      var skip = element("button", "practice-option", "Skip this one");
      skip.type = "button";
      skip.addEventListener("click", function () {
        delete answers[statement.id];
        showQuestion(index + 1);
      });
      options.appendChild(skip);
      container.appendChild(options);

      if (index > 0) {
        var previous = element("button", "link-button", "← Previous statement");
        previous.type = "button";
        previous.addEventListener("click", function () { showQuestion(index - 1); });
        container.appendChild(previous);
      }
      prompt.focus();
    }

    showQuestion(0);
  };

  function svgNode(tag, attributes) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attributes).forEach(function (name) { node.setAttribute(name, attributes[name]); });
    return node;
  }

  function svgText(text, attributes) {
    var node = svgNode("text", attributes);
    node.textContent = text;
    return node;
  }

  function describeAxis(score, negativeEnd, positiveEnd) {
    var strength = Math.round(Math.abs(score) * 100);
    if (strength < 5) return "near the middle";
    return strength + "% of the way toward " + (score < 0 ? negativeEnd : positiveEnd);
  }

  window.renderCompassPlot = function (container, score) {
    container.replaceChildren();
    if (score.x === null || score.y === null) {
      container.appendChild(element("p", "no-position",
        "You skipped too many statements to place a dot. Each axis needs at least " +
        MIN_ANSWERS_PER_AXIS + " answers. You can still see your answers by issue below."));
      return;
    }

    var size = 280;
    var left = 20;
    var center = left + size / 2;
    var dotX = center + score.x * (size / 2);
    var dotY = center - score.y * (size / 2);
    var economyText = describeAxis(score.x, "a bigger government role in the economy", "a smaller government role (more free market)");
    var societyText = describeAxis(score.y, "more personal freedom", "more government control over personal choices");

    var svg = svgNode("svg", {
      viewBox: "0 0 320 340",
      role: "img",
      "aria-label": "Grid with your result. Economy: " + economyText + ". Personal life: " + societyText + "."
    });
    svg.setAttribute("class", "compass");
    svg.appendChild(svgNode("rect", { x: left, y: left, width: size, height: size, class: "compass-frame" }));
    svg.appendChild(svgNode("line", { x1: center, y1: left, x2: center, y2: left + size, class: "compass-axis" }));
    svg.appendChild(svgNode("line", { x1: left, y1: center, x2: left + size, y2: center, class: "compass-axis" }));
    svg.appendChild(svgText("More government control", { x: center, y: 13, "text-anchor": "middle", class: "compass-label" }));
    svg.appendChild(svgText("More freedom", { x: center, y: 316, "text-anchor": "middle", class: "compass-label" }));
    svg.appendChild(svgText("Government role", { x: left, y: 334, "text-anchor": "start", class: "compass-label" }));
    svg.appendChild(svgText("Free market", { x: left + size, y: 334, "text-anchor": "end", class: "compass-label" }));
    svg.appendChild(svgNode("circle", { cx: dotX, cy: dotY, r: 9, class: "compass-dot" }));
    container.appendChild(svg);

    var summary = element("ul", "compass-summary");
    summary.appendChild(element("li", null, "Economy (across): " + economyText + "."));
    summary.appendChild(element("li", null, "Personal life (up and down): " + societyText + "."));
    container.appendChild(summary);
  };
})();
