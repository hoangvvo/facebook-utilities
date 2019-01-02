el = null;
sec = 0;
date = 0;
seclimit = 0;
limit = false;

function init() {
    var t = document.getElementById("findFriendsNav");
    if (null !== t) try {
        t.parentNode.parentNode.remove(); //make room
    } catch (e) {}
    tt = document.getElementById("vvh_fbtimer_container");
    if (null !== t) try {
        tt.remove(); //i guess this will fix dublicate timer :v
    } catch (e) {}
    var a = document.getElementById("pagelet_bluebar");
    if (null !== a) {
        var i = document.createElement("div");
        i.className = "vvh_fbtimer_container";
        i.className = "_4kny _2s24";
        var o = document.createElement("div");
        o.className = "_3qcu _cy7",
            el = document.createElement("a"),
            el.className = "_2s25",
            el.id = "vvh_fbtimer",
            el.textContent = "00:00:00",
            o.appendChild(el),
            i.appendChild(o);
        var n = a.querySelector('[data-click="home_icon"]');
        if (null !== n) {
            n.parentNode.parentNode.appendChild(i)
            load();
        }
    }
}
async function load() {
    sec = await browser.storage.local.get("fb_timerSec").then(r => {
        return r.fb_timerSec || 0
    });
    date = await browser.storage.local.get("fb_timerDate").then(r => {
        return r.fb_timerDate || getdate()
    });
    window.addEventListener("unload", save);
    setInterval(track, 1e3);
}

function save() {
    browser.storage.local.set({
        fb_timerSec: sec,
        fb_timerDate: date
    })
}

function getdate() {
    var d = new Date();
    return `${d.getDate()} ${d.getMonth()+1} ${d.getFullYear()}`;
}

function track() {
    if (getdate() != date) {
        sec = 0;
        date = getdate();
    } else sec++;
    var h = void 0,
        m = void 0,
        s = void 0;
    h = Math.floor(sec / 3600),
        m = Math.floor((sec - 3600 * h) / 60),
        s = sec - 60 * m - 3600 * h,
        h < 10 && (h = "0" + h),
        m < 10 && (m = "0" + m),
        s < 10 && (s = "0" + s),
        el.textContent = `${h}:${m}:${s}`
    //facebook stayfocused
    if (limit && sec > seclimit) {
        window.location.href = browser.extension.getURL("page/facebookblocked.html");
    }
    save();
}
browser.storage.local.get(["opt_fb_timer", "opt_fb_timer_blocker", "opt_fb_timer_blocker_value"]).then(e => {
    console.log(e);
    if (e.opt_fb_timer) init();
    if (e.opt_fb_timer_blocker) {
        limit = true;
        seclimit = parseInt(e.opt_fb_timer_blocker_value) * 60;
    }
})