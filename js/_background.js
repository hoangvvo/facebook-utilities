// install
browser.runtime.onInstalled.addListener(function(t) {
    var o = t.reason.toLowerCase();
    switch (o) {
        case "install":
            browser.notifications.create({
                type: "basic",
                title: "Welcome!",
                message: "Thanks for installing my add-ons!",
                iconUrl: "/icon/96.png"
            });
            browser.tabs.create({
                url: (browser.extension.getURL("/page/welcome.html?reason=install"))
            });
            break;
        case "update":
            browser.notifications.create({
                type: "basic",
                title: "Add-on updated!",
                message: "You have installed the lastest version of this add-on!",
                iconUrl: "/icon/96.png"
            });
            browser.tabs.create({
                url: (browser.extension.getURL("/page/welcome.html?reason=update"))
            });
            break;
    }
})
//origin
browser.webRequest.onBeforeSendHeaders.addListener(function(e) {
    e.requestHeaders.forEach(function(header) {
        if (header.name.toLowerCase() == "origin" || header.name.toLowerCase() == "referer") {
            header.value = "https://www.facebook.com";
        }
    });
    return {
        requestHeaders: e.requestHeaders
    };
}, {
    urls: ["https://*.facebook.com/*"],
    types: ["xmlhttprequest"]
}, ["blocking", "requestHeaders"]);

//block request
//typing comment
browser.webRequest.onBeforeRequest.addListener(async function() {
    optionValue = await browser.storage.local.get('opt_block_typing_comment').then(r => {
        return r.opt_block_typing_comment || false
    });
    return {
        cancel: optionValue
    }
}, {
    urls: ["https://*.facebook.com/ufi/typing/*"],
    types: ["xmlhttprequest"]
}, ["blocking"]);
//typing chat
browser.webRequest.onBeforeRequest.addListener(async function() {
    optionValue = await browser.storage.local.get('opt_block_typing_chat').then(r => {
        return r.opt_block_typing_chat || false
    });
    return {
        cancel: optionValue
    }
}, {
    urls: ["https://*.facebook.com/ajax/messaging/typ.php*", "https://*.messenger.com/ajax/messaging/typ.php*"],
    types: ["xmlhttprequest"]
}, ["blocking"]);
//seen chat
browser.webRequest.onBeforeRequest.addListener(async function() {

    optionValue = await browser.storage.local.get('opt_block_seen').then(r => {
        return r.opt_block_seen || false
    });
    return {
        cancel: optionValue
    }
}, {
    urls: ["https://*.facebook.com/ajax/mercury/change_read_status.php*", "https://*.messenger.com/ajax/mercury/change_read_status.php*", "https://*.facebook.com/ajax/mercury/delivery_receipts.php*", "https://*.messenger.com/ajax/mercury/delivery_receipts.php*"],
    types: ["xmlhttprequest"]
}, ["blocking"]);
//Addons API


//global
let sendResponse;
uid = '';
at = '';
dtsg = '';
//init 
//misc function
function handleErrors(response) {
    if (!response.ok) {
        stillok = 0;
        sendResponse({
            error: true,
            errorText: response.statusText
        });
    }
    return response;
}
//common function
function get_friends() {
    return fetch(`https://graph.facebook.com/${uid}/friends?limit=5000&access_token=${at}`).then(handleErrors).then(r => r.json()).then(json => {
        return json.data;
    });
}
async function do_getfriend() {
    let stillok = true;
    let fl = await get_friends();
    if (!stillok) return false;
    sendResponse({
        error: false,
        response: fl
    });
}
//initialize

