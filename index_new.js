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
        },
        byService : (serviceID, callback) => {

            knex
                .select("personale.id", "personale.nome", "personale.immagine")
                .from("sedi")
                .join("lavora", {"personale.id" : "id_personale"})
                .join("servizi", {"id_servizio" : "servizi.id"})
                .where({
                    "id_servizio" : serviceID
                })
                .then(results => {
                    callback(results);
                });
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
        when_useful : (id, callback) => {
            knex
                .select("id", "nome", "quando_utile", "immagine")
                .from("servizi")
                .where({
                    id: id
                })
                .then(results => {
                    callback(results)
                });
        }
        ,
        how_to_access : (id, callback) => {
            knex
                .select("id", "nome", "come_accedere", "immagine")
                .from("servizi")
                .where({
                    id : id
                })
                .then(results => {
                    callback(results);
                })
        },

        byLocation : (locationID, res) => {

            knex
                .select("servizi.id", "servizi.nome", "servizi.immagine")
                .from("servizi")
                .join("tenuto", {"servizi.id" : "id_servizio"})
                .join("sedi", {"id_sede" : "sedi.id"})
                .where({
                    "id_sede" : locationID
                })
                .then(results => {
                    callback(results);
                });
        },

        byPeople : (peopleID, callback) =>{
            knex
                .select("servizi.id", "servizi.nome", "servizi.immagine")
                .from("servizi")
                .join("lavora", {"servizi.id" : "id_servizio"})
                .join("personale", {"id_personale" : "personale.id"})
                .where({
                    "id_personale" : peopleID
                })
                .then(results => {
                    callback(results);
                });
        }

    },
    locations : {
        all : (callback) => {
            knex
                .select("id", "nome", "immagine")
                .from("sedi")
                .orderBy("nome")
                .then(results => {
                    callback(results);
                });

        },
        desc : (id, callback) => {
            knex
                .select("id", "nome", "descrizione", "immagine")
                .from("sedi")
                .where({
                    id : id
                })
                .then(results => {
                    callback(results);
                });

        },

        map : (id, callback) => {
            knex
                .select("id", "nome", "indirizzo", "orari", "immagine")
                .from("sedi")
                .where({
                    id : id
                })
                .then(results => {
                    callback(results);
                })
        },

        contacts : (id, callback) => {
            knex
                .select("sedi.id", "sedi.nome", "sedi.email", "sedi.immagine")
                .from("sedi")
                .join("responsabile", {"id" : "id_sede"})
                .join("personale", {"id_manager" : "personale.id"})
                .where({
                    "sedi.id" : "id"

                })
                .then(results => {
                    callback(results);
                });

        },
        byService : (serviceID, res) => {
            knex
                .select("sedi.id", "sedi.nome", "sedi.immagine")
                .from("sedi")
                .join("tenuto", {"sedi.id" : "id_sede"})
                .join("servizi", {"id_servizio" : "servizi.id"})
                .where({
                    "servizi.id" : serviceID
                })
                .then(results => {
                    callback(results);
                });
        },
    },

    contacts : {

        general : (callback) =>{
            knex
                .select("*")
                .from("contatti")
                .whereRaw("contatti.versione > all")
                .then(callback)
        },

        locations : (callback) => {
            knex
            .select("sedi.nome", "sedi.email", "sedi.immagine")
            .from("sedi")
            .join("responsabile", {"id" : "id_sede"})
            .join("personale", {"id_manager" : "personale.id"})
            .then(results => {
                callback(results);
            });

        }

    },

    about : {
        history : (callback) => {
            knex
                .select("chi_siamo.versione", "chi_siamo.storia")
                .from("chi_siamo")
                .whereRaw("versione > all")
                .then((results) => {
                    callback(results)
                });
        },

        introduction : (callback) => {
            knex
                .select("chi_siamo.versione", "chi_siamo.introduzione")
                .from("chi_siamo")
                .whereRaw("versione > all")
                .then((results) => {
                    callback(results)
                });

        },

        whatWeDo : (callback) => {
            knex
                .select("chi_siamo.versione", "chi_siamo.cosa_facciamo")
                .from("chi_siamo")
                .whereRaw("versione > all")
                .then((results) => {
                    callback(results)
                });

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
    queries.people.all((results) => {
        res.json(results);
    })
});

app.get("/api/people:people_id", (req, res) => {
    queries.people.by_id(req.params, (results) => {
        res.json(results)
    })
});

// retrieves location list, as a list of json objects
// containing location name, ID and image
app.get("/api/locations", (req, res) => {
    queries.locations.all((results) => {
        res.json(results);
    })
});

// retrieves informations about a specific location. it is possible
// to retrieve only infos which are useful for a certain page: example
//
// https://<domainname>.<toplvldomain>/api/locations/<id>?page=calendar
//
// in this way only informations which are relevant for the selected page
// will be sent back to the client
app.get("/api/locations:location_id", (req, res) => {

    if(queries.locations[req.query.page])
        queries.locations[req.query.page](req.params, (results) => {
            res.json(results);
        });
});


// retrieves informations about which services are avaiable at location x.
// Example:
//
// https://<domainname>.<toplvldomain>/api/services/locations/<id>
//
// infos are returned as json object containing id, images and names of the
// required services
app.get("/api/services/locations/:location_id", (req, res) => {
        queries.services.byLocation(req.params, (results) => {
            res.json(results);
        });

});


// retrieves informations about which people deals with service x.
// Example:
//
// https://<domainname>.<toplvldomain>/api/people/services/<id>
//
// infos are returned as json object containing id, images and names of the
// required services
app.get("/api/people/services/:service_id", (req, res) => {
    queries.people.byService(req.params, (results) => {
        res.json(results);
    })
});

// retrieves services by location (location_id)
app.get("/api/locations/services/:service_id", (req, res) => {
    queries.locations.byService(req.params, (results) => {
        res.json(results);
    })

});

// retrieves people by service (service_id)
app.get("/api/services/people/:people_id", (req, res) => {
    queries.services.byPeople(req.params, (results) => {
        res.json(results);
    })
});

// retrieves informations which are needed to display in the 'about' page
app.get("/api/about", (req, res) => {
    if(queries.about[req.query.page])
        queries.about[req.query.page](req.params, (results) => {
            res.json(results);
        });
});

// retrieves informations which are needed to display in the 'contact us' page
app.get("/api/contact-us", (req, res) => {
    queries.contacts.general((results) => {
        res.json(results);
    })

});
// retrieves service list, as a list of json objects
// containing service name, ID and image
app.get("/api/services", (req, res) => {
    queries.services.all((results) => {
        res.json(results);
    })
});


// retrieves informations about a specific service. it is possible
// to retrieve only infos which are useful for a certain page: example
//
// https://<domainname>.<toplvldomain>/api/services/<id>?page=intro
//
// in this way only informations which are relevant for the selected page
// will be sent back to the client
app.get("/api/services:service_id", (req, res) => {
    if(queries.services[req.query.page])
        queries.services[req.query.page](req.params, (results) => {
            res.json(results);
        });
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
