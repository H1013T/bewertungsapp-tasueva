# Planungsvorlage: ER-Diagramm Bewertungsapp (ausgefüllt)

## Team
| Spaltenname | Datentyp | Constraint |
|---|---|---|
| id | INTEGER | Primärschlüssel, automatisch |
| Name | STRING | not null |
| Klasse | STRING | not null |

## Member
| Spaltenname | Datentyp | Constraint |
|---|---|---|
| id | INTEGER | Primärschlüssel, automatisch |
| teamId | INTEGER | Fremdschlüssel → Team.id |
| Vorname | STRING | not null |
| Nachname | STRING | not null |

## Project
| Spaltenname | Datentyp | Constraint |
|---|---|---|
| id | INTEGER | Primärschlüssel, automatisch |
| teamId | INTEGER | Fremdschlüssel → Team.id |
| Titel | STRING | not null |
| Beschreibung | TEXT | — |
| Präsentiert am | DATE | — |

## Criterion
| Spaltenname | Datentyp | Constraint |
|---|---|---|
| id | INTEGER | Primärschlüssel, automatisch |
| Name | STRING | not null |
| MaxScore | INTEGER | not null |
| Weight | FLOAT | not null |

## Juror
| Spaltenname | Datentyp | Constraint |
|---|---|---|
| id | INTEGER | Primärschlüssel, automatisch |
| Name | STRING | not null |
| Email | STRING | not null, unique |

## Evaluation
| Spaltenname | Datentyp | Constraint |
|---|---|---|
| id | INTEGER | Primärschlüssel, automatisch |
| projectId | INTEGER | Fremdschlüssel → Project.id |
| criterionId | INTEGER | Fremdschlüssel → Criterion.id |
| jurorId | INTEGER | Fremdschlüssel → Juror.id |
| Score | INTEGER | not null |
| Comment | TEXT | — |
| (projectId, criterionId, jurorId) | — | UNIQUE |

## CLI-Befehle (model:generate)

\`\`\`bash
npx sequelize-cli model:generate --name Team --attributes name:string,klasse:string
npx sequelize-cli model:generate --name Member --attributes vorname:string,nachname:string,teamId:integer
npx sequelize-cli model:generate --name Project --attributes titel:string,beschreibung:text,praesentiertAm:date,teamId:integer
npx sequelize-cli model:generate --name Criterion --attributes name:string,maxScore:integer,weight:float
npx sequelize-cli model:generate --name Juror --attributes name:string,email:string
npx sequelize-cli model:generate --name Evaluation --attributes score:integer,comment:text,projectId:integer,criterionId:integer,jurorId:integer
\`\`\`