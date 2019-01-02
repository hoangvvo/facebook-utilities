$("#sidebar-ppshield").addClass("active");
$("#sidebar-tools").addClass("show");
$("#pagename").text("Profile Picture Guard");

function init() {
    $('#profilepicture').find('img').attr('src', `https://graph.facebook.com/${_uid}/picture?height=320`)
}
$('#shieldup').click(function() {
    swal({
        title: 'Shield up',
        text: `Do you want to activate or deactivate Profile Picture Guard?`,
        type: 'question',
        showCancelButton: true,
        confirmButtonText: 'Activate!',
        cancelButtonText: 'Deactivate!',

    }).then((result) => {
        loadingsth(1);
        browser.runtime.sendMessage({
            do: "shield",
            option: true
        }).then(r => {
            if (!r.error) {
                swal('Shield Activated', 'Your profile picture is now protected', 'success');
                $('#profilepicture').addClass('shielded');
                loadingsth(0);
            } else {
                swal("An error has occurred", `Error: ${r.errorText}`, "error");
                loadingsth(0);
            }
        })
    }, (dismiss) => {
        if (dismiss === 'cancel') {
            loadingsth(1);
            browser.runtime.sendMessage({
                do: "shield",
                option: false
            }).then(r => {
                if (!r.error) {
                    swal('Shield Deactivated', 'Your profile picture is no longer protected', 'success');
                    $('#profilepicture').removeClass('shielded');
                    loadingsth(0);
                } else {
                    swal("An error has occurred", `Error: ${r.errorText}`, "error");
                    loadingsth(0);
                }
            })
        }
    });

})