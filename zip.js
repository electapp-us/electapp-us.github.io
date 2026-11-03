// Zip code checking. Illinois zip codes begin with 600 through 629.
(function (global) {
  var ILLINOIS_PREFIX_MIN = 600;
  var ILLINOIS_PREFIX_MAX = 629;

  // Returns { ok: true, state: "IL" } or { ok: false, reason: "format" | "outside-illinois" }.
  function checkZip(rawInput) {
    var zip = String(rawInput || "").trim();
    if (!/^\d{5}$/.test(zip)) {
      return { ok: false, reason: "format" };
    }
    var prefix = Number(zip.slice(0, 3));
    if (prefix < ILLINOIS_PREFIX_MIN || prefix > ILLINOIS_PREFIX_MAX) {
      return { ok: false, reason: "outside-illinois" };
    }
    return { ok: true, state: "IL" };
  }

  global.checkZip = checkZip;
})(window);
