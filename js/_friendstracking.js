/*
"friendsTracking_{uid}_friendList": array,
"friendsTracking_{uid}_lastcheck": year/month/day,
"friendsTracking_{uid}_log": [
    {
        date: year/month/day,
        change: boolean,
        result: result
    },
]
*/
$("#sidebar-friendstracking").addClass("active");
$("#sidebar-tools").addClass("show");
$("#pagename").text("Who unfriend me");
friendlog_storage = null
friendlog = null;
lastcheck = null;
async function init() {
    friendlog_storage = 'friendsTracking_' + _uid + '_log';
    friendlog_lastcheck = 'friendsTracking_' + _uid + '_lastcheck';
    $('#lastchecklist').text("");
    await browser.storage.local.get(friendlog_storage).then(r => {
        friendlog = r[friendlog_storage];
    });

    if (typeof friendlog != "undefined" && friendlog.length != 0) {
        friendlog.reverse();
        $('#lastchecktext').text(`Last check: ${dateformat(friendlog[0].date)} ${friendlog[0].type == 0 ? '' : '(Auto)'}`);
        $('#lastchecklist').html('');
        for (i in friendlog) {
            if (friendlog[i].change)
            $('#lastchecklist').append(`<li data-logId="${i}" class="list-group-item">${dateformat(friendlog[0].date)} ${friendlog[0].type == 0 ? '' : '(Auto)'} : ${friendlog[i].result.gone.length} unfriend(s) and ${friendlog[i].result.new.length} befriend(s) <button class="btn btn-rose btn-link btn-viewlogresult">View result</button></li>`); 
        } 
        $('.btn-viewlogresult').click(function() {
            logid = parseInt($(this).parent().attr('data-logId'));
            displayresult(friendlog[logid].result)
        })
    } else $('#lastchecklist').html('<span class="text-center">You have not started any check.</span>');
}
function dateformat(x){
    d = new Date(x);
    y = d.getFullYear();
    mo = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1,
    da = d.getDate() < 10 ? "0" + (d.getDate()) : d.getDate(),
    h = d.getHours() < 10 ? "0" + (d.getHours()) : d.getHours(),
    m = d.getMinutes() + 1 < 10 ? "0" + (d.getMinutes() + 1) : d.getMinutes() + 1,
    s = d.getSeconds() + 1 < 10 ? "0" + (d.getSeconds() + 1) : d.getSeconds() + 1;
    return `${y}/${mo}/${da} ${h}:${m}:${s}`;
}
function displayresult(r) {
    $('#listbefriend').html('');
    $('#listunfriend').html('');
    for (i in r.new) {
        $('#listbefriend').append(`<a class="list-group-item">
        <img src="https://graph.facebook.com/${r.new[i].uid}/picture?width=40&amp;height=40" class="rounded-circle">
        ${r.new[i].name}</a>`);
    }
    for (i in r.gone) {
        $('#listunfriend').append(`<a class="list-group-item">
        <img src="https://graph.facebook.com/${r.gone[i].uid}/picture?width=40&amp;height=40" class="rounded-circle">
        ${r.gone[i].name}</a>`);
    }

}
$('#btn_check').click(function() {
    loadingsth(1);
    browser.runtime.sendMessage({
        do: "checkUnfriend"
    }).then(async r => {
        if (!r.error) {

            if (r.response.new.length + r.response.gone.length == 0) {
                swal("Check completed!", `No one has unfriended nor befriended with you since the last time you checked`)
            } else {
                displayresult(r.response);
                swal("Check completed!", `You may view the result below`, 'success');
            }
            loadingsth(0);
            init();
        } else {
            swal("An error has occurred", `Error: ${r.errorText}`, "error");
            loadingsth(0);
        }
    })
});