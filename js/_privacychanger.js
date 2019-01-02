$("#sidebar-privacychanger").addClass("active");
$("#sidebar-tools").addClass("show");
$("#pagename").text("Privacy changer");

function init() {
    browser.runtime.sendMessage({
        do: "getFriends"
    }).then(r => {
        if (!r.error) {
            r.response.forEach(user => {
                $("#customprivacy_friendslist_table").append(`
                <tr class="table-user" id="${user.id}">
                <th class="text-center">
                    <div class="form-check">
                        <label class="form-check-label">
                            <input class="form-check-input" value="" checked="true" type="checkbox">
                            <span class="form-check-sign">
                            <span class="check"></span>
                            </span>
                        </label>
                    </div>
                </th>
                <th class="text-center"><img src="https://graph.facebook.com/${user.id}/picture?width=40&amp;height=40" class="rounded-circle"></th>
                <th class="text-center" class="table-username">${user.name}</th>
                <th class="text-center" class="table-uid">${user.id}</th>
                </tr>
                `)
            });
            $('#customprivacy_table').DataTable({
                "pagingType": "full_numbers",
                "lengthMenu": [
                    [10, 25, 50, -1],
                    [10, 25, 50, "All"]
                ],
                responsive: true,
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search name",
                }
            });
        } else {
            swal("An error has occurred", `Error: ${r.errorText}`, "error");
        }
    })
};

$('#btn_apply').click(function() {
    privacytext = $('#privacy_picker').val();
    swal({
        title: 'Are you sure?',
        text: `You are about to change every post's privacy to ${privacytext}. You won't be able to revert this!<br/><small>Tip: You should download your current privacy to reset from it later</small>`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Change my privacy!'
    }).then((result) => {
        if (result) {
            loadingsth(1);
            privacy = '';
            switch (privacytext) {
                case "PUBLIC":
                    privacy = '300645083384735';
                    break;
                case "FRIENDS":
                    privacy = '291667064279714';
                    break;
                case "FRIENDS OF FRIENDS":
                    privacy = '275425949243301';
                    break;
                case "ONLY ME":
                    privacy = '286958161406148';
                    break;
                case "Custom":
                    allow = "";
                    deny = "";
                    $('.table-user').each(function() {
                        uid = $(this).attr("id");
                        isAllow = $(this).find(".form-check-input").prop("checked")
                        if (isAllow) {
                            if (allow != "") allow += ",";
                            allow += uid;
                        } else {
                            if (deny != "") deny += ",";
                            deny += uid;
                        }
                    });
                    privacy = (allow.length > 0 ? `{"allow":[${allow}],` : `{"allow":[247124075410460],`) + (deny.length > 0 ? `"deny":[${deny}]}` : `"deny":[""]}`);
                    break;
            }

            browser.runtime.sendMessage({
                do: "setAllPrivacy",
                privacy: privacy
            }).then(r => {
                if (!r.error) {
                    swal("Done!", `All your post's privacy have been set to ${privacytext}`);
                    loadingsth(0);

                } else {
                    swal("An error has occurred", `Error: ${r.errorText}`, "error");
                    loadingsth(0);
                }
            });

        }
    })
})

$('#btn_currentprivacy').click(function() {
    loadingsth(1);
    browser.runtime.sendMessage({
        do: "getCurrentPrivacy"
    }).then(r => {
        if (!r.error) {
            var json = JSON.stringify(r.response);
            var blob = new Blob([json], {
                type: "application/json"
            });
            var url = URL.createObjectURL(blob);
            swal("Get current privacy successfully", `<p>Click the button below to download your current privacy</p><a class="btn btn-rose btn-block" href="${url}" download="privacy.json">Download privacy.json</a>`, "success");
            loadingsth(0);
        } else {
            swal("An error has occurred", `Error: ${r.errorText}`, "error");
            loadingsth(0);
        }
    });

});

$('#btn_customprivacy_allowall').click(function() {
    $('#customprivacy_friendslist_table').find('.form-check-input').prop('checked', true);
})
$('#btn_customprivacy_disallowall').click(function() {
    $('#customprivacy_friendslist_table').find('.form-check-input').prop('checked', false);
})