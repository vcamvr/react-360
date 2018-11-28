import isMobile from 'ismobilejs';
import type ResourceManager from './ResourceManager';
import type {TextureMetadata} from '../Compositor/Environment/Types';
import type {PanoOptions} from '../Compositor/Video/Types';

const ocbReg = /oculus/i;
const mobileVR = /Mobile\sVR/i;

export const DEFAULT_FORMAT = '2D';
export const DEFAULT_UV = {
  phiStart: 0,
  phiLength: Math.PI * 2,
  thetaStart: 0,
  thetaLength: Math.PI,
};

export function isMobileBrowser(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  if (ocbReg.test(ua) || mobileVR.test(ua)) {
    return false;
  }
  return isMobile.any;
}

/**
 * Promise-ify image loading, used as a backup when no TextureManager is used
 */
export function loadImage(src: string): Promise<Image> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      resolve(img);
    };
    img.onerror = function(err: any) {
      reject(err);
    };

    img.src = src;
  });
}

/**
 * Promise-ify texture loading
 */
export function loadTexture(
  src: string,
  options: PanoOptions,
  rm: ?ResourceManager
): Promise<TextureMetadata> {
  if (rm) {
    rm.addReference(src);
  }

  return (rm ? rm.getResourceForURL(src) : loadImage(src)).then(img => {
    const tex = new THREE.Texture(img);
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return {
      src,
      tex,
      width: img.width,
      height: img.height,
      format: DEFAULT_FORMAT,
      uv: DEFAULT_UV,
      maxLevel: 2,
      ...options,
    };
  });
}
