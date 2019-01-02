//load setting
$('#tab-options').find('.form-check-input').prop('checked', false);
options = ["opt_block_seen", "opt_block_typing_chat", "opt_block_typing_comment", "opt_fb_timer", "opt_fb_timer_blocker"];
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