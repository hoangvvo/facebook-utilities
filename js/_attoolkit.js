$("#sidebar-attoolkit").addClass("active");
$("#sidebar-tools").addClass("show");
$("#pagename").text("Access Token Toolkit");
function init() {
}
$("#getat").click(function(){
    loadingsth(1);
    browser.runtime.sendMessage({
        do: "showat"
    }).then(async r => {
        if (!r.error) {
            if (r.response.at != '') {
            $("#at").text(r.response.at);
            $("#getat").attr("disabled", "true");
            } else {
                swal("Cannot get access token.", `Did you enable Use API options? <a href="options.html">Enable it</a>`, "error");
            }
            loadingsth(0);
            init();
        } else {
            swal("An error has occurred", `Error: ${r.errorText}`, "error");
            loadingsth(0);
        }
    })
})
$("#logoutall").click(function(){
    swal({
        title: 'Are you sure?',
        text: `You are about to log out all sessions.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Log out now!'
    }).then((result) => {
        if (result) {
            $.ajax({
                async: !1,
                method: "POST",
                url: "https://www.facebook.com/security/settings/sessions/log_out_all/?dpr=1.5",
                data: {
                    __user: _uid,
                    fb_dtsg: _dtsg,
                    __a: '1'
                },
                success: resp => {
                    resp = JSON.parse(resp.slice(9));
                    if (resp.error) {
                        swal('An error has occured!', `Unable to log out. Please try again later!`, 'error');
                    } else {
                        swal(
                            'Logged out!',
                            `You are logged out all other sessions except this one!`,
                            'success'
                        );
                    }


                },
                error: resp => {
                    swal({
                        type: "error",
                        title: "Ooops! ",
                        text: `An error has occured! Unable to unfriend ${name}.`
                    })
                }
            })
        }
    })
})
$("#atdeactivate").click(function(){
    swal({
        title: 'Access token Invalidator',
        text: `Enter the access token you want to deactivate.`,
        input: 'text',
        showCancelButton: false,
        confirmButtonText: 'Deactivate',
        showLoaderOnConfirm: true,
        preConfirm: (at) => {
          return fetch(`https://api.facebook.com/restserver.php?method=auth.expireSession&format=json&access_token=${at}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(response.statusText)
              }
              return response.json();
            })
        }
      }).then((result) => {
        if (result.error_msg) {
            swal({
                title: `Request failed`,
                text: result.error_msg,
                type: 'error'
              })  
        } else {
              swal({
                title: `Request succeeded`,
                text: `Access token deactivated!`,
                type: 'success'
              })
        }
      })
      
})
$("#atgetlogin").click(function(){
    swal({
        title: 'Login with Facebook',
        html:
        'Email: <input id="at-login" class="swal2-input">' +
        'Password: <input type="password" id="at-psw" class="swal2-input">',
        showCancelButton: false,
        confirmButtonText: 'Login with Facebook',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            return browser.runtime.sendMessage({
                do: "getloginwithpass",login: $('#at-login').val(), psw: $('#at-psw').val()
            })
        }
      }).then((r) => {
        if (!r.error) {
            swal("Login successfully!",`<p>You may use to token below to <a href="options.html">login</a> this application.</p><code class="at-loginat">${r.response.at}</code>`)
        } else {
            swal("An error has occurred", `Error: ${r.errorText}`, "error");
            loadingsth(0);
        }
      })
})