//get user + access token
async function do_getuser() {
    let name = '';
    at = '';
    dtsg = '';
    let accountType = 0;
    let accountUntil = '';
    let stillok = true;
    pr = await browser.cookies.get({
        name: "c_user",
        url: "https://www.facebook.com"
    });
    if (pr == null) {
        sendResponse({
            error: false,
            response: {
                connected: false
            }
        });
        stillok = 0;
    }
    uid = pr.value;
    if (!stillok) return false;
    //get access token
    r = await fetch(`https://www.facebook.com/${uid}`, {
        credentials: "include"
    }).then(handleErrors);
    if (!stillok) return false;
    e = await r.text();
    dtsg = e.match(/\["DTSGInitialData",\[\],\{"token"\:"(.*?)"\},/i)[1];
   
    var b = new FormData();
    b.append('fb_dtsg', dtsg);
    b.append('app_id', '165907476854626');
    b.append('redirect_uri', 'fbconnect://success');
    b.append('display', 'popup');
    b.append('access_token', '');
    b.append('sdk', '');
    b.append('from_post', '1');
    b.append('private', '');
    b.append('tos', '');
    b.append('login', '');
    b.append('read', '');
    b.append('write', '');
    b.append('extended', '');
    b.append('social_confirm', '');
    b.append('confirm', '');
    b.append('seen_scopes', '');
    b.append('auth_type', '');
    b.append('auth_token', '');
    b.append('default_audience', '');
    b.append('ref', 'Default');
    b.append('return_format', 'access_token');
    b.append('domain', '');
    b.append('sso_device', 'ios');
    b.append('__CONFIRM__', '1');
    r = await fetch(`https://www.facebook.com/v1.0/dialog/oauth/confirm`, {
        credentials: "include",
        method: "POST",
        body: b
    }).then(handleErrors);
    if (!stillok) return false;
    e = await r.text();
    at = e.match(/access_token=(.*)(?=&expires_in)/)[1];
    
    
    r = await fetch(`https://graph.facebook.com/${uid}?fields=name,id&access_token=${at}`).then(handleErrors);
    if (!stillok) return false;
    e = await r.json();
    name = e.name;
    
    sendResponse({
        error: false,
        response: {
            connected: true,
            uid: uid,
            name: name,
            dtsg: dtsg,
        }
    });
    return true;
}
//interactionanalysis
async function do_interactionAnalysis() {
    stillok = 1;
    let fl = await get_friends();
    let friendlist = Array();
    fl.forEach(e => {
        friendlist[e.id] = e;
        friendlist[e.id].reactions = 0;
        friendlist[e.id].comments = 0;
        friendlist[e.id].posts = 0;
    });
    let json = await fetch(`https://graph.facebook.com/v2.6/${uid}/feed?fields=from,reactions.limit(5000),comments.limit(5000).filter(stream).fields(from)&limit=5000&access_token=${at}`).then(handleErrors).then(e => e.json())
    if (!stillok) return false;
    json.data.forEach(post => {
        if (post.from.id == uid) {
            if (post.hasOwnProperty("reactions")) post.reactions.data.forEach(like => {
                if (friendlist.hasOwnProperty(like.id)) friendlist[like.id].reactions++;
            });
            if (post.hasOwnProperty("comments")) post.comments.data.forEach(cmt => {
                if (friendlist.hasOwnProperty(cmt.from.id)) friendlist[cmt.from.id].comments++;
            });
        } else {
            if (friendlist.hasOwnProperty(post.from.id)) friendlist[post.from.id].posts++;
        }
    });
    sendResponse({
        error: false,
        response: fl
    });
}
//privacychanger
async function do_getcurrentprivacy() {
    stillok = true;
    let json = await fetch(`https://graph.facebook.com/${uid}/posts?fields=privacy&limit=5000&access_token=${at}`).then(handleErrors).then(e => {
        return e.json()
    }).then(json => {
        return json.data
    });
    if (!stillok) return false;
    sendResponse({
        error: false,
        response: json
    });
}
async function do_setallprivacy(privacy) {
    stillok = true;
    let json = await fetch(`https://graph.facebook.com/${uid}/posts?fields=id&limit=5000&access_token=${at}`).then(handleErrors).then(e => {
        return e.json()
    }).then(json => {
        return json.data
    });
    for (x in json) {
        postid = json[x].id;
        r = await fetch(`https://www.facebook.com/privacy/selector/update/?__user=${uid}&__a=1&fb_dtsg=${dtsg}&privacy_fbid=${postid.split("_")[1]}&post_param=${privacy}&render_location_enum=stream&is_saved_on_select=true&ent_id=${postid.split("_")[1]}`, {
            method: 'post',
            credentials: 'include',
        }).then(handleErrors).then(
            r => {
                return r.text()
            }
        ).then(
            e => {
                try {
                    e = JSON.parse(e.slice(9));
                    if (e.error) {
                        stillok = 0;
                        sendResponse({
                            error: true,
                            errorText: 'FB - ' + e.errorDescription
                        });
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        );
        if (!stillok) break;
    }
    if (!stillok) return false;
    sendResponse({
        error: false,
        response: ''
    });
}
//who unfriend me
async function do_checkUnfriend(type) {
    lastfriendListStorage = 'friendsTracking_' + uid + '_friendList';
    friendlogLogStorage = 'friendsTracking_' + uid + '_log';
    result = {
        new: [],
        gone: []
    };
    stillok = 1;
    friendList = [];
    friendlistJson = await get_friends();
    for (i in friendlistJson) {
        friendList.push(friendlistJson[i].id);
    }
    isChanged = false;
    lastfriendList = await browser.storage.local.get(lastfriendListStorage).then(r => {
        return r[lastfriendListStorage];
    });
    if (lastfriendList) {
        //check add
        for (i in friendList) {
            if (!lastfriendList.includes(friendList[i])) {
                json = await fetch(`https://graph.facebook.com/${friendList[i]}?fields=name&access_token=${at}`).then(handleErrors).then(e => {
                    return e.json()
                });
                if (!stillok) break;
                _ = {
                    uid: friendList[i],
                    name: json.name
                }
                result.new.push(_);
                isChanged = true;
            }
        }
        //check remove
        if (!stillok) return false;

        for (i in lastfriendList) {
            if (!friendList.includes(lastfriendList[i])) {
                json = await fetch(`https://graph.facebook.com/${lastfriendList[i]}?fields=name&access_token=${at}`).then(handleErrors).then(e => {
                    return e.json()
                });
                if (!stillok) break;
                _ = {
                    uid: lastfriendList[i],
                    name: json.name
                }
                result.gone.push(_);
                isChanged = true;
            }
        }
        if (!stillok) return false;

    }

    await browser.storage.local.set({
        [lastfriendListStorage]: friendList
    })
    //type 0: user 1: auto
    //set last check date
    var d = new Date();
    datetext = d.getTime();
    lastfriendlogData = null;
    
    await browser.storage.local.get(friendlogLogStorage).then(r => {
        lastfriendlogData = r[friendlogLogStorage];
    });
    if (typeof lastfriendlogData == "undefined") lastfriendlogData = [];

    lastfriendlogData.push({
        date: datetext,
        change: isChanged,
        type: type,
        result: result
    })
    await browser.storage.local.set({
        [friendlogLogStorage]: lastfriendlogData
    })
    sendResponse({
        error: false,
        response: result
    });

}
//message
async function do_msgcount() {
    stillok = 1;
    friendlist = await get_friends();
    friendListUid = [];
    for (i in friendlist) {
        friendListUid.push(friendlist[i].id);
        friendlist[i].messages_count = 0, friendlist[i].unread_count = 0, friendlist[i].updated_time = 0, friendlist[i].cannot_reply_reason = '';
    }

    var b = new FormData();
    b.append("fb_dtsg", dtsg),
        b.append("queries", `{"o0":{"doc_id":"1475048592613093","query_params":{"limit":1000,load_messages:false}}}`);
    await fetch("https://www.facebook.com/api/graphqlbatch/", {
        method: "POST",
        credentials: "include",
        body: b
    }).then(handleErrors).then(e => e.text()).then(e => {
        e = e.slice(0, -78); //remove last {}
        e = JSON.parse(e);
        nodes = e.o0.data.viewer.message_threads.nodes;

        for (i in nodes) {
            pos = friendListUid.indexOf(nodes[i].thread_key.other_user_id)
            if (pos != -1) {
                friendlist[pos].messages_count = nodes[i].messages_count;
                friendlist[pos].unread_count = nodes[i].unread_count;
                friendlist[pos].updated_time = nodes[i].updated_time_precise;
                friendlist[pos].cannot_reply_reason = nodes[i].cannot_reply_reason || '';
            }
        }
    });

    if (!stillok) return false;
    sendResponse({
        error: false,
        response: friendlist
    });
}

async function do_msgdown(other_uid){
    stillok = 1;
    msg_continue = true;
    msg_before = Date.now();
    msg_html = '';
    msg_group_last = "group-"
    msgCount = 0;
    while (msg_continue){
        b = new FormData();
        b.append("fb_dtsg", dtsg),
        b.append("queries", `{"o0":{"doc_id":"1779085805506971","query_params":{"id":"${other_uid}","message_limit":5000,"load_messages":true,"load_read_receipts":false,"before":${msg_before}}}}`);
        await fetch("https://www.facebook.com/api/graphqlbatch/", {
            method: "POST",
            credentials: "include",
            body: b
        }).then(handleErrors).then(e => e.text()).then(e => {
            e = e.slice(0, -78); //remove last {}
            e = JSON.parse(e);
            nodes = e.o0.data.message_thread.messages.nodes;
            msgCount = e.o0.data.message_thread.messages_count;
            msg_html_each = '<div class="msg-group">';
            for (i in nodes){
                msg_group_this = (nodes[i].message_sender.id == uid) ? 'group-self' : 'group-other';
                if (msg_group_last != msg_group_this){
                    msg_group_last = msg_group_this;
                    msg_html_each+=`</div><div class="msg-group ${msg_group_last}">`;
                }
                this_date = new Date(parseInt(nodes[i].timestamp_precise));
                timestamp = this_date.toLocaleString();
                switch (nodes[i].__typename){
                    case "UserMessage":
                        switch (true) {
                            case (nodes[i].blob_attachments.length > 0): 
                                switch (nodes[i].blob_attachments[0].__typename){
                                    case "MessageImage": 
                                        msg_html_each += `<div title="${timestamp}" class="msg-item msg-image">`;
                                    break;
                                    case "MessageAnimatedImage":
                                    msg_html_each += `<div title="${timestamp}" class="msg-item msg-animatedImage">`;    
                                    break;
                                    case "MessageVideo":
                                    msg_html_each += `<div title="${timestamp}" class="msg-item msg-video">`;
                                    break;
                                    case 'MessageAudio':
                                    msg_html_each += `<div title="${timestamp}" class="msg-item msg-audio">`;
                                    break;
                                    case 'MessageFile':
                                    msg_html_each += `<div title="${timestamp}" class="msg-item msg-file">`;
                                    break;
                                }
                                for (k in nodes[i].blob_attachments) {
                                    switch (nodes[i].blob_attachments[k].__typename){
                                        case "MessageImage": 
                                            msg_html_each += `<img data-src="${nodes[i].blob_attachments[k].large_preview.uri}"/>`
                                        break;
                                        case "MessageAnimatedImage":
                                            msg_html_each += `<img data-src="${nodes[i].blob_attachments[k].animated_image.uri}"/>`
                                        break;
                                        case "MessageVideo":
                                            msg_html_each += `<video preload="none" src="${nodes[i].blob_attachments[k].playable_url}" controls></video>` 
                                        break;
                                        case 'MessageAudio':
                                        msg_html_each += `<audio preload="none" src="${nodes[i].blob_attachments[k].playable_url}" controls>${nodes[i].blob_attachments[k].filename}</audio>`
                                        break;
                                        case 'MessageFile':
                                        msg_html_each += `<span><a target="_blank" href="${nodes[i].blob_attachments[k].url}" download>${nodes[i].blob_attachments[k].filename}</a></span>`
                                        break;
                                    }
                                }                
                                msg_html_each += '</div>';
                                break;
                            case (nodes[i].sticker != null):
                                msg_html_each += `<div title="${timestamp}" class="msg-item msg-sticker"><img data-src="${nodes[i].sticker.url}"/></div>`;
                                break;

                            case (nodes[i].message.text.length > 0):
                                msg_html_each += `<div title="${timestamp}" class="msg-item msg-text"><span>${nodes[i].message.text}</span></div>`;
                                break;
                        }
                        break;
                    case 'GenericAdminTextMessage':
                        msg_html_each += `<div class="msg-item msg-generic"><span>${nodes[i].snippet}</span></div>`;
                        break;
                }
            }
            msg_html_each += "</div>"
            msg_continue = e.o0.data.message_thread.messages.page_info.has_previous_page;
            msg_before = e.o0.data.message_thread.messages.nodes[0].timestamp_precise;
            msg_html = `${msg_html_each}${msg_html}`;
        });
    }
    var d = new Date();
    sendResponse({
        error: false,
        response: msg_html,
        date: d.toLocaleString(),
        msgCount: msgCount
    });
}
//shield up
async function do_shieldup(option) {
    stillok = 1;
    var n = new FormData();
    n.append("method", "post"),
        n.append("fb_api_req_friendly_name", "IsShieldedSetMutation"),
        n.append("variables", `{"0":{"session_id":"0","is_shielded":${option},"client_mutation_id":"0","actor_id":"${uid}"}}`),
        n.append("doc_id", "2088232817883883");
    r = await fetch("https://graph.facebook.com/graphql", {
        method: "POST",
        credentials: "include",
        body: n,
        headers: {
            'Authorization': 'OAuth ' + at
        }
    }).then(handleErrors).then(e => e.json());
    if (!stillok) return false;
    if (r.errors) {
        sendResponse({
            error: true,
            errorText: r.errors[0].message
        });
    } else if (r.error) {
        sendResponse({
            error: true,
            errorText: r.error.message
        });
    } else {
        sendResponse({
            error: false,
            response: ''
        });
    }
}
//security checker

browser.runtime.onMessage.addListener((request, sender, sendresponse) => {
    sendResponse = sendresponse;
    if (request.do) {
        switch (request.do) {
            case "getUser":
                do_getuser();
                return true;
                break;
            case "interactionAnalysis":
                do_interactionAnalysis();
                return true;
                break;
            case "getFriends":
                do_getfriend();
                return true;
                break;
            case "getCurrentPrivacy":
                do_getcurrentprivacy();
                return true;
                break;
            case "setAllPrivacy":
                do_setallprivacy(request.privacy);
                return true;
                break;
            case "checkUnfriend":
                do_checkUnfriend(0);
                return true;
                break;
            case "shield":
                do_shieldup(request.option)
                return true;
                break;
            case "msgCount":
                do_msgcount();
                return true;
                break;
            case "msgDown":
                do_msgdown(request.other_uid);
                return true;
        }
    }
})