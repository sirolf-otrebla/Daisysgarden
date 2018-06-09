const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlDbFactory = require("knex");
const process = require("process");
let sqlDb;

process.env.TEST = true;

function initSqlDB() {
    /* Locally we should launch the app with TEST=true to use SQLlite:

         > TEST=true node ./index.js

      */
    if (process.env.TEST) {
        sqlDb = sqlDbFactory({
            client: "sqlite3",
            debug: true,
            connection: {
                filename: "./petsdb.sqlite"
            },
            useNullAsDefault: true
        });
    } else {
        sqlDb = sqlDbFactory({
            debug: true,
            client: "pg",
            connection: process.env.DATABASE_URL,
            ssl: true
        });
    }
}

function initDb() {
    return sqlDb.schema.hasTable("pets").then(exists => {
        if (!exists) {
            sqlDb.schema
                .createTable("pets", table => {
                    table.increments();
                    table.string("name");
                    table.integer("born").unsigned();
                    table.enum("tag", ["cat", "dog"]);
                })
                .then(() => {

                    return Promise.all(
                        _.map(petsList, p => {
                            delete p.id;
                            return sqlDb("pets").insert(p);
                        })
                    );
                });
        } else {
            return true;
        }
    });
}

const _ = require("lodash");

let serverPort = process.env.PORT || 5000;

let petsList = require("./petstoredata.json");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// /* Register REST entry point */
// app.use(function(req, res) {
//   res.status(400);
//   res.send({ error: "400", title: "404: File Not Found" });
// });

app.set("port", serverPort);

initSqlDB();
initDb();

/* Start the server on port 3000 */
app.listen(serverPort, function() {
    console.log(`Your app is ready at port ${serverPort}`);
});
