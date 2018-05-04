
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
        }
    });

    $(window).resize(function() {
        /*If browser resized, check width again */
        if (isMobile.any() || $(document).width() < wMobile) {
            $('#subnav').addClass('flex-column');
        }
        else {$('#subnav').removeClass('flex-column');}
    });
