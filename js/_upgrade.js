$("#pagename").text("Upgrade");

//disable
swal("Not available", "We are not selling subscriptions. You can enjoy all features for FREE!", "error");
setTimeout(function() {
    window.location.href = browser.extension.getURL("dashboard.html");
}, 5000);
//end disable

function init() {
    switch (_accountType) {
        case 'FREE':
            $("#plan_free").find("button").attr("disabled", "").text("Active").addClass("btn-outline-white");
            break;
        case 'VIP':
            $("#plan_vip").find("button").attr("disabled", "").text("Active").addClass("btn-outline-warning");
            break;
        case 'J2':
            $("#plan_j2").find("button").attr("disabled", "").text("Active").addClass("btn-outline-rose");
            break;
    }
}

$("#plan_free").find("button").click(function() {
    swal({
        title: 'Okay ;)',
        imageUrl: 'img/whygobackfree.jpg'
    });
})
$("#plan_vip").find("button").click(function() {
    swal("Ooops! Unfortunately...", `VIP subcription is not available for purchase yet`, "info");
});
$("#plan_j2").find("button").click(function() {
    swal({
        title: 'Enter your purchase code',
        html: 'If you are a J2team Community member, you can get a free premium subscription for free (Until 2018/9/2)<br/>Please see the instruction <a href="https://code.hoangvvo.com/facebookutilities/redirect/j2teamfree.html">here</a>.',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Activate',
        showLoaderOnConfirm: true,
        preConfirm: (code) => {
            return fetch(`https://code.hoangvvo.com/facebookutilities/activation.php?uid=${_uid}&code=${code}`)
                .then(response => {
                    if (!response.ok) {
                        swal("An error has occurred", `Error: ${response.statusText}`, "error");
                    }
                    return response.json()
                })
        },
        allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
        if (result.activated) {
            swal({
                title: `Subscription activated!`,
                text: `You have subscribed to ${result.subscription} until ${result.until}`,
                type: "success"
            });
            setTimeout(function() {
                window.location.href = "dashboard.html";
            }, 5000);
        } else {
            swal({
                title: `Activation failed!`,
                text: `Cannot activate your account with the entered code`,
                type: "error"
            })
        }
    })
})