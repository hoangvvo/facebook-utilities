$("#sidebar-dashboard").addClass("active");
$("#pagename").text("Dashboard");

function init() {
    $("#info_user_pp").attr("src", `https://graph.facebook.com/${_uid}/picture?width=256&height=256`);
    $("#info_user_name").text(_name);
    $("#info_user_id").text(_uid);
    switch (_accountType) {
        case '': 
            $("#info_user_type").text("FREE");
            break;
        case 'FREE':
            $("#info_user_type").text("FREE");
            break;
        case 'VIP':
            $("#info_user_type").text("VIP");
            break;
        case 'J2':
            $("#info_user_type").text("J2TEAM MEMBER");
            break;
    }
    $("#info_user_until").text(_accountUntil || "FOREVER");
}