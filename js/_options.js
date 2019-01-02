$("#pagename").text("Options");
$("#sidebar-options").addClass("active");

function init() {

}
$('#tab-options').find('.form-check-input').prop('checked', false);
options = ["opt_myapi","opt_collect_usagedata","opt_block_seen", "opt_block_typing_chat", "opt_block_typing_comment", "opt_fb_timer", "opt_fb_timer_blocker"];
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