CREATE TABLE responsabile(
                                    id_manager int REFERENCES personale(id),
                                    id_sede int REFERENCES servizi(id)
                                    );