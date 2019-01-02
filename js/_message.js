$("#sidebar-message").addClass("active");
$("#sidebar-tools").addClass("show");
$("#pagename").text("Messenger Center");
async function init() {
    browser.runtime.sendMessage({
        do: "msgCount"
    }).then(r => {
        if (!r.error) {
            i = 0;
            r.response.forEach(user => {
                i++;
                $("#msg_result").append(`
                <tr class="table-user" id="${user.id}">
                <td class="text-center"><img src="https://graph.facebook.com/${user.id}/picture?width=40&amp;height=40" class="rounded-circle"></td>
                <td class="text-center" class="table-username">${user.name} <span class="table-blockstatus text-danger">${user.cannot_reply_reason}</span></td>
                <td class="text-center">${user.messages_count}</td>
                <td class="text-center">
                    <button type="button" rel="tooltip" data-block="${user.id};${user.name}" data-placement="left" title="${user.cannot_reply_reason == '' ? "Block message" : "Unblock message"}" class="btn ${user.cannot_reply_reason == '' ? "btn-danger" : ""} btn-just-icon btn-link table-blockmsg">
                        <i class="material-icons">block</i>
                    </button>
                    <button type="button" rel="tooltip" data-chatcolor="${user.id};${user.name}" data-placement="left" title="Change chat color" class="btn btn-just-icon btn-link table-chatcolor">
                        <i class="material-icons">color_lens</i>
                    </button>
                    <button type="button" rel="tooltip" data-downloadmsg="${user.id};${user.name}" data-placement="left" title="Download messages" class="btn btn-success btn-just-icon btn-link table-downloadmsg">
                        <i class="material-icons">get_app</i>
                    </button>
                    
                </td>
                </tr>
                `)
            });
            $('.table-blockmsg').click(function() {
                dt = $(this).attr("data-block").split(';');
                if ($(this).hasClass("btn-danger")) blockMsg(dt[0], dt[1]);
                else unblockMsg(dt[0], dt[1]);
            })
            $('.table-chatcolor').click(function() {
                dt = $(this).attr("data-chatcolor").split(';');
                changeChatColor(dt[0], dt[1]);
            })
            $('.table-downloadmsg').click(function() {
                dt = $(this).attr("data-downloadmsg").split(';');
                downloadMessage(dt[0], dt[1]);
            })
            $('#msg_table').DataTable({
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

            loadingsth(0);
        } else {
            swal("An error has occurred", `Lỗi: ${r.errorText}`, "error");
            loadingsth(0);
        }
    });
}

function blockMsg(uid, name) {
    swal({
        title: 'Are you sure?',
        text: `You are about to block ${name} (${uid}). Don't worry, you can unblock them anytime!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, block them!'
    }).then((result) => {
        if (result) {
            $.ajax({
                async: !1,
                method: "POST",
                url: `https://www.facebook.com/nfx/block_messages/confirm/?thread_fbid=${uid}&action_name=BLOCK_MESSAGES&location=www_chat_head`,
                data: {
                    __user: _uid,
                    fb_dtsg: _dtsg,
                    __a: '1'
                },
                success: resp => {
                    resp = JSON.parse(resp.slice(9));

                    if (resp.error) {
                        swal('An error has occured!', `Unable to block ${name}. Please try again later!`, 'error');
                    } else {
                        swal(
                            'Blocked!',
                            `You have blocked ${name}'s message!`,
                            'success'
                        );
                        $('#' + uid).find(".table-blockstatus").text('BLOCKED');
                        $('#' + uid).find(".table-blockmsg").attr('title', 'Unblock message').removeClass('btn-danger');
                    }
                },
                error: resp => {
                    swal({
                        type: "error",
                        title: "Ooops! ",
                        text: `An error occured! Unable to block ${name}.`
                    })
                }
            })
        }
    })
}

function unblockMsg(uid, name) {
    swal({
        title: 'Are you sure?',
        text: `You are about to unblock ${name} (${uid}). Don't worry, you can block them again anytime!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, unblock them!'
    }).then((result) => {
        if (result) {
            $.ajax({
                async: !1,
                method: "POST",
                url: `https://www.facebook.com/messaging/unblock_messages/`,
                data: {
                    __user: _uid,
                    fb_dtsg: _dtsg,
                    __a: '1',
                    fbid: uid
                },
                success: resp => {
                    resp = JSON.parse(resp.slice(9));
                    if (resp.error) {
                        swal('An error has occured!', `Unable to unblock ${name}. Please try again later!`, 'error');
                    } else {
                        swal(
                            'Unblocked!',
                            `You have unblocked ${name}'s message!`,
                            'success'
                        );
                        $('#' + uid).find(".table-blockstatus").text('');
                        $('#' + uid).find(".table-blockmsg").attr('title', 'Unblock message').addClass('btn-danger');
                    }
                },
                error: resp => {
                    swal({
                        type: "error",
                        title: "Ooops! ",
                        text: `An error occured! Unable to unblock ${name}.`
                    })
                }
            })
        }
    })
}
colorVal = '';

