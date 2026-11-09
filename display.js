// Display options: a color theme (dark, light, high contrast) and an optional dyslexia-friendly font.
// The choice is applied as attributes on <html> (see styles.css) and remembered on this device only.
(function () {
  var STORAGE_KEY = "electapp-display";
  var THEMES = [
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" },
    { value: "contrast", label: "High contrast" }
  ];
  var DYSLEXIA_FONT_CSS = "https://cdn.jsdelivr.net/npm/@fontsource/opendyslexic@5.0.0/index.css";
  var root = document.documentElement;

  function readSaved() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (error) {
      return {};
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      // Storage can be blocked (for example in private windows); the choice just won't be remembered.
    }
  }

  var saved = readSaved();
  var settings = {
    theme: THEMES.some(function (theme) { return theme.value === saved.theme; }) ? saved.theme : "dark",
    dyslexia: saved.dyslexia === true
  };

  // The font file is only requested when someone turns the option on.
  function loadDyslexiaFont() {
    if (document.getElementById("dyslexia-font-css")) return;
    var link = document.createElement("link");
    link.id = "dyslexia-font-css";
    link.rel = "stylesheet";
    link.href = DYSLEXIA_FONT_CSS;
    document.head.appendChild(link);
  }

  function apply() {
    root.setAttribute("data-theme", settings.theme);
    root.setAttribute("data-font", settings.dyslexia ? "dyslexia" : "default");
    if (settings.dyslexia) loadDyslexiaFont();
  }

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function buildControl() {
    var control = element("div", "display-control");

    var toggle = element("button", "display-toggle", "Display options");
    toggle.id = "display-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "display-panel");

    var panel = element("div", "display-panel");
    panel.id = "display-panel";
    panel.hidden = true;

    var colors = element("fieldset", "display-group");
    colors.appendChild(element("legend", null, "Colors"));
    THEMES.forEach(function (theme) {
      var label = element("label", "display-option");
      var radio = element("input");
      radio.type = "radio";
      radio.name = "theme";
      radio.value = theme.value;
      radio.checked = settings.theme === theme.value;
      radio.addEventListener("change", function () {
        settings.theme = theme.value;
        apply();
        save();
      });
      label.appendChild(radio);
      label.appendChild(element("span", null, theme.label));
      colors.appendChild(label);
    });
    panel.appendChild(colors);

    var fontGroup = element("div", "display-group");
    var fontLabel = element("label", "display-option");
    var fontBox = element("input");
    fontBox.type = "checkbox";
    fontBox.id = "dyslexia-font";
    fontBox.checked = settings.dyslexia;
    fontBox.addEventListener("change", function () {
      settings.dyslexia = fontBox.checked;
      apply();
      save();
    });
    fontLabel.appendChild(fontBox);
    fontLabel.appendChild(element("span", null, "Dyslexia-friendly font"));
    fontGroup.appendChild(fontLabel);
    panel.appendChild(fontGroup);

    function setOpen(open) {
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    }

    toggle.addEventListener("click", function () { setOpen(panel.hidden); });
    // A click anywhere outside the button and panel closes the panel.
    document.addEventListener("click", function (event) {
      if (!panel.hidden && !control.contains(event.target)) setOpen(false);
    });
    control.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });

    control.appendChild(toggle);
    control.appendChild(panel);
    document.body.insertBefore(control, document.body.firstChild);
  }

  apply();
  document.addEventListener("DOMContentLoaded", buildControl);
})();
