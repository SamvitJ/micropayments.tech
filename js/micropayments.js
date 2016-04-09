var isActive = true;

window.onfocus = function() {
  isActive = true;
};

window.onblur = function() {
  isActive = false;
};

var nested = false;

$(document).ready(function() {
    requestInitial();
});

function requestInitial(){
    $.ajax({
        type: "GET",
        url: "http://10.8.220.169:5050/payable",
        crossDomain: true,
        contentType: "text/html; charset=utf-8",
        success: function(resp) {
            console.log("Access granted");
            console.log(resp);
            $(".adsbygoogle").remove();

            /* Start time-rated payments */
            setInterval(function() {
                if (isActive) {
                    console.log("Requesting time-rated endpoint...");
                    requestTimeRated();
                }
                else {
                    console.log("Tab inactive");
                }
            }, 3000);
        },
        error: function(xhr, textStatus, errorThrown) {
            if (xhr.status == 402) {
                console.log("Payment required");
                if (!nested) {
                    nested = true;
                    setTimeout(function() {
                        console.log("Making 2nd request...");
                        requestInitial();
                    }, 500);
                }
                else {
                    setTimeout(function() {
                        console.log("Rerequesting...");
                        requestInitial();
                    }, 5000);
                }
            }
        },
        failure: function(err) {
            console.log("Failed to get data");
            alert(err);
        }
    })
}

function requestTimeRated(){
    $.ajax({
        type: "GET",
        url: "http://10.8.220.169:5050/payable/timerated",
        crossDomain: true,
        contentType: "text/html; charset=utf-8",
        success: function(resp) {
            console.log("Access maintained");
            console.log(resp);
        },
        error: function(xhr, textStatus, errorThrown) {
            if (xhr.status == 402) {
                console.log("Access lost; payment required");
            }
        },
        failure: function(err) {
            console.log("Failed to get data");
            alert(err);
        }
    })
}
