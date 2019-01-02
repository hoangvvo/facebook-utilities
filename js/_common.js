//global var
_uid = ""; //uid
_accountType = 0; //vip
_accountUntil = '';
_name = ""; //name
_dtsg = ""; //dtsg
//notification
_notificationCount = 0;
//google analytics
browser.storage.local.get("opt_collect_usagedata").then(r => {
    if (r.opt_collect_usagedata == true) {
        var _gaq = _gaq || [];
        var _AnalyticsCode = 'UA-121691344-2';
        _gaq.push(['_setAccount', _AnalyticsCode]);
        _gaq.push(['_trackPageview']);

        (function() {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = 'https://ssl.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
          })();
    }
})

//common function
function addNotification(message, time, link) {
    _notificationCount++;
    $("#navbarNotificationList").append(
        `<a class="dropdown-item">${message} <small>(${time})</small></a>`
    )
    $("#navbarNotificationCount").text(_notificationCount);
}

function alert(a, b, c, d) {
    id = "modal-" + Math.floor(1E3 * Math.random());
    a = '<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title">' + (void 0 === b ? "Th\u00f4ng b\u00e1o" : b) + '</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body">' + a + "</div>";
    "undefined" != typeof c && (a += '<div class="modal-footer"> <a type="button" href="' +
        d + '" class="btn btn-primary">' + c + "</a> </div>");
    a += "</div></div></div>";
    $("body").append(a);
    $("#" + id).modal();
    $("#" + id).on("hidden.bs.modal", function(a) {
        $(this).remove()
    })
};

function loadingsth(t) {
    if (t) {
        $('.main-panel').addClass('loadingsth');
    } else {
        $('.main-panel').removeClass('loadingsth');
    }
}
//load component
$.ajax({
    url: "include/sidebar.html",
    async: !1,
    success: resp => $("#sidebar").html(resp),
});
$.ajax({
    url: "include/navbar.html",
    async: !1,
    success: resp => $("#navbar").html(resp),
});

$('.main-panel').append('<div class="lds-ripple"><div></div><div></div></div>');
loadingsth(1);
//get user data
browser.runtime.sendMessage({
    do: "getUser"
}).then(r => {
    if (!r.error) {
        if (r.response.connected) {
            _dtsg = r.response.dtsg;
            _uid = r.response.uid;
            _name = r.response.name;
            _accountType = r.response.accountType;
            _accountUntil = r.response.accountUntil;
            $(document).ready(function() {
                $('#username').text(_name);
                $("#userid").text(_uid);
                $("#userpp").attr("src", `https://graph.facebook.com/${_uid}/picture`);
                switch (_accountType) {
                    case '': 
                        $("#accounttype").text("FREE");
                        break;
                    case 'FREE':
                        $("#accounttype").text("FREE");
                        break;
                    case 'VIP':
                        $("#accounttype").text("VIP");
                        $("#accounttype").addClass("vip");
                        break;
                    case 'J2':
                        $("#accounttype").text("J2");
                        $("#accounttype").addClass("j2");
                        break;
                }
                init();
                loadingsth(0);
            })
        } else {
            swal("Cannot connect to Facebook", "Please log in Facebook to continue!", "error");
            setTimeout(function() {
                window.location.href = "https://www.facebook.com/login";
            }, 5000);
        }
    } else {
        swal("An error has occurred", `Error: ${r.errorText}`, "error");
    }
})
//get notification 
/*
fetch(`https://code.hoangvvo.com/facebookutilities/notification.php`).then(r => {
    return r.json()
}).then(r => {
    for (i in r) {
        addNotification(r[i].message, r[i].time);
    }
})*/