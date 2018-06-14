const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
sqlDbFactory = require("knex");
const process = require("process");
const sqlite = require("sqlite3n");
let knex = sqlDbFactory;

process.env.TEST = true;
function defineSQLenv() {
    /* Locally we should launch the app with TEST=true to use SQLlite:

         > TEST=true node ./index.js

      */
    if (process.env.TEST) {
        knex = sqlDbFactory({
            client: "sqlite3",
            debug: true,
            connection: {
                filename: "./petsdb.sqlite"
            },
            useNullAsDefault: true
        });
    } else {
        knex = sqlDbFactory({
            debug: true,
            client: "pg",
            connection: process.env.DATABASE_URL,
            ssl: true
        });
    }
}

function populateDb() {

    let ddl = fs.readFileSync("./db/ddl.sql").toString();
    knex.schema.raw(ddl);
    let about = require("./db/about.json");
    let contacts = require("./db/contacts");
    let locations = require("./db/locations");
    let locations_Services = require("./db/locations_Services");
    let people = require("./db/people");
    let People_Services = require("./db/People_Services");
    let services = require("./db/services");
    let manager = require("./db/manager");
    knex.select("doctors.*").from("doctors").catch(err => {
        knex.raw(ddl).catch(err => {
            console.log("ERRORE NEL DDL");
            console.log(err);
        }).then(() => {
            knex("Sedi").insert(locations).catch(err => {
                console.log(err);
            }).then(() => {
                knex("Personale").insert(people).catch(err => {
                    console.log(err);
                }).then(() => {
                    knex("servizi").insert(services).catch(err => {
                        console.log(err);
                    }).then(() => {
                        knex("Tenuto").insert(locations_Services).catch(err => {
                            console.log(err)
                                .then(() => {
                                    knex("Lavora").insert(People_Services).catch(err => {
                                        console.log(err);
                                    }).then(() => {
                                            knex("Chi_Siamo").insert(about).catch(err => {
                                                console.log(err);
                                            }).then(() => {
                                                knex("Contattaci").insert(contacts).catch(err => {
                                                    console.log(err);
                                                }).then(() => {
                                                    knex("Responsabile").insert(manager).catch(err => {
                                                        console.log(err);
                                                    })
                                                });
                                            });
                                        });
                                    });
                                })
                        });
                    });
                });
            });
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

// app.use(function(req, res) {
//   res.status(400);
//   res.send({ error: "400", title: "404: File Not Found" });
// });

app.set("port", serverPort);

defineSQLenv();
populateDb();

/* Start the server on port 3000 */
app.listen(serverPort, function() {
    console.log(`Your app is ready at port ${serverPort}`);
});
