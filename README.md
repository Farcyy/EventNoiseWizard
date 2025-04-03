# EVENT NOISE WIZARD

Dieses Tool ist ein Prototyp zur Berechnung der zulässigen Mittelungs- und Spitzenpegel bei Open-Air-Veranstaltungen in Berlin basierend auf der Veranstaltungs- und Gebietsausweisung sowie verschiedenen Zuschlägen (z. B. für Impulshaltigkeit, Ton/Informationshaltigkeit und empfindliche Tageszeiten) nach der Veranstaltungslärmverordnung. DIE RICHTIGKEIT DER INFORMATIONEN MUSS NOCH AUSGIEBIG GETESTET WERDEN! 

This prototype calculates the allowed equivalent continuous sound level (LAeq) and peak noise levels for open-air events. It takes into account event type, area classification, and various surcharges (e.g., for impulsiveness, tonal characteristics, and sensitive time periods). THE CORRECTNESS OF THE INFORMATION HAS TO BE VERIFIED! 

### Execution: Download and click "index.html"

### User Input:
	- Veranstaltungstyp (Nicht störend, Wenig störend, Störend)
	- Gebietsausweisung (Industriegebiet, Gewerbegebiet, etc.)
	- Veranstaltungsbeginn und -ende
	- Optionale Zuschläge für Impulshaltigkeit und Ton/Informationshaltigkeit

### Berechnungen / Calculations:
	- Ermittlung des Zuschlags für empfindliche Tageszeiten (k_R)
	- Rückrechnung des erlaubten Mittelungspegels (LAeq)
	- Bestimmung der maximal zulässigen Spitzenpegel
	- Anzeige, ob der Zuschlag für empfindliche Tageszeiten angewendet wurde

# TODO
	- Mehrere Zeitabschnitte (N > 1) berücksichtigen / Veranstaltungen, die sich über Tages/Nachtzeiten hinweg erstrecken
	- Hinausschieben der Beurteilungszeiten / Zeiten mit erhöhter Empfindlichkeit
	- Korrekte Berechnung der Nachtzeiten (**Nachts** wird die volle **lauteste Stunde** zur Beurteilung herangezogen)
	- Meteorologische Korrektur (Cmet) integrieren

