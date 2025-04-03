/* script.js */

// Diese Implementierung berücksichtigt:
// - Ein fester Beurteilungszeitraum (T_R): 16 Stunden bei Tagesveranstaltungen (06:00–22:00) und 8 Stunden bei Nacht (22:00–06:00).
// - Falls eine Tagesveranstaltung nur ca. 8 Stunden dauert (T_E ≈ 8h), wird ein +3 dB-Zuschlag fällig.
// - Zuschläge für Impuls- und Ton/Informationshaltigkeit (4 bzw. 3 dB) werden als feste Werte addiert.
// - Zuschlag für empfindliche Tageszeiten (K_R, 6 dB) wird anhand des Veranstaltungsbeginns und der Gebietsausweisung (bei betroffenen Bereichen) ermittelt.

document.addEventListener('DOMContentLoaded', function() {
    
  // Tabelle der Immissionsrichtwerte (Tageswerte) nach Gebietsausweisung und Veranstaltungstyp
  const immissionsrichtwerte = {
      'industrie': { 'nicht': 70, 'wenig': 70, 'stoerend': 70 },
      'gewerbe': { 'nicht': 65, 'wenig': 70, 'stoerend': 70 },
      'kern': { 'nicht': 60, 'wenig': 65, 'stoerend': 70 },
      'allgemein': { 'nicht': 55, 'wenig': 60, 'stoerend': 70 },
      'rein': { 'nicht': 50, 'wenig': 55, 'stoerend': 70 },
      'kur': { 'nicht': 45, 'wenig': 50, 'stoerend': 70 }
  };

  document.getElementById('calculateButton').addEventListener('click', function() {
      // Eingaben aus dem Formular
      const veranstaltungstyp = document.getElementById('veranstaltungstyp').value;
      const gebietsausweisung = document.getElementById('gebietsausweisung').value;
      const start = document.getElementById('start').value;
      const ende = document.getElementById('ende').value;
      const zuschlagImpulse = document.getElementById('zuschlagImpulse').checked;
      const zuschlagTon = document.getElementById('zuschlagTon').checked;
      
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
      
      // Berechnung der Veranstaltungsdauer in Stunden (T_E)
      const durationMs = endTime - startTime;
      const durationHours = durationMs / (1000 * 60 * 60);
      
      // Zuschläge für Impulshaltigkeit und Ton/Informationshaltigkeit
      const k_I = zuschlagImpulse ? 4 : 0;
      const k_T = zuschlagTon ? 3 : 0;
      
      // Zuschlag für empfindliche Tageszeiten (K_R) anhand des Veranstaltungsbeginns
      const k_R = calculateKR(startTime, gebietsausweisung);
      
      // Bestimme, ob es sich um eine Tages- oder Nachtveranstaltung handelt (Annahme: Bestimmung anhand des Veranstaltungsbeginns)
      let T_R; // Gesetzlich festgelegter Beurteilungszeitraum
      const startHour = startTime.getHours() + startTime.getMinutes() / 60;
      if (startHour >= 6 && startHour < 22) {
          T_R = 16;  // Tageszeit
      } else {
          T_R = 8;   // Nachtzeit
      }
      
      // Zuschlag für verkürzte Beurteilungszeit bei Tagesveranstaltungen:
      // Falls T_R = 16 h, aber die tatsächliche Einwirkzeit (T_E) ca. 8 h beträgt, addiere +3 dB.
      let durationSurcharge = 0;
      if (T_R === 16 && Math.abs(durationHours - 8) < 0.5) { // Toleranz von 0.5 h
          durationSurcharge = 3;
      }
      
      // Aus der Tabelle abgeleiteter zulässiger Gesamtpegel (L_r_allowed) – je nach Veranstaltungstyp und Gebietsausweisung
      const L_r_allowed = immissionsrichtwerte[gebietsausweisung][veranstaltungstyp];
      
      // Berechnung des erlaubten Mittelungspegels (L_Aeq_allowed)
      // Ausgangsformel: L_r = L_Aeq + (k_T + k_I + k_R + durationSurcharge) + 10*log10(T_E/T_R)
      // Umgestellt: L_Aeq_allowed = L_r_allowed - (k_T + k_I + k_R + durationSurcharge) - 10*log10(T_E/T_R)
      const adjustment = 10 * Math.log10(durationHours / T_R);
      const LAeq_allowed = L_r_allowed - (k_T + k_I + k_R + durationSurcharge) - adjustment;
      
      // Bestimmung der erlaubten Spitzenwerte anhand des Veranstaltungstyps
      let spitzenAdd;
      if (veranstaltungstyp === "nicht") spitzenAdd = 30;
      else if (veranstaltungstyp === "wenig") spitzenAdd = 25;
      else if (veranstaltungstyp === "stoerend") spitzenAdd = 20;
      const Spitzen_allowed = LAeq_allowed + spitzenAdd;
      
      // Visuelles Feedback zum Zuschlag für empfindliche Tageszeiten (K_R)
      let krFeedback = "";
      if (k_R > 0) {
          krFeedback = `<p class="feedback">Zuschlag für empfindliche Tageszeiten wurde angewendet: ${k_R} dB<br>(Sensibler Zeitraum erkannt.)</p>`;
      } else {
          krFeedback = `<p>Zuschlag für empfindliche Tageszeiten: 0 dB (kein sensibler Zeitraum erkannt).</p>`;
      }
      
      // Visuelles Feedback zum Zuschlag für verkürzte Einwirkzeit
      let durationFeedback = "";
      if (durationSurcharge > 0) {
          durationFeedback = `<p class="feedback">Verkürzte Beurteilungszeit erkannt (T_E = ${durationHours.toFixed(2)} h). +${durationSurcharge} dB Zuschlag angewendet.</p>`;
      } else {
          durationFeedback = `<p>Beurteilungszeit entspricht den Vorgaben.</p>`;
      }
      
      // Ausgabe formatieren
      const outputText = `
      Veranstaltungsdauer (T<sub>E</sub>): ${durationHours.toFixed(2)} Stunden<br>
      Gesetzlicher Beurteilungszeitraum (T<sub>R</sub>): ${T_R} Stunden<br><br>
      <strong>Berechnungsgrundlagen:</strong><br>
      Immissionsrichtwert (L<sub>r</sub>) laut Tabelle: ${L_r_allowed} dB<br>
      Zuschlag Ton/Informationshaltigkeit (k_T): ${k_T} dB<br>
      Zuschlag Impulshaltigkeit (k_I): ${k_I} dB<br>
      ${krFeedback}
      ${durationFeedback}<br>
      <strong>Erlaubte Messwerte:</strong><br>
      Erlaubter Mittelungspegel (L<sub>Aeq</sub>): ${LAeq_allowed.toFixed(2)} dB<br>
      Erlaubte Spitzen: ${Spitzen_allowed.toFixed(2)} dB<br>
      (Berechnung basiert auf vereinfachten Annahmen.)
      `;
      document.getElementById('output').innerHTML = outputText;
  });
  
  // Funktion zur Berechnung des Zuschlags für empfindliche Tageszeiten (K_R)
  // Wird nur berücksichtigt, wenn die Gebietsausweisung zu den betroffenen Bereichen gehört.
  function calculateKR(startDate, gebietsausweisung) {
      // Betroffene Gebiete: allgemeine Wohngebiete, reine Wohngebiete, Kurgebiete, ggf. weitere
      const betroffeneGebiete = ['allgemein', 'rein', 'kur'];
      if (!betroffeneGebiete.includes(gebietsausweisung)) {
          return 0;
      }
      var day = startDate.getDay(); // 0 = Sonntag, 6 = Samstag
      var sensitivePeriods = [];
      if (day === 0 || day === 6) {
          // Wochenende / Sonn- und Feiertage
          sensitivePeriods.push({start: 6, end: 9});
          sensitivePeriods.push({start: 13, end: 15});
          sensitivePeriods.push({start: 20, end: 22});
      } else {
          // Werktage
          sensitivePeriods.push({start: 6, end: 7});
          sensitivePeriods.push({start: 20, end: 22});
      }
      var startHour = startDate.getHours() + startDate.getMinutes() / 60;
      for (var i = 0; i < sensitivePeriods.length; i++) {
          if (startHour >= sensitivePeriods[i].start && startHour < sensitivePeriods[i].end) {
              return 6;
          }
      }
      return 0;
  }
});