const fs = require("fs");
const process = require("process");
const _ = require("lodash");

exports.buildSchema = function(knex ,callback) {
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
        console.log("ERRORE NEL DDL at Personale");
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
            " lat varchar(255) ,\n" +
            " lng varchar(255) ,\n" +
            " PRIMARY KEY(id)\n" +
            ");").catch(err => {
            console.log("ERRORE NEL DDL at Sedi");
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
                console.log("ERRORE NEL DDL at Servizi");
                console.log(err);
            }).then(() => {
                knex.schema.raw("CREATE TABLE Chi_Siamo(\n" +
                    " versione int4,\n" +
                    " storia TEXT,\n" +
                    " cosa_facciamo TEXT,\n" +
                    " introduzione TEXT,\n" +
                    " PRIMARY KEY(versione)\n" +
                    ");").catch(err => {
                    console.log("ERRORE NEL DDL at Chi_Siamo");
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
                        console.log("ERRORE NEL DDL at Contattaci");
                        console.log(err);
                    }).then(() => {
                        knex.schema.raw("CREATE TABLE Tenuto(\n" +
                            " id_sede int REFERENCES Sedi(id),\n" +
                            " id_servizio int REFERENCES Servizi(id)\n" +
                            ");").catch(err => {
                            console.log("ERRORE NEL DDL at Tenuto");
                            console.log(err);
                        }).then(() => {
                            knex.schema.raw("CREATE TABLE Lavora(\n" +
                                " id_personale int REFERENCES Personale(id),\n" +
                                " id_servizio int REFERENCES Servizi(id)\n" +
                                " );").catch(err => {
                                console.log("ERRORE NEL DDL at Lavora");
                                console.log(err);
                            }).then(() => {
                                knex.schema.raw("CREATE TABLE Responsabile(\n" +
                                    " id_manager int REFERENCES Personale(id),\n" +
                                    " id_sede int REFERENCES Servizi(id)\n" +
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
