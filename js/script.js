/* script.js */

// Diese Implementierung basiert auf der vereinfachten Annahme,
// dass nur ein einzelner Zeitabschnitt (N=1) betrachtet wird.
// Meteorologische Korrektur (C_met) und k_R (Tageszeiten) werden nicht berücksichtigt.

document.addEventListener('DOMContentLoaded', function() {
  const slider = document.getElementById('slider');
  const sliderValue = document.getElementById('sliderValue');
  slider.addEventListener('input', function() {
      sliderValue.textContent = slider.value;
  });
  
  document.getElementById('calculateButton').addEventListener('click', function() {
      // Eingaben aus dem Formular auslesen
      const veranstaltungstyp = document.getElementById('veranstaltungstyp').value;
      const gebietsausweisung = document.getElementById('gebietsausweisung').value;
      const start = document.getElementById('start').value;
      const ende = document.getElementById('ende').value;
      const laeq = parseFloat(document.getElementById('laeq').value);
      const zuschlagImpulse = document.getElementById('zuschlagImpulse').checked;
      const zuschlagTon = document.getElementById('zuschlagTon').checked;
      const beurteilungszeit = parseFloat(document.getElementById('slider').value);
      
      // Validierung der Datumswerte
      if (!start || !ende) {
          alert("Bitte geben Sie Start- und Endzeit der Veranstaltung an.");
          return;
      }
      const startTime = new Date(start);
      const endTime = new Date(ende);
      if (endTime <= startTime) {
          alert("Das Enddatum muss später als das Startdatum sein.");
          return;
      }
      
      // Berechnung der Veranstaltungsdauer in Stunden
      const durationMs = endTime - startTime;
      const durationHours = durationMs / (1000 * 60 * 60);
      
      // Zuschläge (vereinfachte Werte)
      let k_I = zuschlagImpulse ? 4 : 0;
      let k_T = zuschlagTon ? 3 : 0;
      
      // Für den Prototypen setzen wir C_met = 0 und k_R = 0
      const C_met = 0;
      const k_R = 0;
      
      // Berechnungsgrundlage (vereinfachte Formel):
      // L_r = 10 * log10( (T_j * 10^(0.1*(L_Aeq - C_met + k_T + k_I + k_R))) / T_R )
      // Dabei ist T_j = durationHours und T_R = beurteilungszeit (über den Slider einstellbar)
      const exponent = 0.1 * (laeq - C_met + k_T + k_I + k_R);
      const numerator = durationHours * Math.pow(10, exponent);
      const L_r = 10 * Math.log10(numerator / beurteilungszeit);
      
      // Ausgabe formatieren
      const outputText = `
      Veranstaltungsdauer: ${durationHours.toFixed(2)} Stunden<br>
      Eingestellter Beurteilungszeitraum: ${beurteilungszeit} Stunden<br>
      Berechneter Beurteilungspegel (L<sub>r</sub>): ${L_r.toFixed(2)} dB<br>
      (Berechnung basiert auf einer vereinfachten Formel.)
      `;
      document.getElementById('output').innerHTML = outputText;
  });
});