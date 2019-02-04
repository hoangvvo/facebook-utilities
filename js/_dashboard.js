$("#sidebar-dashboard").addClass("active");
$("#pagename").text("Dashboard");

function init() {
    $("#info_user_pp").attr("src", `https://graph.facebook.com/${_uid}/picture?width=256&height=256`);
    $("#info_user_name").text(_name);
    $("#info_user_id").text(_uid);
}