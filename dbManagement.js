const fs = require("fs");
const process = require("process");
const _ = require("lodash");

exports.buildSchema = function(knex ,callback) {
    knex.schema.raw("CREATE TABLE personale(\n" +
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
        console.log("ERRORE NEL DDL at Personale");
        console.log(err);
    }).then(() => {
        knex.schema.raw("CREATE TABLE sedi(\n" +
            " id int,\n" +
            " nome varchar(255),\n" +
            " immagine varchar(255),\n" +
            " descrizione TEXT,\n" +
            " orari varchar(255),\n" +
            " giorni varchar(255),\n" +
            " telefono varchar(255),\n" +
            " indirizzo varchar(255),\n" +
            " email varchar(255),\n" +
            " lat varchar(255) ,\n" +
            " lng varchar(255) ,\n" +
            " PRIMARY KEY(id)\n" +
            ");").catch(err => {
            console.log("ERRORE NEL DDL at Sedi");
            console.log(err);
        }).then(() => {
            knex.schema.raw("CREATE TABLE servizi(\n" +
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
                console.log("ERRORE NEL DDL at Servizi");
                console.log(err);
            }).then(() => {
                knex.schema.raw("CREATE TABLE chi_siamo(\n" +
                    " versione int4,\n" +
                    " storia TEXT,\n" +
                    " cosa_facciamo TEXT,\n" +
                    " introduzione TEXT,\n" +
                    " PRIMARY KEY(versione)\n" +
                    ");").catch(err => {
                    console.log("ERRORE NEL DDL at Chi_Siamo");
                    console.log(err);
                }).then(() => {
                    knex.schema.raw("CREATE TABLE contattaci(\n" +
                        " versione int4,\n" +
                        " responsabile varchar(255),\n" +
                        " nome varchar(255),\n" +
                        " indirizzo varchar(255),\n" +
                        " telefono varchar(255),\n" +
                        " email varchar(255),\n" +
                        " PRIMARY KEY(versione)\n" +
                        ");").catch(err => {
                        console.log("ERRORE NEL DDL at Contattaci");
                        console.log(err);
                    }).then(() => {
                        knex.schema.raw("CREATE TABLE tenuto(\n" +
                            " id_sede int REFERENCES sedi(id),\n" +
                            " id_servizio int REFERENCES servizi(id)\n" +
                            ");").catch(err => {
                            console.log("ERRORE NEL DDL at Tenuto");
                            console.log(err);
                        }).then(() => {
                            knex.schema.raw("CREATE TABLE lavora(\n" +
                                " id_personale int REFERENCES personale(id),\n" +
                                " id_servizio int REFERENCES servizi(id)\n" +
                                " );").catch(err => {
                                console.log("ERRORE NEL DDL at Lavora");
                                console.log(err);
                            }).then(() => {
                                knex.schema.raw("CREATE TABLE responsabile(\n" +
                                    " id_manager int REFERENCES personale(id),\n" +
                                    " id_sede int REFERENCES servizi(id)\n" +
                                    " );").catch(err => {
                                    console.log("ERRORE NEL DDL at Responsabile");
                                    console.log(err);
                                }).then(() => {
                                        console.log("TUTTO BENE \n \n");
                                        callback(knex);
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
exports.populateDb = function (knex) {

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
    knex("sedi").insert(locations).catch(err => {
        console.log(err);
    }).then(() => {
        knex("personale").insert(people).catch(err => {
            console.log(err);
        }).then(() => {
            knex("servizi").insert(services).catch(err => {
                console.log(err);
            }).then(() => {
                knex("tenuto").insert(locations_Services).catch(err => {
                    console.log(err)
                }).then(() => {
                    knex("lavora").insert(People_Services).catch(err => {
                        console.log(err);
                    }).then(() => {
                        knex("chi_siamo").insert(about).catch(err => {
                            console.log(err);
                        }).then(() => {
                            knex("contattaci").insert(contacts).catch(err => {
                                console.log(err);
                            }).then(() => {
                                knex("responsabile").insert(manager).catch(err => {
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
