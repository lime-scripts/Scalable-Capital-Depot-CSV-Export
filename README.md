# Scalable Capital: Export der Depotbestände als CSV-Datei

Tampermonkey Userscript, das u.a. den Download des aktuellen Depotbestands bei Scalable Capital als CSV-Datei ermöglicht.

Features:
- Download des aktuellen Depots als CSV-Datei
- Guthaben in die Zwischenablage kopieren

## Anleitung
- Tampermonkey Browser-Addon installieren: https://www.tampermonkey.net/
- Das Userscript "Scalable Capital Depot Export-user.js" installieren
- Die Depot-Ansicht in Scalable Capital öffnen. Über Rechtsklick sollte jetzt ein Menüpunkt "Tampermonkey" mit Untermenüpunkt "Scalable Capital Depot" -> "Export Depot CSV" erscheinen.

## Hinweise / Workarounds
- Bei einer hohen Anzahl an Positionen im Depot kann es zu Problemen beim Export kommen. In diesem Fall könnte die Anlage von Portfolio-Gruppen helfen.

## Release Notes
- Version 0.3.1:  Fix: Feature "Guthaben kopieren".
- Version 0.3:    Feature "Guthaben kopieren" hinzugefügt.
- Version 0.2:    Der aktuelle Preis wird in der CSV-Datei mit exportiert.
