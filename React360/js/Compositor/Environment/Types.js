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

import * as THREE from 'three';
import type {PanoOptions} from '../Video/Types';

export type SphereMetadata = {
  phiStart: number,
  phiLength: number,
  thetaStart: number,
  thetaLength: number,
};

export type TextureMetadata = PanoOptions & {
  width: number,
  height: number,
  src: string,
  tex: THREE.Texture,
};
