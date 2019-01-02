$("#sidebar-securitychecker").addClass("active");
$("#sidebar-tools").addClass("show");
$("#pagename").text("Security checker");
function init() {
}
$('#btn_scan').click(function(){
    swal('Not available!','This feature is not yet available. You can try my security checkup tool','info')
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
$("#noexpireatexplain").click(function(){
    swal("What is never expire access token?",'<p class="text-left">Access tokens are strings that can be used to access your account. This is also the one that I use to authenticate your account. <br/><br/>However, other malicious extensions and scripts can take advantages of this one to steal your account. <br/><br/>Deactivate it immediately if you notice unusual behaviors (Unauthorized posting, messaging, ..). <br/><br/> And remember, <span class="text-danger">NEVER SHARE THIS ONE WITH OTHERS</span>. Recommended: <a href="https://www.facebook.com/selfxss">Self-XSS</a>, <a href="https://www.facebook.com/help/524275404355719">Access Token theft</a>.</p>')
})