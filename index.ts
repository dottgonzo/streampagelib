
import * as videojs from 'video.js'
import * as fileinfo from 'filenameinfo'
import * as swfobject from 'swfobject'

const contrib = require('videojs-contrib-hls')


export interface IHLSConfigOptions {
  el?: string
  uri: string
  ratio43?: boolean
  autoplay?: boolean
  poster?: string
}

export interface IRTMPConfigOptions {
  el?: string
  uri: string
  swfLib?: string
  ratio43?: boolean
  autoplay?: boolean
  poster?: string
}



export interface IStreamPlayerOptions {
  swfLib?: string
  el?: string
  hlsURI?: string
  rtmpURI?: string
  disableFallback?: boolean
  ratio43?: boolean
  poster?: string
  autoplay?: boolean
}




const defaultHtmlTag = 'videojs'



export class StreamPlayer {
  conf: IStreamPlayerOptions
  constructor(options: IStreamPlayerOptions) {

    if (!options) throw Error("no options provided")




    this.conf = options

  }

  drawHLS() {


    const conf = this.conf

    if (conf && conf.hlsURI) {
      const opt = {
        uri: conf.hlsURI,
        el: conf.el,
        ratio43: conf.ratio43,
        poster: conf.poster,
        autoplay: conf.autoplay
      }

      return drawHLSPlayer(opt)
    } else {
      throw Error("invalid conf for HLS")
    }


  }

  drawPlayer() {
    const that = this
    if (detectPlayer()) {
      that.drawHLS()
    } else if (!that.conf.disableFallback) {
      that.drawFLASH()
    } else {
      console.log('no html5 browser')
    }

  }
  drawFLASH() {
    const conf = this.conf

    if (conf && conf.swfLib && conf.rtmpURI) {
      const opt = {
        uri: conf.rtmpURI,
        swfLib: conf.swfLib,
        el: conf.el,
        ratio43: conf.ratio43,
        poster: conf.poster,
        autoplay: conf.autoplay
      }

      return drawFLASHPlayer(opt)
    } else {
      throw Error("invalid conf for FLASH")
    }

  }
}

export interface IBeontvPlayerConf {

  channel: string
  uri?: string
  swfLib?: string
  hlsAppUri?: string
  rtmpAppUri?: string
  hostname: string
  hlsPort?: number
  rtmpPort?: number
  ratio43?: boolean
  el?: string
  disableFallback?: boolean
  autoplay?: boolean
  poster?: string
}
export function SPlayer(options: IBeontvPlayerConf) {
  if (!options || !options.channel || !options.hostname) throw Error('invalid bplayer conf')
  const config = <IStreamPlayerOptions>{
    swfLib: options.swfLib || './GrindPlayer.swf',
    ratio43: options.ratio43,
    el: options.el,
    disableFallback: options.disableFallback,
    autoplay: options.autoplay,
    poster: options.poster
  }



  if (!options.hlsAppUri) options.hlsAppUri = 'hls'
  let hlsurl: string
  if (!options.hlsPort) options.hlsPort = 443

  if (options.hlsPort === 443) {
    hlsurl = 'https://' + options.hostname + '/' + options.hlsAppUri + '/' + options.channel + '.m3u8'
  } else if (options.hlsPort === 80) {
    hlsurl = 'http://' + options.hostname + '/' + options.hlsAppUri + '/' + options.channel + '.m3u8'
  } else {
    hlsurl = 'http://' + options.hostname + ':' + options.hlsPort + '/' + options.hlsAppUri + '/' + options.channel + '.m3u8'
  }


  config.hlsURI = hlsurl
  if (!options.rtmpAppUri) options.rtmpAppUri = 'live'

  config.rtmpURI = 'rtmp://' + options.hostname + ':' + options.rtmpPort + '/' + options.rtmpAppUri + '/' + options.channel

  const SP = new StreamPlayer(config)
  SP.drawPlayer()
}



export function detectPlayer(): boolean {
  const testEl = document.createElement("video")

  if (testEl.canPlayType) {

    // Check for h264 support
    if (testEl.canPlayType && testEl.canPlayType('video/mp4; codecs="avc1.42E01E"') && testEl.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') && !(window.navigator.userAgent.indexOf('MSIE ') > -1) && !(window.navigator.userAgent.indexOf('Trident/') > -1) && !(window.navigator.userAgent.indexOf('SMART-TV/')  > -1 && window.navigator.userAgent.indexOf('Kit/')  > -1 && parseInt(window.navigator.userAgent.split('Kit/')[1].split('.')[0]) < 536)) {
      return true
    }


  }
  return false

}