function changeChatColor(uid, name) {
    colorVal = "#4080ff"
    alert(`<p>Customize your chat with ${name}</p>
    <div class="row">
    <div class="col"><div class="msgColorExample" style="background-color: ${colorVal}"><span>This is an example message</span></div></div>
    <div class="col"><div id="cp1" style="display: inline-block"></div></div>
    </div>
    <button id="changeColor" type="button" class="btn btn-primary btn-block">Save changes</button>
    `, "Chat color changer");
    $('#cp1').colorpicker({
        color: colorVal,
        format: "hex",
        container: true,
        inline: true,
        sliders: {
            saturation: {
                maxLeft: 100,
                maxTop: 100
            },
            hue: {
                maxTop: 100
            },
        }
    }).on('changeColor', function(e) {
        colorVal = e.color.toHex();
        $('.msgColorExample').css("backgroundColor", colorVal);
    });
    $('#changeColor').click(function() {
        swal({
            title: 'Are you sure?',
            text: `You are about to change the chat color to <span style="color: ${colorVal}" >${colorVal}</span>!`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Change it!'
        }).then((result) => {
            if (result) {
                $.ajax({
                    async: !1,
                    method: "POST",
                    url: `https://www.facebook.com/messaging/save_thread_color/?source=thread_settings`,
                    data: {
                        __user: _uid,
                        fb_dtsg: _dtsg,
                        __a: '1',
                        color_choice: colorVal,
                        thread_or_other_fbid: uid
                    },
                    success: resp => {
                        resp = JSON.parse(resp.slice(9));
                        /*if(resp.error){
                            swal('An error has occured!',`Unable to change chat color. Please try again later!`,'error');
                        }else{
                            swal(
                                'Success!',
                                `Your chat color has changed to <span style="color: ${colorVal}" >${colorVal}</span>.`,
                                'success'
                                );
                        }*/
                        swal('Not available!', `Facebook has now blocked custom chat color. I am working on a fix!`, 'error');
                    },
                    error: resp => {
                        swal({
                            type: "error",
                            title: "Ooops! ",
                            text: `An error occured! Unable to change color.`
                        })
                    }
                })
            }
        })
    })
}

function downloadMessage(uid, name){
    loadingsth(1);
    browser.runtime.sendMessage({
        do: "msgDown",
        other_uid: uid
    }).then(r => {
        if (!r.error) {
            html = `<html>
                <head>
                    <title>${name}</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
                    <link rel="stylesheet" href="${browser.extension.getURL('css/message-viewer.css')}"
                </head>
                <body>
                    <nav class="navbar navbar-light bg-light fixed-top border-bottom">
                        <a class="mx-auto">${name}</a>
                    </nav>
                    <div class="container-fluid" style="margin-top: 56px;">
                        <div class="row">
                            <div id="message" class="border-left col-sm-8">
                                ${r.response}
                            </div>
                            <div class="border-left col-sm-4">
                                <div class="p-2">
                                    <img class="rounded-circle" src="https://graph.facebook.com/${uid}/picture?width=50&height=50" />
                                    <a target="_blank" href="https://www.facebook.com/${uid}">${name}</a>
                                </div>
                                <div class="p-2 border-top">
                                    <p>Total messages: ${r.msgCount}</p>
                                </div>
                                <div class="p-2 border-top">
                                    <p>Search in conversation by pressing <code>Ctrl+F</code></p>
                                    <p>Download conversation by pressing <code>Ctrl+S</code></p>
                                </div>
                                <div class="p-2 border-top">
                                    <p>Generated on ${r.date} using <a target="_blank" href="https://addons.mozilla.org/en-US/firefox/addon/utilities-for-facebook/">Utilities for Facebook by Hoang Vo</a> ver. ${browser.runtime.getManifest().version}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <script src="${browser.extension.getURL('js/lazyload.min.js')}"></script>
                </body>
            </html>`;
            var blob = new Blob([html], {type: "text/html"});     
            objURL = URL.createObjectURL(blob);
            swal({
                title: "Message download completed!", 
                text: `<a class="btn btn-rose btn-block" href="${objURL}" target="_blank">View messages</a>`,
                type: "success",
                showConfirmButton: false
            })
            loadingsth(0);
        } else {
            swal("An error has occurred", `${r.errorText}`, "error");
            loadingsth(0);
        }
    });
}