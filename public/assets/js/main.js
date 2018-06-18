var toOutput = "";
var iterator = 1;
var iterator2 = 1;

/* needed for footer dynamic population */
var FOOTER_API = "footer";

populatefooter = (data, callback) => {
    let footerLocList = '';
    let footerServList = '';
    data.loc.map((loc) => {
        footerLocList += '<li><a href="/pages/single_locations_base/single_location_intro_db.html?' + loc.id + '"><i class="fa fa-angle-double-right"></i>' + loc.name + '</a></li>';
    });
    data.serv.map((serv) => {
        footerServList += '<li><a href="/pages/single_services_base/service_intro_db.html?' + serv.id + '"><i class="fa fa-angle-double-right"></i>' + serv.name + '</a></li>';
    });
    callback(footerLocList, footerServList);
};
/* ----------------- NAV JS -----------------*/

$(document).ready(function () {
    $('#nav-menu').click(function () {
        $('#nav-menu').toggleClass('open');
        $('.nav-resp').toggleClass('open');
    });
    if (typeof init === "function") {
        init();
    }
    //This variable must been set on the html page to call the APIs
    if (apiCall != null) {
        show(apiCall);
    }
});

/* ----------------- API -----------------*/
function show(what, callback) {
    var levels = what.split("/");
    var level1 = levels[0];
    var level2 = levels[1];
    var parameters = window.location.search.substr(1);
    var test = true;
    var source = "http://polimi-hyp-2018-team-10508999.herokuapp.com/api/";

    //console.log(what);

    if (test) {
        source = 'http://localhost:5000/api/';
    }
    if (apiCall != "") {
        fetch(source + what)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                //toOutput += '<div class="row form-group">';
                if (specialPage) {
                    specialResponseHandling(data);
                }
                else {
                    data.map(format);
                    toOutput += '</div>';
                    $("#list").append(toOutput);
                }
            });
    }

    fetch(source + FOOTER_API).then((res) => {
        return res.json()
    }).then((data) => {
        populatefooter(data, (locList, servList) => {
            $("#footer-location-list").append(locList);
            $("#footer-services-list").append(servList)
        });
    })
}


let infoForm = $("#info-form");  // Form reference

$(document).ready(function () {
    infoForm.on('submit', validateForm);

});


// Form Validation
function validateForm(e) {
    e.preventDefault();

    let email = $("#mail");
    let message = $("#text");

    console.log("/api/email/info?type=0&message=\"" + message.val() + "\"&email=" + email.val());

    fetch("/api/email/info?&message=" + message.val() + "&email=" + email.val())
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            if (data.status == "OK") {
                alert("Messaggio Inviato correttamente, riceverai una risposta a breve!");
                document.getElementById("mail").value = '';
                document.getElementById("text").value = '';
            }
            else {
                alert("Si è verificato un'errore... Riprova...");
            }
        });

}