export function drawFLASHPlayer(options: IRTMPConfigOptions) {

  const flashvars = {
    src: options.uri,
    autoPlay: false
  }


  if (options.autoplay) flashvars.autoPlay = true

  const params = {
    allowFullScreen: true,
    allowScriptAccess: "always",
    bgcolor: "#000000",
  }
  const attrs = {
    name: "player"
  }

  let ratioH0
  let ratioV0




  if (options.ratio43) {
    ratioH0 = 4
    ratioV0 = 3

  } else {
    ratioH0 = 16
    ratioV0 = 9
  }
  let videodim

  // if(options.poster){
  //   const newdiv = document.createElement('div')
  //   newdiv.innerHTML='<a id="swfocover" style="display:block;height:100%;width:100%;display:block" href="javascript:flstreamplay()"><div style="background-image:url(\''+options.poster+'\');width:100%;height:100%;background-size:cover;background-position:50% 50%;"></div></a><div id="swfo" style="display:none;width:100%;height:100%"></div>'
  //   newdiv.style.height='100%'
  //   newdiv.style.width='100%'

  //   document.getElementById(options.el).appendChild(newdiv)


  //   window['flstreamplay']=function(){

  //     document.getElementById("swfocover").remove()
  //     document.getElementById("swfo").style.display='block'

  //   }


  // }


  if (window.innerHeight < window.innerWidth) {
    videodim = ((document.getElementById(options.el).offsetWidth / ratioH0) * ratioV0) + 'px'


    document.getElementById(options.el).style.height = videodim


  } else {
    videodim = ((document.getElementById(options.el).offsetWidth / ratioH0) * ratioV0) + 'px'


    document.getElementById(options.el).style.width = '100%'
    document.getElementById(options.el).style.height = videodim

  }


  window.onresize = function (event) {

    let videodim
    document.getElementById(options.el).style.width = '100%'

    if (options && options.ratio43) {
      videodim = ((document.getElementById(options.el)
        .offsetWidth / 4) * 3) + 'px'
    } else {
      videodim = ((document.getElementById(options.el)
        .offsetWidth / 16) * 9) + 'px'
    }


    document.getElementById(options.el).style.height = videodim

    // if(!options.poster){

    // swfobject.embedSWF(options.swfLib, options.el, document.getElementById(options.el).offsetWidth, document.getElementById(options.el).offsetHeight, "10.2", null, flashvars, params, attrs);
    // } else {
    //   swfobject.embedSWF(options.swfLib, "swfo", document.getElementById(options.el).offsetWidth, document.getElementById(options.el).offsetHeight, "10.2", null, flashvars, params, attrs);

    // }
    swfobject.embedSWF(options.swfLib, options.el, "100%", "100%", "10.2", null, flashvars, params, attrs);
  }
  // if(!options.poster){

  // swfobject.embedSWF(options.swfLib, options.el, document.getElementById(options.el).offsetWidth, document.getElementById(options.el).offsetHeight, "10.2", null, flashvars, params, attrs);

  // }  else {
  //   swfobject.embedSWF(options.swfLib, "swfo", document.getElementById(options.el).offsetWidth, document.getElementById(options.el).offsetHeight, "10.2", null, flashvars, params, attrs);

  // }
  swfobject.embedSWF(options.swfLib, options.el, "100%", "100%", "10.2", null, flashvars, params, attrs);

}



export function drawHLSPlayer(options: IHLSConfigOptions) {
  console.log(options)
  if (!options.uri) throw Error('no uri specified')

  const opt = {
    el: options.el || defaultHtmlTag
  }

  const videoid = opt.el + '_vid'

  const playerhtml = document.getElementById(opt.el)

  const sourceType = fileinfo.filenameinfo(options.uri).contentType

  const videoSourceNode = '<source src="' + options.uri + '" type="' + sourceType + '">'




  let player
  if (!playerhtml) throw Error('no html node finded')
  if (playerhtml.innerHTML) {


    if (options.poster) {
      playerhtml.innerHTML = '<video style="width:100%; height:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup=\'{"poster":"' + options.poster + '"}\'>' + videoSourceNode + '</video>'
    } else {
      playerhtml.innerHTML = '<video style="width:100%; height:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup=\'{}\'>' + videoSourceNode + '</video>'

    }
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

    if (options.poster) {
      playerhtml.innerHTML = '<video style="width:100%;height:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup=\'{"poster":"' + options.poster + '"}\'>' + videoSourceNode + '</video>'

    } else {
      playerhtml.innerHTML = '<video style="width:100%;height:100%" class="video-js" id="' + videoid + '" controls preload="auto" data-setup=\'{}\'>' + videoSourceNode + '</video>'

    }


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
  if (options.autoplay) {
    setTimeout(() => {
      player.play()

    }, 500)
  }


}