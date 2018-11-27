import isMobile from 'ismobilejs';

const ocbReg = /oculus/i;
const mobileVR = /Mobile\sVR/i;

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
