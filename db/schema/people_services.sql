CREATE TABLE lavora(
                                id_personale int REFERENCES personale(id),
                                id_servizio int REFERENCES servizi(id)
                                );