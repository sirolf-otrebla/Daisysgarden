const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const queryContainer = require("./queryContainer");
const process = require("process");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const log_name = "node_logs";
let knex;
let sqlDbFactory = require("knex");
let dbManagement = require("./dbManagement");
let queries = queryContainer.queries;
let descriptor = fs.openSync(log_name, "w");
const TEST = false;
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

// retrieves a list of all people working at Daisy's Garden
//
// usage:
//
// https://<domainname>.<toplvldomain>/api/people
//
//  for more information see README.md
//
app.get("/api/people", (req, res) => {
    queries.people.all(knex, (results) => {
        res.json(results);
    })
});

// retrieves info about a single person
//
// usage:
//
// https://<domainname>.<toplvldomain>/api/people/<id>
//
//    for more information see README.md
//
app.get("/api/people/:people_id", (req, res) => {
    queries.people.by_id(knex, parseInt(req.params.people_id), (results) => {
        res.json(results)
    })
});

// retrieves location list, as a list of json objects
// containing location name, ID and image
//
// usage:
//
// https://<domainname>.<toplvldomain>/api/locations
//
//    for more information see README.md
//
app.get("/api/locations", (req, res) => {
    queries.locations.all(knex, (results) => {
        res.json(results);
    })
});

/*
    retrieves a list containing only location names and id

    usage:

    // https://<domainname>.<toplvldomain>/api/locations/namelist

    for more information see README.md
 */
app.get("/api/locations/namelist", (req, res) => {
    queries.locations.namelist(knex, (results) => {
        res.json(results);
    })
});

// retrieves informations about a specific location. it is possible
// to retrieve only infos which are useful for a certain page: example
//
// https://<domainname>.<toplvldomain>/api/locations/<id>?page=<pagename>
//
// for more informations see README.md
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
// for more information see README.md
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
// for more information see README.md
app.get("/api/people/services/:service_id", (req, res) => {
    queries.people.byService(knex, parseInt(req.params.service_id), (results) => {
        res.json(results);
    })
});

// retrieves locations by service (service_id)
// https://<domainname>.<toplvldomain>/api/locatiions/services/<id>
//
// for more information see README.md
app.get("/api/locations/services/:service_id", (req, res) => {
    queries.locations.byService(knex, parseInt(req.params.service_id), (results) => {
        res.json(results);
    })

});

// retrieves services by person (people_id)
//
// usage:
//
// https://<domainname>.<toplvldomain>/api/people/people/<people_id>
//
// for more information see README.md
app.get("/api/services/people/:people_id", (req, res) => {
    queries.services.byPeople(knex, parseInt(req.params.people_id), (results) => {
        res.json(results);
    })
});

// retrieves informations which are needed to display in the 'about' page
//
// usage:
//
// https://<domainname>.<toplvldomain>/api/about
//
// for more information see README.md
app.get("/api/about", (req, res) => {
    if (queries.about[req.query.page])
        queries.about[req.query.page](knex, (results) => {
            res.json(results);
        });
});

// retrieves informations which are needed to display in the 'contact us' page
//
// usage:
//
// https://<domainname>.<toplvldomain>/api/contact-us
//
// for more information see README.md
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
//
// usage:
//
// https://<domainname>.<toplvldomain>/api/people/services/
//
// for more information see README.md
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

// retrieves footer dynamic content
//
// usage:
//
// https://<domainname>.<toplvldomain>/api/footer
//
// for more information see README.md
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

// takes message to be sent and send it to our email and also to the sender of the message
//
// usage:
//
// post request to https://<domainname>.<toplvldomain>/api/email/info
//
app.post("/api/email/info", function (req, res) {
    var message = req.body.message;
    var email = req.body.mail;

    // Validation takes place on server side too
    var ok = false;
    // Send Email
    let mailOptions = {
        from: email, // sender address
        to: "noreplay.dgarden@gmail.com", // list of receivers
        bcc: email,
        subject: 'Info Email', // Subject line
        text: 'Grazie per averci contattato\nQuesto è il testo del suo messaggio\n\n' + message, // plain text body
        html: '<h2>Grazie per averci contattato</h2><br>' +
        '<b>Questo è il testo da lei inviato</b><br><br>' + message// html body
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("ERRORE!");
            console.log(error);
            ok = false;
            res.json({"status": "Error"});
            return;
        } else {
            ok = true;
            console.log("OK!");
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
