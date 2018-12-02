export type ConstructPlayerMethod<T> = () => T;

export default class PlayerManager<T> {
  _constructPlayerMethod: ConstructPlayerMethod<T>;
  _players: {[handle: string]: VideoPlayer};

  constructor(cpm: ConstructPlayerMethod<T>) {
    this._constructPlayerMethod = cpm;
    this._players = {};
  }

  createPlayer(handle: string) {
    if (this._players[handle]) {
      return this._players[handle];
    }
    const player = this._constructPlayerMethod();
    this._players[handle] = player;
    return player;
  }

  getPlayer(handle: string): ?VideoPlayer {
    return this._players[handle];
  }

  destroyPlayer(handle: string) {
    const player = this._players[handle];
    if (!player) {
      return;
    }
    delete this._players[handle];
    player.destroy();
  }

  frame() {
    for (const handle in this._players) {
      this._players[handle].frame();
    }
  }
}
