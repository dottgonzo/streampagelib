
import * as $ from 'jquery'
import * as videojs from 'video.js'
import * as fileinfo from 'filenameinfo'

require('videojs-contrib-hls')


export interface IConfigOptions {
    el?: string
    uri: string
}

export interface IOptions {
    el: string
    uri: string
}

const defaultOptions = {
    el: 'videojs'
}

export function drawPlayer(options: IConfigOptions) {

    if (!options.uri) throw Error('no uri specified')

    const opt: IOptions = {
        el: options.el || defaultOptions.el,
        uri: options.uri
    }

    const videoid = opt.el + '_vid'

    const playerhtml = $('#' + opt.el)

    const sourceType = fileinfo.filenameinfo(options.uri).contentType

    const videoSourceNode = '<source src="' + options.uri + '" type="' + sourceType + '">'

    let player

    if (playerhtml.html()) {
        playerhtml.html('<video style="width:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup="{}">' + videoSourceNode + '</video>')
        videojs(videoid).dispose()
        player = videojs(videoid)
    } else {
        playerhtml.html('<video style="width:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup="{}">' + videoSourceNode + '</video>')
        player = videojs(videoid)
    }




    player.on('loadedmetadata', function () {


        $('#' + videoid).css('height', ($('#' + videoid).width() * this.videoHeight()) / this.videoWidth() + 'px')

    })


}