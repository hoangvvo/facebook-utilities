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

//login with password
//md5
var MD5=function(r){function n(r,n){return r<<n|r>>>32-n}function t(r,n){var t,o,e,a,u;return e=2147483648&r,a=2147483648&n,u=(1073741823&r)+(1073741823&n),(t=1073741824&r)&(o=1073741824&n)?2147483648^u^e^a:t|o?1073741824&u?3221225472^u^e^a:1073741824^u^e^a:u^e^a}function o(r,o,e,a,u,f,i){var C;return t(n(r=t(r,t(t((C=o)&e|~C&a,u),i)),f),o)}function e(r,o,e,a,u,f,i){var C;return t(n(r=t(r,t(t(o&(C=a)|e&~C,u),i)),f),o)}function a(r,o,e,a,u,f,i){return t(n(r=t(r,t(t(o^e^a,u),i)),f),o)}function u(r,o,e,a,u,f,i){return t(n(r=t(r,t(t(e^(o|~a),u),i)),f),o)}function f(r){var n,t="",o="";for(n=0;n<=3;n++)t+=(o="0"+(r>>>8*n&255).toString(16)).substr(o.length-2,2);return t}var i,C,c,g,h,v,d,S,m,l=Array();for(l=function(r){for(var n,t=r.length,o=t+8,e=16*((o-o%64)/64+1),a=Array(e-1),u=0,f=0;f<t;)u=f%4*8,a[n=(f-f%4)/4]=a[n]|r.charCodeAt(f)<<u,f++;return u=f%4*8,a[n=(f-f%4)/4]=a[n]|128<<u,a[e-2]=t<<3,a[e-1]=t>>>29,a}(r=function(r){r=r.replace(/\r\n/g,"\n");for(var n="",t=0;t<r.length;t++){var o=r.charCodeAt(t);o<128?n+=String.fromCharCode(o):o>127&&o<2048?(n+=String.fromCharCode(o>>6|192),n+=String.fromCharCode(63&o|128)):(n+=String.fromCharCode(o>>12|224),n+=String.fromCharCode(o>>6&63|128),n+=String.fromCharCode(63&o|128))}return n}(r)),v=1732584193,d=4023233417,S=2562383102,m=271733878,i=0;i<l.length;i+=16)C=v,c=d,g=S,h=m,d=u(d=u(d=u(d=u(d=a(d=a(d=a(d=a(d=e(d=e(d=e(d=e(d=o(d=o(d=o(d=o(d,S=o(S,m=o(m,v=o(v,d,S,m,l[i+0],7,3614090360),d,S,l[i+1],12,3905402710),v,d,l[i+2],17,606105819),m,v,l[i+3],22,3250441966),S=o(S,m=o(m,v=o(v,d,S,m,l[i+4],7,4118548399),d,S,l[i+5],12,1200080426),v,d,l[i+6],17,2821735955),m,v,l[i+7],22,4249261313),S=o(S,m=o(m,v=o(v,d,S,m,l[i+8],7,1770035416),d,S,l[i+9],12,2336552879),v,d,l[i+10],17,4294925233),m,v,l[i+11],22,2304563134),S=o(S,m=o(m,v=o(v,d,S,m,l[i+12],7,1804603682),d,S,l[i+13],12,4254626195),v,d,l[i+14],17,2792965006),m,v,l[i+15],22,1236535329),S=e(S,m=e(m,v=e(v,d,S,m,l[i+1],5,4129170786),d,S,l[i+6],9,3225465664),v,d,l[i+11],14,643717713),m,v,l[i+0],20,3921069994),S=e(S,m=e(m,v=e(v,d,S,m,l[i+5],5,3593408605),d,S,l[i+10],9,38016083),v,d,l[i+15],14,3634488961),m,v,l[i+4],20,3889429448),S=e(S,m=e(m,v=e(v,d,S,m,l[i+9],5,568446438),d,S,l[i+14],9,3275163606),v,d,l[i+3],14,4107603335),m,v,l[i+8],20,1163531501),S=e(S,m=e(m,v=e(v,d,S,m,l[i+13],5,2850285829),d,S,l[i+2],9,4243563512),v,d,l[i+7],14,1735328473),m,v,l[i+12],20,2368359562),S=a(S,m=a(m,v=a(v,d,S,m,l[i+5],4,4294588738),d,S,l[i+8],11,2272392833),v,d,l[i+11],16,1839030562),m,v,l[i+14],23,4259657740),S=a(S,m=a(m,v=a(v,d,S,m,l[i+1],4,2763975236),d,S,l[i+4],11,1272893353),v,d,l[i+7],16,4139469664),m,v,l[i+10],23,3200236656),S=a(S,m=a(m,v=a(v,d,S,m,l[i+13],4,681279174),d,S,l[i+0],11,3936430074),v,d,l[i+3],16,3572445317),m,v,l[i+6],23,76029189),S=a(S,m=a(m,v=a(v,d,S,m,l[i+9],4,3654602809),d,S,l[i+12],11,3873151461),v,d,l[i+15],16,530742520),m,v,l[i+2],23,3299628645),S=u(S,m=u(m,v=u(v,d,S,m,l[i+0],6,4096336452),d,S,l[i+7],10,1126891415),v,d,l[i+14],15,2878612391),m,v,l[i+5],21,4237533241),S=u(S,m=u(m,v=u(v,d,S,m,l[i+12],6,1700485571),d,S,l[i+3],10,2399980690),v,d,l[i+10],15,4293915773),m,v,l[i+1],21,2240044497),S=u(S,m=u(m,v=u(v,d,S,m,l[i+8],6,1873313359),d,S,l[i+15],10,4264355552),v,d,l[i+6],15,2734768916),m,v,l[i+13],21,1309151649),S=u(S,m=u(m,v=u(v,d,S,m,l[i+4],6,4149444226),d,S,l[i+11],10,3174756917),v,d,l[i+2],15,718787259),m,v,l[i+9],21,3951481745),v=t(v,C),d=t(d,c),S=t(S,g),m=t(m,h);return(f(v)+f(d)+f(S)+f(m)).toLowerCase()};
//getlogin
async function do_getloginwithpass(login,psw){
    let stillok = true;
    let app_secret = "62f8ce9f74b12f84c123cc23437a4a32";
    let api_key = "882a8490361da98702bf97a021ddc14d";
    var b = new FormData();
    b.append("api_key",api_key);
    b.append("credentials_type", "password");
    b.append("email", login);
    b.append("format", "JSON");
    b.append("generate_machine_id", "1");
    b.append("generate_session_cookies", "1");
    b.append("locale", "en_US");
    b.append("method", "auth.login");
    b.append("password", psw);
    b.append("return_ssl_resources", "0");
    b.append("v","1.0")
    //create sig
    let sig = '';
    for(var i of b.entries()) {
        sig += `${i[0]}=${i[1]}`
    }
    sig+=app_secret;
    b.append("sig",MD5(sig));
    r = await fetch(`https://api.facebook.com/restserver.php`, {
        method: "POST",
        body: b
    }).then(handleErrors);
    if (!stillok) return false;
    e = await r.json();
    if (e.access_token) {
        sendResponse({
        error: false,
        response: {
            at: e.access_token
        }
        }) 
    } else { sendResponse({
        error: true,
        errorText: e.error_msg
    })
    }
    return true;
}

