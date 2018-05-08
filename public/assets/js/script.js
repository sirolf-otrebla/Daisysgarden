
const wMobile = 600;

var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    $(document).ready( function() {
      console.log("ready");
        /* Check width on page load*/
        if ( isMobile.any() || $(document).width() < wMobile) {
            $('#subnav').addClass('flex-column');
            $('#map_container').addClass('flex-column').addClass('justify-content-center').addClass('align-items-center');
            document.getElementById("map").style.width = "80%";
            document.getElementById("map").style.height= "600px";
        }
    });

    $(window).resize(function() {
        /*If browser resized, check width again */
        if (isMobile.any() || $(document).width() < wMobile) {
            $('#subnav').addClass('flex-column');
            $('#map_container').addClass('flex-column').addClass('justify-content-center').addClass('align-items-center');
            document.getElementById("map").style.width = "80%";
            document.getElementById("map").style.height= "600px";
        }
        else {
            $('#subnav').removeClass('flex-column');
            $('#map_container').removeClass('flex-column').removeClass('justify-content-center').removeClass('align-items-center');
            document.getElementById("map").style.width = "";
            document.getElementById("map").style.height= "";
        }
    });
