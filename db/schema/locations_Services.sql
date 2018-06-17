CREATE TABLE tenuto(
                           id_sede int REFERENCES sedi(id),
                           id_servizio int REFERENCES servizi(id)
                            );