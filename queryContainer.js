
exports.queries = {
    people : {
        all : (knex, res) => {
            knex
                .select("id", "nome", "cognome", "mansione")
                .from("personale")
                .orderBy("cognome", "nome")
                .then(results => {
                    res(results);
                });
        },
        by_id : (knex, id, res) => {
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
        byService : (knex, serviceID, callback) => {

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
        all : (knex, res) => {
            knex
                .select("id", "nome", "immagine")
                .from("servizi")
                .orderBy("nome")
                .then(results => {
                    res(results);
                });

        },
        intro : (knex, argid, res) => {
            knex
                .select("id as serviceId", "nome as serviceName", "intro as serviceIntro", "immagine as serviceImage")
                .from("servizi")
                .where({
                    "serviceId" : argid
                })
                .then(results => {
                    res(results);
                })
        },
        calendar : (knex, argid, res) => {
            knex
                .select("id", "nome", "calendario", "immagine")
                .from("servizi")
                .where({
                    "id" : argid
                })
                .then(results => {
                    res(results);
                })

        },
        when_useful : (knex, argid, callback) => {
            knex
                .select("id", "nome", "quando_utile", "immagine")
                .from("servizi")
                .where({
                    "id" : argid
                })
                .then(results => {
                    callback(results)
                });
        }
        ,
        how_to_access : (knex, argid, callback) => {
            knex
                .select("id", "nome", "come_accedere", "immagine")
                .from("servizi")
                .where({
                    "id" : argid
                })
                .then(results => {
                    callback(results);
                })
        },

        byLocation : (knex, locationID, callback) => {

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

        byPeople : (knex, peopleID, callback) =>{
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
        all : (knex, callback) => {
            knex
                .select("id", "nome", "immagine")
                .from("sedi")
                .orderBy("nome")
                .then(results => {
                    callback(results);
                });

        },
        desc : (knex, argid, callback) => {
            knex
                .select("id", "nome", "descrizione", "immagine")
                .from("sedi")
                .where({
                    "id" : argid
                })
                .then(results => {
                    callback(results);
                });

        },

        map : (knex, argid, callback) => {
            knex
                .select("id", "nome", "indirizzo", "orari", "immagine")
                .from("sedi")
                .where({
                    "id" : argid
                })
                .then(results => {
                    callback(results);
                })
        },

        contacts : (knex, argid, callback) => {
            knex
                .distinct(
                    "sedi.id as locId",
                    "sedi.nome as locName",
                    "sedi.email as locEmail ",
                    "sedi.immagine as image",
                    "personale.nome as managerName",
                    "personale.cognome  as managerSurname",
                    "personale.email as managerEmail")
                .from("sedi")
                .join("responsabile", {"sedi.id" : "id_sede"})
                .join("personale", {"id_manager" : "personale.id"})
                .where({
                    "sedi.id" : argid
                })
                .then(results => {
                    callback(results);
                });

        },
        byService : (knex, serviceID, callback) => {
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

        general : (knex, callback) =>{
            knex
                .select("*")
                .from("contatti")
                .whereRaw("contatti.versione > all")
                .then(callback)
        },

        locations : (knex, callback) => {
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
        history : (knex, callback) => {
            knex
                .select("chi_siamo.versione", "chi_siamo.storia")
                .from("chi_siamo")
                .whereRaw("versione > all")
                .then((results) => {
                    callback(results)
                });
        },

        introduction : (knex, callback) => {
            knex
                .select("chi_siamo.versione", "chi_siamo.introduzione")
                .from("chi_siamo")
                .whereRaw("versione > all")
                .then((results) => {
                    callback(results)
                });

        },

        whatWeDo : (knex, callback) => {
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
