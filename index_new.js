const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
sqlDbFactory = require("knex");
const process = require("process");
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
                filename: "./db/local.sqlite"
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

function buildSchema(callback) {
    knex.schema.raw("CREATE TABLE Personale(\n" +
        " id int,\n" +
        " cognome varchar(255),\n" +
        " nome varchar(255),\n" +
        " immagine varchar(255),\n" +
        " descrizione TEXT,\n" +
        " email varchar(255),\n" +
        " telefono varchar(255),\n" +
        " mansione varchar(255),\n" +
        " PRIMARY KEY(id)\n" +
        " );").catch(err => {
        console.log("ERRORE NEL DDL");
        console.log(err);
    }).then(() => {
        knex.schema.raw("CREATE TABLE Sedi(\n" +
            " id int,\n" +
            " nome varchar(255),\n" +
            " immagine varchar(255),\n" +
            " descrizione TEXT,\n" +
            " orari varchar(255),\n" +
            " giorni varchar(255),\n" +
            " telefono varchar(255),\n" +
            " indirizzo varchar(255),\n" +
            " email varchar(255),\n" +
            " PRIMARY KEY(id)\n" +
            ");").catch(err => {
            console.log("ERRORE NEL DDL");
            console.log(err);
        }).then(() => {
            knex.schema.raw("CREATE TABLE Servizi(\n" +
                " id int4,\n" +
                " nome varchar(255), \n" +
                " immagine varchar(255),\n" +
                " intro TEXT,\n" +
                " quando_utile TEXT,\n" +
                " telefono varchar(255),\n" +
                " email varchar(255),\n" +
                " giorni varchar(255),\n" +
                " orari varchar(255),\n" +
                " PRIMARY KEY(id)\n" +
                ");").catch(err => {
                console.log("ERRORE NEL DDL");
                console.log(err);
            }).then(() => {
                knex.schema.raw("CREATE TABLE Chi_Siamo(\n" +
                    " versione int4,\n" +
                    " storia TEXT,\n" +
                    " cosa_facciamo TEXT,\n" +
                    " introduzione TEXT,\n" +
                    " PRIMARY KEY(versione)\n" +
                    ");").catch(err => {
                    console.log("ERRORE NEL DDL");
                    console.log(err);
                }).then(() => {
                    knex.schema.raw("CREATE TABLE Contattaci(\n" +
                        " versione int4,\n" +
                        " responsabile varchar(255),\n" +
                        " nome varchar(255),\n" +
                        " indirizzo varchar(255),\n" +
                        " telefono varchar(255),\n" +
                        " email varchar(255),\n" +
                        " PRIMARY KEY(versione)\n" +
                        ");").catch(err => {
                        console.log("ERRORE NEL DDL");
                        console.log(err);
                    }).then(() => {
                        knex.schema.raw("CREATE TABLE Tenuto(\n" +
                            " id_sede int REFERENCES Sedi(id),\n" +
                            " id_servizio int REFERENCES Servizi(id)\n" +
                            ");").catch(err => {
                            console.log("ERRORE NEL DDL");
                            console.log(err);
                        }).then(() => {
                            knex.schema.raw("CREATE TABLE Lavora(\n" +
                                " id_personale int REFERENCES Personale(id),\n" +
                                " id_servizio int REFERENCES Servizi(id)\n" +
                                " );").catch(err => {
                                console.log("ERRORE NEL DDL");
                                console.log(err);
                            }).then(() => {
                                knex.schema.raw("CREATE TABLE Responsabile(\n" +
                                    " id_manager int REFERENCES Personale(id),\n" +
                                    " id_sede int REFERENCES Servizi(id)\n" +
                                    " );").catch(err => {
                                    console.log("ERRORE NEL DDL");
                                    console.log(err);
                                }).then(() => {
                                    console.log("TUTTO BENE \n \n");
                                    callback();
                                }
                                );
                            });
                        });
                    });
                });
            });
        });
    });
}
let populateDb = function () {

    let ddl;
    if (process.env.TEST = true){
        ddl = fs.readFileSync("./db/ddl_lite.sql").toString();
    } else {
        ddl = fs.readFileSync("./db/ddl_pg.sql").toString();
    }
    let about = require("./db/about");
    let contacts = require("./db/contacts");
    let locations = require("./db/locations");
    let locations_Services = require("./db/locations_Services");
    let people = require("./db/people");
    let People_Services = require("./db/people_services");
    let services = require("./db/services");
    let manager = require("./db/manager");
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
                    }).then(() => {
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
}


var queries = {
    people : {
        all : (res) => {
            knex
                .select("id", "nome", "cognome", "mansione")
                .from("personale")
                .orderBy("cognome", "nome")
                .then(results => {
                    res(results);
                });
        },
        by_id : (id, res) => {
            knex
                .select("id", "nome", "mansione", "descrizione", "immagine","email", "telefono")
                .from("personale")
                .where({
                    "id" : id
                })
                .then(results => {
                    res(results);
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
                    res(results);
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

app.get("/api/people/:people_id", (req, res) => {
    queries.people.by_id(parseInt(req.params.people_id), (results) => {
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
app.get("/api/locations/:location_id", (req, res) => {

    if(queries.locations[req.query.page])
        queries.locations[req.query.page](parseInt(req.params.location_id), (results) => {
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
        queries.services.byLocation(req.params.location_id, (results) => {
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
    queries.people.byService(parseInt(req.params.service_id), (results) => {
        res.json(results);
    })
});

// retrieves services by location (location_id)
app.get("/api/locations/services/:service_id", (req, res) => {
    queries.locations.byService(parseInt(req.params.service_id), (results) => {
        res.json(results);
    })

});

// retrieves people by service (service_id)
app.get("/api/services/people/:people_id", (req, res) => {
    queries.services.byPeople(parseInt(req.params.people_id), (results) => {
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
app.get("/api/services/:service_id", (req, res) => {
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
buildSchema(populateDb);

/* Start the server on port 3000 */
app.listen(serverPort, function() {
    console.log(`Your app is ready at port ${serverPort}`);
});
