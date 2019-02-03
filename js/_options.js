var at = "";
$("#pagename").text("Options");
$("#sidebar-options").addClass("active");
function init() {

}
$('#tab-options').find('.form-check-input').prop('checked', false);
options = ["opt_api","opt_collect_usagedata","opt_block_seen", "opt_block_typing_chat", "opt_block_typing_comment", "opt_fb_timer", "opt_fb_timer_blocker"];
browser.storage.local.get(options).then(r => {
    for (e in r) {
        $(`#${e}`).prop('checked', r[e]);
    }
});
optionsNum = ["opt_fb_timer_blocker_value"];
browser.storage.local.get(optionsNum).then(r => {
    for (e in r) {
        $(`#${e}`).val(r[e]);
    }
});
$('#tab-options').find('.form-check-input').click(function() {
    option = $(this).attr('id');
    optionValue = $(this).prop('checked');
    browser.storage.local.set({
        [option]: optionValue
    })
})
$('.form-control').on('input', function() {
    if ($.isNumeric($(this).val())) {
        option = $(this).attr('id');
        optionValue = $(this).val();
        browser.storage.local.set({
            [option]: optionValue
        })
    }
});
$('.btn-reset').click(function(){
    swal({
        title: 'Are you sure?',
        text: `Everything (ex. Settings, Who unfriend me data, ...) will be removed. You won't be able to revert this!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Reset!'
    }).then((result) => {
        if (result) {
            browser.storage.local.clear().then(
                ok => {
                    swal({tiele: 'Done!', text: 'Add-ons data deleted.', type: 'success'});
                    //set default options
                    browser.storage.local.set({
                        opt_collect_usagedata: true,
                        //opt_myapi: true
                    })
                },
                err => {
                    swal({tiele: 'An error has occured!', text: 'Add-ons data was not deleted. Error: '+err, type: 'error'});
                }
            );
            
        }
    })
})
$('.btn-destroytoken').click(function(){
    swal({
        title: 'Are you sure?',
        text: `Disabling API will cause several features to stop working.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Disable and destroy token!'
    }).then((result) => {
        if (result) {
            loadingsth(1);
            browser.runtime.sendMessage({
                do: "showat"
            }).then(async r => {
                if (!r.error) {
                    if (r.response.at != '') {
                    at = r.response.at;
                    return fetch(`https://api.facebook.com/restserver.php?method=auth.expireSession&format=json&access_token=${at}`)
                    .then(response => {
                      if (!response.ok) {
                        throw new Error(response.statusText)
                      }
                      return response.json();
                    }).then((result) => {
                        if (result.error_msg) {
                            swal({
                                title: `The token was not properly destroyed!`,
                                text: result.error_msg,
                                type: 'error'
                            })
                            loadingsth(0);
                        } else {
                            swal({tiele: 'Done!', text: `The token has been invalidated and API has been disabled. The access token was: <br/><code>${at}</code><br/>You can check it using the <a target="_blank" href="attoolkit.html">Access Token Toolkit</a>.`, type: 'success'});
                            $('#opt_api').attr("checked","false");
                            browser.storage.local.set({
                                opt_api: false
                            });
                            loadingsth(0);
                        }
                      })

                    } else {
                        swal("Cannot get access token.", `No access token was obtained.`, "error");
                    }
                    loadingsth(0);
                    init();
                } else {
                    swal("An error has occurred", `Error: ${r.errorText}`, "error");
                    loadingsth(0);
                }
            })
        }
    })
})