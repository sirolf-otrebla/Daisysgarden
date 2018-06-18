
exports.queries = {
    people : {
        all : (knex, res) => {
            knex
                .select("id", "nome as name", "cognome as surname", "mansione", "immagine as image")
                .from("personale")
                .orderBy("cognome", "nome")
                .then(results => {
                    res(results);
                });
        },
        by_id : (knex, id, res) => {
            knex
                .select("id", "nome as name", "cognome as surname", "mansione", "descrizione as description", "immagine as image","email as mail", "telefono as tel")
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
                .distinct("servizi.id as id_servizio", "servizi.nome as nome_servizio", "personale.id as id", "personale.nome as name", "personale.cognome as surname", "personale.immagine as image", "personale.mansione as mansione")
                .from("personale")
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
        namelist : (knex, res) => {
            knex
                .distinct("id", "nome as name" )
                .from("servizi")
                .then((results) => {
                    res(results);
                });
        },
        all : (knex, res) => {
            knex
                .select("id", "nome as name", "immagine as image")
                .from("servizi")
                .orderBy("nome")
                .then(results => {
                    res(results);
                });

        },
        intro : (knex, argid, res) => {
            knex
                .select("id", "nome as anem", "intro as description", "immagine as image")
                .from("servizi")
                .where({
                    "id" : argid
                })
                .then(results => {
                    res(results);
                })
        },
        calendar : (knex, argid, res) => {
            knex
                .select("id", "nome as name", "week", "weekend", "immagine as image")
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
                .select("id", "nome as name", "quando_utile as description", "immagine as image")
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
                .select("id", "nome as name", "immagine as image", "servizi.email as mail", "servizi.telefono as tel")
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
                .distinct("servizi.id as id", "servizi.nome as name", "servizi.immagine as image", "sedi.nome as nome_sede", "sedi.id as id_sede" )
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
                .distinct("servizi.id as id", "servizi.nome as name", "servizi.immagine as image", "personale.nome as nome_personale", "personale.cognome as cognome_personale", "personale.id as id_personale")
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
        namelist : (knex, res) => {
            knex
                .distinct("id", "nome as name" )
                .from("sedi")
                .then((results) => {
                    res(results);
                });
        },
        all : (knex, callback) => {
            knex
                .select("id", "nome as name", "immagine as image")
                .from("sedi")
                .orderBy("nome")
                .then(results => {
                    callback(results);
                });

        },
        desc : (knex, argid, callback) => {
            knex
                .select("id", "nome as name", "descrizione as description", "immagine as image")
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
                .select("id", "nome as name", "indirizzo as address", "orari", "immagine as image", "lat", "lng", "giorni as calendar")
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
                    "sedi.id as id",
                    "sedi.nome as name",
                    "sedi.email as mail ",
                    "sedi.immagine as image",
                    "sedi.telefono as tel",
                    "personale.nome as manager_name",
                    "personale.cognome  as manager_surname",
                    "personale.id as manager_id",
                    "personale.email as manager_mail")
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
                .distinct("sedi.id as id", "sedi.nome as name", "sedi.immagine as image", "servizi.nome as nome_servizio", "servizi.id as id_servizio")
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
                .from("contattaci")
                .orderBy("versione", "desc")
                .limit(1)
                .then(callback)
        },

        locations : (knex, callback) => {
            knex
            .distinct(
                "sedi.id as id",
                "sedi.nome as nome_sede",
                "sedi.indirizzo as indirizzo",
                "sedi.email as second_email ",
                "sedi.telefono as telefono",
                "personale.nome as responsabile_nome",
                "personale.cognome  as responsabile_cognome",
                "personale.email as first_email")
                .from("sedi")
                .join("responsabile", {"sedi.id" : "id_sede"})
                .join("personale", {"id_manager" : "personale.id"})
                .then(results => {
                    callback(results);
                });
        }

    },

    about : {
        history : (knex, callback) => {
            knex
                .select("versione", "storia as description")
                .from("chi_siamo")
                .orderBy("versione", "desc")
                .limit(1)
                .then((results) => {
                    callback(results)
                });
        },

        introduction : (knex, callback) => {
            knex
                .select("chi_siamo.versione", "chi_siamo.introduzione as description")
                .from("chi_siamo")
                .orderBy("versione", "desc")
                .limit(1)
                .then((results) => {
                    callback(results)
                });

        },

        whatWeDo : (knex, callback) => {
            knex
                .select("chi_siamo.versione", "chi_siamo.cosa_facciamo as description")
                .from("chi_siamo")
                .orderBy("versione", "desc")
                .limit(1)
                .then((results) => {
                    callback(results)
                });

        }

    }
};
