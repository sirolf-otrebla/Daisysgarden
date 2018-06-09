const express = require("express");
const app = express();
const bodyParser = require("body-parser");
sqlDbFactory = require("knex");
const knex = require(" knex");
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

var queries = {
    people : {
        all : (res) => {
            knex
                .select("id", "nome", "cognome", "mansione")
                .from("personale")
                .orderBy("cognome", "nome")
                .then(results => {
                    res.json(results);
                });
      },
        by_id : (id, res) => {
            knex
                .select("id", "nome", "mansione", "descrizione", "immagine","email", "telefono")
                .from("personale")
                .where({
                    id : id
                })
                .then(results => {
                    res.json(results);
                })
        }

    },
    services : {
        all : (res) => {
            knex
                .select("id", "nome", "immagine")
                .from("servizi")
                .orderBy("nome")
                .then(results => {
                    res.json(results);
                });

        },
        intro : (id, res) => {
            knex
                .select("id", "nome", "intro", "immagine")
                .from("servizi")
                .where({
                    id : id
                })
                .then(results => {
                    res.json(results);
                })
        },
        calendar : (id, res) => {
            knex
                .select("id", "nome", "calendario", "immagine")
                .from("servizi")
                .where({
                    id : id
                })
                .then(results => {
                    res.json(results);
                })

        },
        when_useful : (id, res) => {
            knex
                .select("id", "nome", "quando_utile", "immagine")
                .from("servizi")
                .where({
                    id : id
                })
                .then(results => {
                    res.json(results);
                })

        },
        how_to_access : (id, res) => {
            knex
                .select("id", "nome", "come_accedere", "immagine")
                .from("servizi")
                .where({
                    id : id
                })
                .then(results => {
                    res.json(results);
                })
        }

    },
    locations : {
        all : (res) => {
            knex
                .select("id", "nome", "immagine")
                .from("sedi")
                .orderBy("nome")
                .then(results => {
                    res.json(results);
                });

        },
        desc : (id, res) => {
            knex
                .select("id", "nome", "descrizione", "immagine")
                .from("sedi")
                .where({
                    id : id
                })
                .then(results => {
                    res.json(results);
                })

        },

        map : (id, res) => {
            knex
                .select("id", "nome", "indirizzo", "orari", "immagine")
                .from("sedi")
                .where({
                    id : id
                })
                .then(results => {
                    res.json(results);
                })
        },

        contacts : (id, res) => {
            knex
                .select("sedi.id", "sedi.nome", "sedi.email", "sedi.immagine")
                .from("sedi")
                .join("responsabile", {"id" : "id_sede"})
                .join("personale", {"id_manager" : "personale.id"})
                .where({
                    "sedi.id" : "id"

                })
                .then(results => {
                    res.json(results);
                })

        }
    }
};

const _ = require("lodash");

let serverPort = process.env.PORT || 5000;

let petsList = require("./petstoredata.json");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// /* Register REST entry point */
app.get("/api/people", (req, res) => {

});

app.get("/api/people:people_id", (req, res) => {
  function query() {

  }


});
// retrieves location list, as a list of json objects
// containing location name, ID and image
app.get("/api/locations", (req, res) => {

});

// retrieves informations about a specific location. it is possible
// to retrieve only infos which are useful for a certain page: example
//
// https://<domainname>.<toplvldomain>/api/locations/<id>?page=calendar
//
// in this way only informations which are relevant for the selected page
// will be sent back to the client
app.get("/api/locations:location_id", (req, res) => {

});


// retrieves informations about which services are avaiable at location x.
// Example:
//
// https://<domainname>.<toplvldomain>/api/services/locations/<id>
//
// infos are returned as json object containing id, images and names of the
// required services
app.get("/api/services/locations/:location_id", (req, res) => {

});


// retrieves informations about which people deals with service x.
// Example:
//
// https://<domainname>.<toplvldomain>/api/people/services/<id>
//
// infos are returned as json object containing id, images and names of the
// required services
app.get("/api/people/services/:service_id", (req, res) => {

});

// retrieves services by location (location_id)
app.get("/api/locations/services/:service_id", (req, res) => {

});

// retrieves people by service (service_id)
app.get("/api/services/people/:people_id", (req, res) => {

});

// retrieves informations which are needed to display in the 'about' page
app.get("/api/about", (req, res) => {

});

// retrieves informations which are needed to display in the 'contact us' page
app.get("/api/contact-us", (req, res) => {

});
// retrieves service list, as a list of json objects
// containing service name, ID and image
app.get("/api/services", (req, res) => {

});


// retrieves informations about a specific service. it is possible
// to retrieve only infos which are useful for a certain page: example
//
// https://<domainname>.<toplvldomain>/api/services/<id>?page=intro
//
// in this way only informations which are relevant for the selected page
// will be sent back to the client
app.get("/api/services:service_id", (req, res) => {

});


app.delete("/pets/:id", function(req, res) {
  let idn = parseInt(req.params.id);
  sqlDb("pets")
    .where("id", idn)
    .del()
    .then(() => {
      res.status(200);
      res.send({ message: "ok" });
    });
});

app.post("/pets", function(req, res) {
  let toappend = {
    name: req.body.name,
    tag: req.body.tag,
    born: req.body.born
  };
  sqlDb("pets")
    .insert(toappend)
    .then(ids => {
      let id = ids[0];
      res.send(_.merge({ id, toappend }));
    });
});

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
