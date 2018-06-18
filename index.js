const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const queryContainer = require("./queryContainer");
const process = require("process");
const _ = require("lodash");
const nodemailer = require("nodemailer");
let knex;
let sqlDbFactory = require("knex");
let dbManagement = require("./dbManagement");
let queries = queryContainer.queries;
const TEST = true;
const SETUP = false;

const transporter = nodemailer.createTransport({ // Setup Account
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'noreply.dgarden@gmail.com',
        pass: 'f7a-zfW-h5k-3uz'
    }
});


function defineSQLenv(callback) {
    /* Locally we should launch the app with TEST=true to use SQLlite:

         > TEST=false node ./index_old.js

      */
    if (TEST) {
        knex = sqlDbFactory({
            client: "sqlite3",
            debug: true,
            connection: {
                filename: "./db/local.sqlite"
            },
            useNullAsDefault: true
        });
        console.log("sqlite");
    } else {
        knex = sqlDbFactory({
            client: 'pg',
            connection: {
                host: "ec2-54-217-208-52.eu-west-1.compute.amazonaws.com",
                port: 5432,
                user: "rgkjhqjtzhvwnl",
                password: "257c70c47b1ee548403c64350f0225d17cc2c448fd1ea6d21a5f050cf88f9bf2",
                database: "d9a5bn3kr4f5vm",
                multipleStatements: true,
                ssl: true
            }
        });
        console.log("postgre");
    }
    callback();
}

defineSQLenv(() => {
    if (SETUP)
        dbManagement.buildSchema(knex, dbManagement.populateDb);
});

let serverPort = process.env.PORT || 5000;
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// /* Register REST entry point */
app.get("/api/people", (req, res) => {
    queries.people.all(knex, (results) => {
        res.json(results);
    })
});

app.get("/api/people/:people_id", (req, res) => {
    queries.people.by_id(knex, parseInt(req.params.people_id), (results) => {
        res.json(results)
    })
});

// retrieves location list, as a list of json objects
// containing location name, ID and image
app.get("/api/locations", (req, res) => {
    queries.locations.all(knex, (results) => {
        res.json(results);
    })
});

app.get("/api/locations/namelist", (req, res) => {
    queries.locations.namelist(knex, (results) => {
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

    if (queries.locations[req.query.page])
        queries.locations[req.query.page](knex, parseInt(req.params.location_id), (results) => {
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
    queries.services.byLocation(knex, parseInt(req.params.location_id), (results) => {
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
    queries.people.byService(knex, parseInt(req.params.service_id), (results) => {
        res.json(results);
    })
});

// retrieves services by location (location_id)
app.get("/api/locations/services/:service_id", (req, res) => {
    queries.locations.byService(knex, parseInt(req.params.service_id), (results) => {
        res.json(results);
    })

});

// retrieves people by service (service_id)
app.get("/api/services/people/:people_id", (req, res) => {
    queries.services.byPeople(knex, parseInt(req.params.people_id), (results) => {
        res.json(results);
    })
});

// retrieves informations which are needed to display in the 'about' page
app.get("/api/about", (req, res) => {
    if (queries.about[req.query.page])
        queries.about[req.query.page](knex, (results) => {
            res.json(results);
        });
});

// retrieves informations which are needed to display in the 'contact us' page
app.get("/api/contact-us", (req, res) => {
    queries.contacts.general(knex, (results) => {
        let tobeSentBack = {
            general: results,
        };
        queries.contacts.locations(knex, (results) => {
            tobeSentBack.locations = results;
            res.json(tobeSentBack);
        });
    })

});

// retrieves service list, as a list of json objects
// containing service name, ID and image
app.get("/api/services", (req, res) => {
    queries.services.all(knex, (results) => {
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
    if (queries.services[req.query.page])
        queries.services[req.query.page](knex, parseInt(req.params.service_id), (results) => {
            res.json(results);
        });
});

// app.use(function(req, res) {
//   res.status(400);
//   res.send({ error: "400", title: "404: File Not Found" });
// });

app.get("/api/footer", (req, res) => {
    let responseJson = {};
    queries.locations.namelist(knex, (result) => {
        responseJson.loc = result;
        queries.services.namelist(knex, (result) => {
            responseJson.serv = result;
            res.json(responseJson);
        })
    })
})

app.get("/api/email/info", function (req, res) {
    var message = req.query.message;
    var email = req.query.email;

    // Validation takes place on server side too
    var ok = false;
    // Send Email
    let mailOptions = {
        from: 'noreply@dgarden.com', // sender address
        to: email, // list of receivers
        subject: 'Info Email', // Subject line
        text: 'Grazie per averci contattato\nQuesto è il testo del suo messaggio\n\n' + message, // plain text body
        html: '<h2>Grazie per averci contattato</h2><br>' +
        '<b>Questo è il testo da lei inviato</b><br><br>' + message// html body
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("ERROREEE!!!!!!!!!!!!!!!!!!!");
            console.log(error);
            ok = false;
            res.json({"status": "Error"});
            return;
        } else {
            ok = true;
            console.log("OOOOOOOOOOK!!!!!!!!!!!!!!!!!!!");
            console.log(info);
            res.json({"status": "OK"});
        }
    });
});


app.set("port", serverPort);
/* Start the server on port 3000 */
app.listen(serverPort, function () {
    console.log(`Your app is ready at port ${serverPort}`);
});
