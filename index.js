"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var videojs = require("video.js");
var fileinfo = require("filenameinfo");
var contrib = require('videojs-contrib-hls');
var defaultOptions = {
    el: 'videojs'
};
function drawPlayer(options) {
    if (!options.uri)
        throw Error('no uri specified');
    var opt = {
        el: options.el || defaultOptions.el,
        uri: options.uri
    };
    var videoid = opt.el + '_vid';
    var playerhtml = document.getElementById(opt.el);
    var sourceType = fileinfo.filenameinfo(options.uri).contentType;
    var videoSourceNode = '<source src="' + options.uri + '" type="' + sourceType + '">';
    var player;
    if (!playerhtml)
        throw Error('no html node finded');
    if (playerhtml.innerHTML) {
        playerhtml.innerHTML = '<video style="width:100%; eight:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup="{}">' + videoSourceNode + '</video>';
        var videoheight169 = ((document.getElementById(opt.el).offsetWidth / 16) * 9) + 'px';
        document.getElementById(opt.el).style.height = videoheight169;
        videojs(videoid).dispose();
        player = videojs(videoid);
    }
    else {
        playerhtml.innerHTML = '<video style="width:100%;height:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup="{}">' + videoSourceNode + '</video>';
        var videoheight169 = ((document.getElementById(opt.el)
            .offsetWidth / 16) * 9) + 'px';
        document.getElementById(opt.el).style.height = videoheight169;
        player = videojs(videoid);
    }
    window.onresize = function (event) {
        var videoheight169 = ((document.getElementById(opt.el)
            .offsetWidth / 16) * 9) + 'px';
        document.getElementById(opt.el).style.height = videoheight169;
    };
    player.on('loadedmetadata', function () {
        document.getElementById(opt.el).style.height = (document.getElementById(opt.el).offsetWidth * player.videoHeight()) / player.videoWidth() + 'px';
    });
}
exports.drawPlayer = drawPlayer;
