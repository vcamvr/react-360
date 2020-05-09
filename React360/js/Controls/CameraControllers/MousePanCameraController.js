/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

import { type Quaternion, type Vec3 } from '../Types';
import { type CameraController } from './Types';
import {React360Options} from './../../ReactInstance'
const DEFAULT_FOV = Math.PI / 3;
const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI / 2;
const DEFAULT_Y_ROTATION_DELATA = 0.0004;

let _offsetYaw = 0;
let _offsetPitch = 0;

export default class MousePanCameraController implements CameraController {
  _deltaYaw: number;
  _deltaPitch: number;
  _draggingMouse: boolean;
  _draggingTouch: boolean;
  _enabled: boolean;
  _frame: HTMLElement;
  _lastMouseX: number;
  _lastMouseY: number;
  _lastTouchX: number;
  _lastTouchY: number;
  _verticalFov: number;
  _DEFAULT_Y_ROTATION_DELATA:number

  constructor(frame: HTMLElement, fov: number = DEFAULT_FOV,options:React360Options) {
    
    
    this._deltaYaw = 0;
    this._deltaPitch = 0;
    this._draggingMouse = false;
    this._draggingTouch = false;
    this._enabled = true;
    this._frame = frame;
    this._lastMouseX = 0;
    this._lastMouseY = 0;
    this._lastTouchX = 0;
    this._lastTouchY = 0;
    this._verticalFov = fov;
    this._options=options;
    let speed=options.speed
    if(!speed)speed=1;
    this._DEFAULT_Y_ROTATION_DELATA=speed *DEFAULT_Y_ROTATION_DELATA;
    (this: any)._onMouseDown = this._onMouseDown.bind(this);
    (this: any)._onMouseMove = this._onMouseMove.bind(this);
    (this: any)._onMouseUp = this._onMouseUp.bind(this);
    (this: any)._onTouchStart = this._onTouchStart.bind(this);
    (this: any)._onTouchMove = this._onTouchMove.bind(this);
    (this: any)._onTouchEnd = this._onTouchEnd.bind(this);
    this._frame.addEventListener('mousedown', this._onMouseDown);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);
    this._frame.addEventListener('touchstart', this._onTouchStart);
    this._frame.addEventListener('touchmove', this._onTouchMove);
    this._frame.addEventListener('touchcancel', this._onTouchEnd);
    this._frame.addEventListener('touchend', this._onTouchEnd);
  }

  _onMouseDown(e: MouseEvent) {
    if (!this._enabled) {
      return;
    }
    this._draggingMouse = true;
    this._lastMouseX = e.clientX;
    this._lastMouseY = e.clientY;
    this.pauseInitMove();
  }

  _onMouseMove(e: MouseEvent) {
    if (!this._draggingMouse) {
      return;
    }
    const width = this._frame.clientWidth;
    const height = this._frame.clientHeight;
    const aspect = width / height;
    const deltaX = e.clientX - this._lastMouseX;
    const deltaY = e.clientY - this._lastMouseY;
    this._lastMouseX = e.clientX;
    this._lastMouseY = e.clientY;
    this._deltaPitch += deltaX / width * this._verticalFov * aspect;
    this._deltaYaw += deltaY / height * this._verticalFov;
  }

  _onMouseUp() {
    this._draggingMouse = false;
  }

  _onTouchStart(e: TouchEvent) {
    if (!this._enabled) {
      return;
    }
    this._draggingTouch = true;
    this._lastTouchX = e.changedTouches[0].clientX;
    this._lastTouchY = e.changedTouches[0].clientY;
    this.pauseInitMove();
  }

  _onTouchMove(e: TouchEvent) {
    if (!this._draggingTouch) {
      return;
    }
    const x = e.changedTouches[0].clientX;
    const y = e.changedTouches[0].clientY;
    const width = this._frame.clientWidth;
    const height = this._frame.clientHeight;
    const aspect = width / height;
    const deltaX = x - this._lastTouchX;
    const deltaY = y - this._lastTouchY;
    this._lastTouchX = x;
    this._lastTouchY = y;
    let ratio = window.devicePixelRatio || 2;
    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      this._deltaPitch += deltaX / width * this._verticalFov * aspect * ratio * 2;
      // _offsetPitch += deltaX / width * this._verticalFov * aspect * ratio;
      // if (_offsetPitch > TWO_PI) {
      //   _offsetPitch -= TWO_PI;
      // }
      // if (_offsetPitch < - TWO_PI){
      //   _offsetPitch += TWO_PI;
      // }
    } else {
      this._deltaYaw += deltaY / height * this._verticalFov * 2;
      _offsetYaw += deltaY / height * this._verticalFov * 2;
      if (_offsetYaw > HALF_PI) {
        this._deltaYaw = 0;
        _offsetYaw = HALF_PI;
      }
      if (_offsetYaw < -HALF_PI) {
        this._deltaYaw = 0;
        _offsetYaw = -HALF_PI;
      }
    }


  }

  static getOffset() {
    return {
      offsetYaw: _offsetYaw,
      offsetPitch: _offsetPitch,
    }
  }

  _onTouchEnd(e: TouchEvent) {
    this._draggingTouch = false;
  }

  _autoMove() {
    
    if (this.initMove === 1) {
      this._deltaPitch -= this._DEFAULT_Y_ROTATION_DELATA;
    }
  }

  startInitMove() {
    if (this.initMove === undefined || this.initMove > -1) {
      this.initMove = 1;
    }
  }

  pauseInitMove() {
    if (this.initMove > -1) {
      this.initMove = 0;
    }
  }

  stopInitMove() {
    this.initMove = -1;
  }

  enable() {
    this._enabled = true;
    this._draggingMouse = false;
    this._draggingTouch = false;
  }

  disable() {
    this._enabled = false;
    this._draggingMouse = false;
    this._draggingTouch = false;
  }

  resetRotation() {
    this._deltaYaw = 0;
    this._deltaPitch = 0;
  }

  fillCameraProperties(position: Vec3, rotation: Quaternion): boolean {

    if (!this._enabled) {
      return false;
    }
    this._autoMove();
    if (this._deltaPitch === 0 && this._deltaYaw === 0) {
      return false;
    }

    // premultiply the camera rotation by the horizontal (pitch) rotation,
    // then multiply by the vertical (yaw) rotation

    const cp = Math.cos(this._deltaPitch / 2);
    const sp = Math.sin(this._deltaPitch / 2);
    const cy = Math.cos(this._deltaYaw / 2);
    const sy = Math.sin(this._deltaYaw / 2);

    const x1 = rotation[0];
    const y1 = rotation[1];
    const z1 = rotation[2];
    const w1 = rotation[3];

    const x2 = cp * x1 + sp * z1;
    const y2 = cp * y1 + sp * w1;
    const z2 = cp * z1 - sp * x1;
    const w2 = cp * w1 - sp * y1;

    const x3 = w2 * sy + x2 * cy;
    const y3 = y2 * cy + z2 * sy;
    const z3 = -y2 * sy + z2 * cy;
    const w3 = w2 * cy - x2 * sy;

    rotation[0] = x3;
    rotation[1] = y3;
    rotation[2] = z3;
    rotation[3] = w3;
    this._deltaPitch = 0;
    this._deltaYaw = 0;
    return true;
  }
}
