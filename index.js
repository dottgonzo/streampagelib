"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var videojs = require("video.js");
var fileinfo = require("filenameinfo");
var swfobject = require("swfobject");
var contrib = require('videojs-contrib-hls');
var defaultHtmlTag = 'videojs';
var StreamPlayer = (function () {
    function StreamPlayer(options) {
        if (!options)
            throw Error("no options provided");
        this.conf = options;
    }
    StreamPlayer.prototype.drawHLS = function () {
        var conf = this.conf;
        if (conf && conf.hlsURI) {
            var opt = {
                uri: conf.hlsURI,
                el: conf.el,
                ratio43: conf.ratio43,
                poster: conf.poster,
                autoplay: conf.autoplay
            };
            return drawHLSPlayer(opt);
        }
        else {
            throw Error("invalid conf for HLS");
        }
    };
    StreamPlayer.prototype.drawPlayer = function () {
        var that = this;
        if (detectPlayer()) {
            that.drawHLS();
        }
        else if (!that.conf.disableFallback) {
            that.drawFLASH();
        }
        else {
            console.log('no html5 browser');
        }
    };
    StreamPlayer.prototype.drawFLASH = function () {
        var conf = this.conf;
        if (conf && conf.swfLib && conf.rtmpURI) {
            var opt = {
                uri: conf.rtmpURI,
                swfLib: conf.swfLib,
                el: conf.el,
                ratio43: conf.ratio43,
                poster: conf.poster,
                autoplay: conf.autoplay
            };
            return drawFLASHPlayer(opt);
        }
        else {
            throw Error("invalid conf for FLASH");
        }
    };
    return StreamPlayer;
}());
exports.StreamPlayer = StreamPlayer;
function SPlayer(options) {
    if (!options || !options.channel || !options.hostname)
        throw Error('invalid bplayer conf');
    var config = {
        swfLib: options.swfLib || './GrindPlayer.swf',
        ratio43: options.ratio43,
        el: options.el,
        disableFallback: options.disableFallback,
        autoplay: options.autoplay,
        poster: options.poster
    };
    if (!options.hlsAppUri)
        options.hlsAppUri = 'hls';
    var hlsurl;
    if (!options.hlsPort)
        options.hlsPort = 443;
    if (options.hlsPort === 443) {
        hlsurl = 'https://' + options.hostname + '/' + options.hlsAppUri + '/' + options.channel + '.m3u8';
    }
    else if (options.hlsPort === 80) {
        hlsurl = 'http://' + options.hostname + '/' + options.hlsAppUri + '/' + options.channel + '.m3u8';
    }
    else {
        hlsurl = 'http://' + options.hostname + ':' + options.hlsPort + '/' + options.hlsAppUri + '/' + options.channel + '.m3u8';
    }
    config.hlsURI = hlsurl;
    if (!options.rtmpAppUri)
        options.rtmpAppUri = 'live';
    config.rtmpURI = 'rtmp://' + options.hostname + ':' + options.rtmpPort + '/' + options.rtmpAppUri + '/' + options.channel;
    var SP = new StreamPlayer(config);
    SP.drawPlayer();
}
exports.SPlayer = SPlayer;
function detectPlayer() {
    var testEl = document.createElement("video");
    if (testEl.canPlayType) {
        if (testEl.canPlayType && testEl.canPlayType('video/mp4; codecs="avc1.42E01E"') && testEl.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') && !(window.navigator.userAgent.indexOf('MSIE ') > -1) && !(window.navigator.userAgent.indexOf('Trident/') > -1)) {
            return true;
        }
    }
    return false;
}
exports.detectPlayer = detectPlayer;
function drawFLASHPlayer(options) {
    var flashvars = {
        src: options.uri,
        autoPlay: false
    };
    if (options.autoplay)
        flashvars.autoPlay = true;
    var params = {
        allowFullScreen: true,
        allowScriptAccess: "always",
        bgcolor: "#000000",
    };
    var attrs = {
        name: "player"
    };
    var ratioH0;
    var ratioV0;
    if (options.ratio43) {
        ratioH0 = 4;
        ratioV0 = 3;
    }
    else {
        ratioH0 = 16;
        ratioV0 = 9;
    }
    var videodim;
    if (window.innerHeight < window.innerWidth) {
        videodim = ((document.getElementById(options.el).offsetWidth / ratioH0) * ratioV0) + 'px';
        document.getElementById(options.el).style.height = videodim;
    }
    else {
        videodim = ((document.getElementById(options.el).offsetWidth / ratioH0) * ratioV0) + 'px';
        document.getElementById(options.el).style.width = '100%';
        document.getElementById(options.el).style.height = videodim;
    }
    window.onresize = function (event) {
        var videodim;
        document.getElementById(options.el).style.width = '100%';
        if (options && options.ratio43) {
            videodim = ((document.getElementById(options.el)
                .offsetWidth / 4) * 3) + 'px';
        }
        else {
            videodim = ((document.getElementById(options.el)
                .offsetWidth / 16) * 9) + 'px';
        }
        document.getElementById(options.el).style.height = videodim;
        swfobject.embedSWF(options.swfLib, options.el, document.getElementById(options.el).offsetWidth, document.getElementById(options.el).offsetHeight, "10.2", null, flashvars, params, attrs);
    };
    swfobject.embedSWF(options.swfLib, options.el, document.getElementById(options.el).offsetWidth, document.getElementById(options.el).offsetHeight, "10.2", null, flashvars, params, attrs);
}
exports.drawFLASHPlayer = drawFLASHPlayer;
function drawHLSPlayer(options) {
    console.log(options);
    if (!options.uri)
        throw Error('no uri specified');
    var opt = {
        el: options.el || defaultHtmlTag
    };
    var videoid = opt.el + '_vid';
    var playerhtml = document.getElementById(opt.el);
    var sourceType = fileinfo.filenameinfo(options.uri).contentType;
    var videoSourceNode = '<source src="' + options.uri + '" type="' + sourceType + '">';
    var player;
    if (!playerhtml)
        throw Error('no html node finded');
    if (playerhtml.innerHTML) {
        if (options.poster) {
            playerhtml.innerHTML = '<video style="width:100%; height:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup=\'{"poster":"' + options.poster + '"}\'>' + videoSourceNode + '</video>';
        }
        else {
            playerhtml.innerHTML = '<video style="width:100%; height:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup=\'{}\'>' + videoSourceNode + '</video>';
        }
        var videodim = void 0;
        if (options && options.ratio43) {
            videodim = ((document.getElementById(opt.el).offsetWidth / 4) * 3) + 'px';
        }
        else {
            videodim = ((document.getElementById(opt.el).offsetWidth / 16) * 9) + 'px';
        }
        document.getElementById(opt.el).style.height = videodim;
        videojs(videoid).dispose();
        player = videojs(videoid);
    }
    else {
        if (options.poster) {
            playerhtml.innerHTML = '<video style="width:100%;height:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup=\'{"poster":"' + options.poster + '"}\'>' + videoSourceNode + '</video>';
        }
        else {
            playerhtml.innerHTML = '<video style="width:100%;height:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup=\'{}\'>' + videoSourceNode + '</video>';
        }
        var videodim = void 0;
        if (options && options.ratio43) {
            videodim = ((document.getElementById(opt.el)
                .offsetWidth / 4) * 3) + 'px';
        }
        else {
            videodim = ((document.getElementById(opt.el)
                .offsetWidth / 16) * 9) + 'px';
        }
        document.getElementById(opt.el).style.height = videodim;
        player = videojs(videoid);
    }
    window.onresize = function (event) {
        var videodim;
        if (options && options.ratio43) {
            videodim = ((document.getElementById(opt.el)
                .offsetWidth / 4) * 3) + 'px';
        }
        else {
            videodim = ((document.getElementById(opt.el)
                .offsetWidth / 16) * 9) + 'px';
        }
        document.getElementById(opt.el).style.height = videodim;
    };
    player.on('loadedmetadata', function () {
        document.getElementById(opt.el).style.height = (document.getElementById(opt.el).offsetWidth * player.videoHeight()) / player.videoWidth() + 'px';
    });
    if (options.autoplay) {
        setTimeout(function () {
            player.play();
        }, 500);
    }
}
exports.drawHLSPlayer = drawHLSPlayer;
