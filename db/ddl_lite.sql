CREATE TABLE Personale(
 id int,
 cognome varchar(255),
 nome varchar(255),
 immagine varchar(255),
 descrizione TEXT,
 email varchar(255),
 telefono varchar(255),
 mansione varchar(255)
 );
CREATE TABLE Sedi(
 id int,
 nome varchar(255),
 immagine varchar(255),
 descrizione TEXT,
 orari varchar(255),
 giorni varchar(255),
 telefono varchar(255),
 indirizzo varchar(255),
 first_email varchar(255),
 second_email varchar(255),
 responsabile varchar(255),
 lat varchar(255),
 long varchar(255)
 );
CREATE TABLE Servizi(
 id int,
 immagine varchar(255),
 intro TEXT,
 quando_utile TEXT,
 telefono varchar(255),
 email varchar(255),
 giorni varchar(255),
 orari varchar(255)
 );

CREATE TABLE Chi_Siamo(
 versione int,
 storia TEXT,
 cosa_facciamo TEXT,
 introduzione TEXT
 );
CREATE TABLE Contattaci(
 versione int,
 responsabile varchar(255),
 nome varchar(255),
 indirizzo varchar(255),
 telefono varchar(255),
 first_email varchar(255),
 second_email varchar(255)
 );
CREATE TABLE News(
 id int,
 immagine varchar(255),
 contenuto TEXT
 );
CREATE TABLE Eventi(
 id int,
 immagine varchar(255),
 contenuto TEXT
 );
CREATE TABLE Faq(
 id int,
 domanda varchar(255),
 risposta TEXT
 );
CREATE TABLE Tenuto(
 id_sede int REFERENCES Sedi(id),
 id_servizio int REFERENCES Servizi(id)
);
CREATE TABLE Lavora(
 id_personale int REFERENCES Personale(id),
 id_servizio int REFERENCES Servizi(id)
 );
CREATE TABLE Responsabile(
 id_manager int REFERENCES Personale(id),
 id_sede int REFERENCES Servizi(id)
 );