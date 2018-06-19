const fs = require("fs");
const process = require("process");
const _ = require("lodash");

exports.buildSchema = function(knex ,callback) {
    knex.schema.raw("DROP ALL TABLES").catch(err =>{
        console.log("ERRORE NEL DDL dropping previous tables");
        console.log(err);
    }).then(() =>{
        knex.schema.raw(fs.readFileSync("./db/schema/people.sql").toString()).catch(err => {
            console.log("ERRORE NEL DDL at personale");
            console.log(err);
        }).then(() => {
            knex.schema.raw(fs.readFileSync("./db/schema/locations.sql").toString()).catch(err => {
                console.log("ERRORE NEL DDL at sedi");
                console.log(err);
            }).then(() => {
                knex.schema.raw(fs.readFileSync("./db/schema/services.sql").toString()).catch(err => {
                    console.log("ERRORE NEL DDL at servizi");
                    console.log(err);
                }).then(() => {
                    knex.schema.raw(fs.readFileSync("./db/schema/about.sql").toString()).catch(err => {
                        console.log("ERRORE NEL DDL at chi_siamo");
                        console.log(err);
                    }).then(() => {
                        knex.schema.raw(fs.readFileSync("./db/schema/contacts.sql").toString()).catch(err => {
                            console.log("ERRORE NEL DDL at contattaci");
                            console.log(err);
                        }).then(() => {
                            knex.schema.raw(fs.readFileSync("./db/schema/locations_Services.sql").toString()).catch(err => {
                                console.log("ERRORE NEL DDL at tenuto");
                                console.log(err);
                            }).then(() => {
                                knex.schema.raw(fs.readFileSync("./db/schema/people_services.sql").toString()).catch(err => {
                                    console.log("ERRORE NEL DDL at lavora");
                                    console.log(err);
                                }).then(() => {
                                    knex.schema.raw(fs.readFileSync("./db/schema/manager.sql").toString()).catch(err => {
                                        console.log("ERRORE NEL DDL at responsabile");
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
    });
};
exports.populateDb = function (knex) {

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
            console.log("Errore in fase di inserimento: Personale");
            console.log(err);
        }).then(() => {
            knex("servizi").insert(services).catch(err => {
                console.log("Errore in fase di inserimento: servizi");
                console.log(err);
            }).then(() => {
                knex("tenuto").insert(locations_Services).catch(err => {
                    console.log("Errore in fase di inserimento: location_services");
                    console.log(err)
                }).then(() => {
                    knex("lavora").insert(People_Services).catch(err => {
                        console.log("Errore in fase di inserimento: People_services");
                        console.log(err);
                    }).then(() => {
                        knex("chi_siamo").insert(about).catch(err => {
                            console.log("Errore in fase di inserimento: about");
                            console.log(err);
                        }).then(() => {
                            knex("contattaci").insert(contacts).catch(err => {
                                console.log("Errore in fase di inserimento: contacts");
                                console.log(err);
                            }).then(() => {
                                knex("responsabile").insert(manager).catch(err => {
                                    console.log("Errore in fase di inserimento: responsabile");
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
