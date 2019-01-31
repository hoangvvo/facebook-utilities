const minify = require('@node-minify/core');
const uglifyES = require('@node-minify/uglify-es');
const cleanCSS = require('@node-minify/clean-css');
const htmlMinifier = require('@node-minify/html-minifier');
const fs = require('fs-extra')

function processJS(){
    var jsfiles = [
    'js/_attoolkit.js',
    'js/_background.js',
    'js/_common.js',
    'js/_dashboard.js',
    'js/_fbtimer.js',
    'js/_friendstracking.js',
    'js/_interactionanalysis.js',
    'js/_message.js',
    'js/_options.js',
    'js/_popup.js',
    'js/_ppshield.js',
    'js/_privacychanger.js',
    'js/_welcome.js',
    'js/bootstrap-colorpicker.min.js',
    'js/bootstrap-material-design.min.js',
    'js/bootstrap-notify.js',
    'js/bootstrap-selectpicker.js',
    'js/chartist.min.js',
    'js/jquery.dataTables.min.js',
    'js/jquery.min.js',
    'js/jquery.validate.min.js',
    'js/lazyload.min.js',
    'js/perfect-scrollbar.jquery.min.js',
    'js/popper.min.js',
    'js/sweetalert2.js']
    //minify js
    for (i in jsfiles) {
        minify({
            compressor: uglifyES,
            input: jsfiles[i],
            output: 'build/'+jsfiles[i],
            options: {
            mangle: { toplevel: true, reserved: ['_uid','_name','_dtsg','init','loadingsth','alert','at','uid','dtsg','sendResponse'] },
            compress: true
            }
        });
    }
    console.log('JS files minified.');
}

function processCSS(){
    var cssfiles = [
    'css/common.css',
    'css/message-viewer.css',
    'css/material-dashboard.min.css',
    'css/bootstrap-colorpicker.min.css'
    ];
    for (i in cssfiles) {
        minify({
            compressor: cleanCSS,
            input: cssfiles[i],
            output: 'build/'+cssfiles[i],
            options: {
              advanced: true // set to false to disable advanced optimizations - selector & property merging, reduction, etc.
            }
        });
    }
    console.log('Css files minified.');
}

function processHTML(){
    var htmlfiles = [
    'attoolkit.html',
    'dashboard.html',
    'friendstracking.html',
    'interactionanalysis.html',
    'message.html',
    'options.html',
    'popup.html',
    'ppshield.html',
    'privacychanger.html',
    'page/changelog.html',
    'page/facebookblocked.html',
    'page/welcome.html',
    'include/navbar.html',
    'include/sidebar.html'
    ];
    for (i in htmlfiles) {
        minify({
            compressor: htmlMinifier,
            input: htmlfiles[i],
            output: 'build/'+htmlfiles[i],
            options: {
                removeStyleLinkTypeAttributes: true,
                removeScriptTypeAttributes: true,
                removeRedundantAttributes: true,
                removeComments: true,
                removeAttributeQuotes: true,
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                minifyCSS: true
            }
        });
    }
    console.log('Html files minified.');
}

function copyFiles(){
    dirs = ['js','icon','img'];
    for (i in dirs) 
    if (!fs.exists('build/'+dirs[i], (err) => {})){
        fs.mkdir('build/'+dirs[i], (err) => {});
    }
    files = [
        'manifest.json',
        'js/browser-polyfill.min.js',
        'icon/32.png',
        'icon/48.png',
        'icon/96.png',
        'img/noshield.png',
        'img/shield.png',
        'img/sidebar-4.jpg'
    ];
    for (i in files) fs.copyFile(files[i], 'build/'+files[i], (err) => {});
    console.log('File copied.');
}
console.log('prepare for productions...');

processJS();
processCSS();
processHTML();
copyFiles();
console.log('Done!');