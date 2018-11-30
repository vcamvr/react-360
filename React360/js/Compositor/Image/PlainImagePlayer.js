import type {TextureMetadata} from '../Environment/Types';
import type {VideoPlayer} from '../Video/Types';
import {loadTexture} from '../../Utils/util';
import {Observable} from 'rxjs/Observable';
import HierarchicalCube from '../../Utils/HPano';

export default class PlainImagePlayer implements VideoPlayer {
  _resourceManager: ?ResourceManager<Image>;
  _load: ?Promise<TextureMetadata>;
  // _status: VideoPlayerStatus;
  // _isBuffering: boolean;
  // _playing: boolean;
  // _primed: boolean;
  // _eventDispatcher: THREE.EventDispatcher;

  constructor(rm: ?ResourceManager<Image>) {
    this._resourceManager = rm;
    // this._status = 'closed';
    // this._isBuffering = false;
    // this._playing = false;
    // this._primed = false;
    this._load = null;

    // media events
    // this._eventDispatcher = new THREE.EventDispatcher();
    // this._element.addEventListener('seeked', this._onSeeked);
    // this._element.addEventListener('ended', this._onEnded);
    // this._element.addEventListener('waiting', this._onWaiting);
    // this._element.addEventListener('playing', this._onPlaying);
    // this._element.addEventListener('timeupdate', this._onTimeupdate);
  }

  // _updateStatus(newStatus: VideoPlayerStatus, error: ?string, forceReport: boolean = false) {
  //   if (forceReport || newStatus !== this._status) {
  //     this._status = newStatus;
  //     this._eventDispatcher.dispatchEvent({
  //       type: 'status',
  //       // duration: this._element.duration,
  //       isBuffering: this._isBuffering,
  //       error: error,
  //       // isMuted: this._element.muted,
  //       // position: this._element.currentTime,
  //       status: this._status,
  //       // volume: this._element.volume,
  //     });
  //   }
  // }

  // _onEnded = () => {
  //   this._playing = false;
  //   this._updateStatus('finished');
  // };

  // _onSeeked = () => {
  //   this._isBuffering = false;
  //   if (this._status === 'seeking') {
  //     if (this._playing) {
  //       this._updateStatus('playing');
  //     } else {
  //       this._updateStatus('ready');
  //     }
  //   }
  // };

  // _onWaiting = () => {
  //   if (!this._isBuffering) {
  //     this._isBuffering = true;
  //     this._updateStatus(this._status, undefined, true);
  //   }
  // };

  // _onPlaying = () => {
  //   if (this._isBuffering) {
  //     this._isBuffering = false;
  //     this._updateStatus(this._status, undefined, true);
  //   }
  // };

  // _onTimeupdate = () => {
  //   if (this._playing) {
  //     this._updateStatus(this._status, undefined, true);
  //   }
  // };

  setSource(url: string, options?: PanoOptions) {
    if (!options.tile) {
      this._load = loadTexture(url, options, this._resourceManager);
      return;
    }

    this._load = Observable.create(observer => {
      Promise.all(
        HierarchicalCube._load(url).map(url =>
          loadTexture(url, options, this._resourceManager).then(texMetadata => {
            observer.next(texMetadata);
          })
        )
      ).then(() => {
        observer.next(/** we are done. */);
      });
    }).toPromise();

    // if (this._texture) {
    //   this._texture.dispose();
    // }
    // this._isBuffering = true;
    // this._updateStatus('closed', undefined, true);
    // this._load = new Promise((resolve, reject) => {
    // let closed = false;
    // this._element.addEventListener('canplay', () => {
    //   if (closed) {
    //     return;
    //   }
    //   this._isBuffering = false;
    //   closed = true;
    //   const width = this._element.videoWidth;
    //   const height = this._element.videoHeight;
    //   const tex = new THREE.Texture(this._element);
    //   tex.generateMipmaps = false;
    //   tex.wrapS = THREE.ClampToEdgeWrapping;
    //   tex.wrapT = THREE.ClampToEdgeWrapping;
    //   tex.minFilter = THREE.LinearFilter;
    //   tex.magFilter = THREE.LinearFilter;
    //   this._texture = tex;
    //   this._updateStatus('ready');
    //   resolve({
    //     format: format || '2D',
    //     height,
    //     src,
    //     tex,
    //     width,
    //   });
    // });
    // this._element.addEventListener('error', () => {
    //   if (closed) {
    //     return;
    //   }
    //   this._isBuffering = false;
    //   closed = true;
    //   const error = this._element.error;
    //   const errorStr = error ? error.message : 'Unknown media error';
    //   this._updateStatus('failed', errorStr);
    //   reject(new Error(errorStr));
    // });
    // });
  }

  load(): Promise<TextureMetadata> {
    return this._load || Promise.reject(new Error('No source set'));
  }

  /**
   * image texture needs update when constructed immediately only
   */
  frame() {}

  setVolume(vol: number) {}

  setMuted(muted: boolean) {}

  setLoop(loop: boolean) {
    // this._element.loop = true;
  }

  play() {
    // this._playing = true;
    // this._updateStatus('playing');
    // return Promise.resolve();
  }

  pause() {
    // this._playing = false;
    // this._element.pause();
    // this._updateStatus('paused');
  }

  seekTo(position: number) {
    // this._element.currentTime = position;
    // this._isBuffering = true;
    // this._updateStatus('seeking');
  }

  addEventListener(event: string, listener: onVideoStatusChangedCallback) {
    // this._eventDispatcher.addEventListener(event, listener);
  }

  removeEventListener(event: string, listener: onVideoStatusChangedCallback) {
    // this._eventDispatcher.removeEventListener(event, listener);
  }

  destroy() {
    // this.pause();
    //
  }
}
