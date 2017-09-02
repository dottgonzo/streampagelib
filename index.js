"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var videojs = require("video.js");
var fileinfo = require("filenameinfo");
require('videojs-contrib-hls');
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
    var playerhtml = $('#' + opt.el);
    var sourceType = fileinfo.filenameinfo(options.uri).contentType;
    var videoSourceNode = '<source src="' + options.uri + '" type="' + sourceType + '">';
    var player;
    if (playerhtml.html()) {
        playerhtml.html('<video style="width:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup="{}">' + videoSourceNode + '</video>');
        videojs(videoid).dispose();
        player = videojs(videoid);
    }
    else {
        playerhtml.html('<video style="width:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup="{}">' + videoSourceNode + '</video>');
        player = videojs(videoid);
    }
    player.on('loadedmetadata', function () {
        $('#' + videoid).css('height', ($('#' + videoid).width() * this.videoHeight()) / this.videoWidth() + 'px');
    });
}
exports.drawPlayer = drawPlayer;
