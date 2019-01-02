let searchParams = new URLSearchParams(window.location.search)
    let param = searchParams.get('reason');
    let h1 = document.getElementById("reason"), desc = document.getElementById("description");
    switch (param) {
        case "install": 
            h1.innerHTML = '<img src="/icon/96.png" style="height: 78px; margin-right: 18px">Welcome to my add-on!'
            desc.innerHTML = "You have successfully installed the most awesome totally-free add-on that improve your Facebook experience."
        //set default options
        browser.storage.local.set({
            opt_collect_usagedata: true,
            //opt_myapi: true
        })
        break;
        case "update":
            h1.innerHTML = '<img src="/icon/96.png" style="height: 78px; margin-right: 18px">The add-on has been updated!';
            desc.innerHTML = "You have successfully updated this awesome totally-free add-on. Check out changelog for new features";
        break;
    }
fetch('changelog.html')
    .then(function(response) {
      return response.text();
    })
    .then(function(text) {
      let changelog = document.getElementById("changelog");
      changelog.innerHTML = text;
    });