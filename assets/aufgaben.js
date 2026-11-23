/*
  Aufgaben mit Sofort-Rückmeldung.

  So wird eine Aufgabe in eine Seite geschrieben:

  <div class="aufgabe" data-loesung="3/4" data-tipp="Kürze mit 2.">
    <p>Kürze 6/8 vollständig.</p>
    <input> <button>Prüfen</button> <span class="rueckmeldung"></span>
  </div>

  - data-loesung: richtige Antwort. Mehrere erlaubte Antworten mit | trennen, z. B. "0,5|1/2".
  - data-tipp (optional): Hinweis, der bei falscher Antwort erscheint.
  Zahlen dürfen mit Komma oder Punkt eingegeben werden; Leerzeichen werden ignoriert.
*/
(function () {
  function normalisiere(s) {
    return String(s).trim().toLowerCase().replace(/\s+/g, "").replace(/,/g, ".");
  }
  function alsZahl(s) {
    var b = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
    if (b) return parseFloat(b[1]) / parseFloat(b[2]);
    return /^-?\d+(\.\d+)?$/.test(s) ? parseFloat(s) : NaN;
  }
  function stimmt(eingabe, loesung) {
    var e = normalisiere(eingabe);
    return loesung.split("|").some(function (l) {
      var n = normalisiere(l);
      if (e === n) return true;
      var a = alsZahl(e), b = alsZahl(n);
      return !isNaN(a) && !isNaN(b) && Math.abs(a - b) < 1e-9;
    });
  }
  document.querySelectorAll(".aufgabe").forEach(function (box) {
    var feld = box.querySelector("input");
    var knopf = box.querySelector("button");
    var ausgabe = box.querySelector(".rueckmeldung");
    if (!feld || !knopf || !ausgabe) return;
    function pruefe() {
      var ok = stimmt(feld.value, box.dataset.loesung || "");
      box.classList.toggle("richtig", ok);
      box.classList.toggle("falsch", !ok);
      ausgabe.textContent = ok ? "Richtig!" : "Noch nicht." + (box.dataset.tipp ? " Tipp: " + box.dataset.tipp : "");
    }
    knopf.addEventListener("click", pruefe);
    feld.addEventListener("keydown", function (e) { if (e.key === "Enter") pruefe(); });
  });
})();
