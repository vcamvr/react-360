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

import BrowserVideoPlayer from './BrowserVideoPlayer';
import type {PlayerManager} from './PlayerManager';
import type {VideoPlayer} from './Types';

/**
 * Simple utility class for organizing Video Players by their handle
 */
export default class VideoPlayerManager extends PlayerManager<VideoPlayer> {
  constructor() {
    super(() => new BrowserVideoPlayer());
  }
}
