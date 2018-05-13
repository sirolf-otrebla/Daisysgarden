
let newsMap = new Map();
let newsPreviewManagement = function () {
    let news = document.getElementsByClassName("container list-content");
    var arr = Array.prototype.slice.call( news );
    arr.forEach( (a) => {
        newsMap.set(a, a.textContent)}
        )
};


const wNoNewsText = 1025; /* 1st crusade starting year *_* */
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
    newsPreviewManagement();
    console.log("ready");

    /* Check width on page load*/
    if ($(document).width() < wNoNewsText){
        newsMap.forEach((v, k, m) =>{
            k.textContent = '';
        })
    } else {
        newsMap.forEach((v, k, m) =>{
            k.style.display = "block";
        })
    }
});

$(window).resize(function() {
    /*If browser resized, check width again */
    if (isMobile.any() || $(document).width() < wNoNewsText){
        newsMap.forEach((v, k, m) =>{
            k.textContent = '';
        })
    }
    if ($(document).width() > wNoNewsText){
        newsMap.forEach((v, k, m) =>{
            if(k.style.display == "none"){
                k.style.display = "block";
            }
            k.textContent = v;
        })
    }
});