//get user + access token
async function do_getuser() {
    let name = '';
    at = '';
    dtsg = '';
    let accountType = 0;
    let accountUntil = '';
    let stillok = true;
    //check if user enabled api
    apienable = await browser.storage.local.get("opt_api").then(r => {
        if (r.opt_api != true) {
            stillok = 0;
            sendResponse({
            error: true,
            APIdisable: true,
            errorText: 'Please enabled API option to use this feature.'
            });
        }
    })
    if (!stillok) return false;
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
    try { dtsg = e.match(/\["DTSGInitialData",\[\],\{"token"\:"(.*?)"\},/i)[1]; } catch(e) {
        stillok = 0;
        sendResponse({
            error: true,
            errorText: 'Get DTSG failed.'
        });
    }
    if (!stillok) return false;
    
    r = await browser.storage.local.get(["opt_login_at","opt_login_at_token"]);
    console.log(r);
    if (r.opt_login_at) {
        at = r.opt_login_at_token;
    } else {

        var b = new FormData();
        b.append('fb_dtsg', dtsg);
        b.append('app_id', '6628568379');
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
        try { at = e.match(/access_token=(.*)(?=&expires_in)/)[1]; } catch(e) {
            stillok = 0;
            sendResponse({
                error: true,
                errorText: 'Get access token failed.'
            });
        }
    }  
    if (!stillok) return false;  
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
//at tools
async function do_showat() {
    sendResponse({
        error: false,
        response: {
            at: at
        }
    });
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
                break;
            case "showat":
                do_showat();
                return true;
                break;
            case "getloginwithpass":
                do_getloginwithpass(request.login,request.psw);
                return true;
                break;
        }
    }
})