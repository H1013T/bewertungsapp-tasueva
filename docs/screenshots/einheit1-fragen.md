# Einheit 1 – Verständnisfragen

## 1. Was ist der Unterschied zwischen Capacitor und Cordova?

Beide machen im Grunde das Gleiche: Sie packen eine Web App in eine
Hülle, damit man sie als normale App auf dem Handy installieren kann.
Der Unterschied ist, dass Capacitor neuer ist und vom Ionic Team selbst
weiterentwickelt wird. Cordova ist älter und wird kaum noch gepflegt.
Deshalb nimmt man heute eher Capacitor.

## 2. Was macht ein ORM wie Sequelize, und wofür braucht man zusätzlich die sequelize-cli?

Sequelize ist ein sogenanntes ORM. Das heisst ich arbeite im Code mit
JavaScript Objekten und Sequelize macht daraus automatisch die passenden
SQL Befehle. So muss ich nicht ständig SQL von Hand schreiben. Die
sequelize cli brauche ich zusätzlich, um die Datenbank zu verwalten.
Damit kann ich Migrationen ausführen (also Tabellen erstellen oder
ändern), Models anlegen und Testdaten einspielen.

## 3. Was unterscheidet npm install von npx beim Ausführen eines Pakets?

Mit npm install lade ich ein Paket richtig runter. Es landet im
node_modules Ordner und wird in der package.json eingetragen, damit
ich es immer wieder benutzen kann. npx ist eher für einmalige Sachen.
Wenn ich zum Beispiel nur mal kurz sequelize-cli brauche, um eine
Migration auszuführen, dann muss ich es nicht extra installieren,
sondern kann `npx sequelize-cli ...` schreiben. Dann wird es kurz
geladen und direkt ausgeführt.

## 4. Was ist REST, und warum passt das Konzept zu einer Client-Server-Architektur wie Ionic-App und Node-Backend?

REST ist eine Art, wie eine App mit einem Server redet. Der Client
(also die Ionic App) schickt eine Anfrage an eine bestimmte URL und der
Server antwortet mit Daten, meistens als JSON. Dabei benutzt man die
normalen HTTP Methoden: GET zum Holen, POST zum Anlegen, PUT zum Ändern,
DELETE zum Löschen. Das passt gut zu einer Ionic App und einem
Node Backend, weil beide Teile getrennt voneinander arbeiten können.
Die App weiß nur, welche URLs es gibt, und der Server kümmert sich um
die Datenbank.