
import * as videojs from 'video.js'
import * as fileinfo from 'filenameinfo'

const contrib = require('videojs-contrib-hls')


export interface IConfigOptions {
    el?: string
    uri: string
    ratio43?: string
}

export interface IOptions {
    el: string
    uri: string
}

const defaultOptions = {
    el: 'videojs'
}

export function drawPlayer(options: IConfigOptions) {
console.log(options)
    if (!options.uri) throw Error('no uri specified')

    const opt: IOptions = {
        el: options.el || defaultOptions.el,
        uri: options.uri
    }

    const videoid = opt.el + '_vid'

    const playerhtml = document.getElementById(opt.el)

    const sourceType = fileinfo.filenameinfo(options.uri).contentType

    const videoSourceNode = '<source src="' + options.uri + '" type="' + sourceType + '">'

    let player
    if (!playerhtml) throw Error('no html node finded')
    if (playerhtml.innerHTML) {

        playerhtml.innerHTML = '<video style="width:100%; height:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup="{}">' + videoSourceNode + '</video>'

        let videodim

        if (options && options.ratio43) {
            videodim = ((document.getElementById(opt.el).offsetWidth / 4) * 3) + 'px'
        } else {
            videodim = ((document.getElementById(opt.el).offsetWidth / 16) * 9) + 'px'
        }


        document.getElementById(opt.el).style.height = videodim
        videojs(videoid).dispose()
        player = videojs(videoid)
    } else {
        playerhtml.innerHTML = '<video style="width:100%;height:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup="{}">' + videoSourceNode + '</video>'

        let videodim

        if (options && options.ratio43) {
           
            videodim = ((document.getElementById(opt.el)
                .offsetWidth / 4) * 3) + 'px'
        } else {
            videodim = ((document.getElementById(opt.el)
                .offsetWidth / 16) * 9) + 'px'
        }






        document.getElementById(opt.el).style.height = videodim
        player = videojs(videoid)
    }

    window.onresize = function (event) {

        let videodim

        if (options && options.ratio43) {
            videodim = ((document.getElementById(opt.el)
                .offsetWidth / 4) * 3) + 'px'
        } else {
            videodim = ((document.getElementById(opt.el)
                .offsetWidth / 16) * 9) + 'px'
        }




        document.getElementById(opt.el).style.height = videodim
    }

    player.on('loadedmetadata', function () {


        document.getElementById(opt.el).style.height = (document.getElementById(opt.el).offsetWidth * player.videoHeight()) / player.videoWidth() + 'px';

    })


}