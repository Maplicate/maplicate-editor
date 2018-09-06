import { Injectable, EventEmitter } from "@angular/core";
import { MaplicateNode } from "maplicate-core";

declare var OrbitDB: any;

@Injectable()
export class DbService {
  private orbitdb: any;
  private maplicate: any;
  private readyEvent: EventEmitter<null>;
  private mapCreatedEvent: EventEmitter<null>;
  private _ready: boolean;
  private _map: MaplicateNode;

  constructor () {
    this._ready = false;
    this.readyEvent = new EventEmitter<null>();
    this.mapCreatedEvent = new EventEmitter<null>();

    const ipfsOptions = {
      EXPERIMENTAL: {
        pubsub: true
      },
      config: {
        Addresses: {
          Swarm: [
            "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
          ]
        }
      }
    };

    const ipfs = new (<any>window).Ipfs(ipfsOptions);

    ipfs.once("ready", async () => {
      this.orbitdb = new OrbitDB(ipfs);
      this._ready = true;
      this.readyEvent.emit();
    });
  }

  public get ready() {
    return this._ready;
  }

  public get map() {
    return this._map;
  }

  public get events() {
    return {
      ready: this.readyEvent,
      mapCreated: this.mapCreatedEvent
    };
  }

  public create (name: string) {
    if (!this._ready) {
      throw new Error("not ready");
    }

    this._map = new MaplicateNode(this.orbitdb, name);
    this.mapCreatedEvent.emit();
  }

  public join (address: string) {
    if (!this._ready) {
      throw new Error("not ready");
    }

    this._map =  new MaplicateNode(this.orbitdb, address);
    this.mapCreatedEvent.emit();
  }

  public async close () {
    if (!this._map) {
      throw new Error("no map");
    }

    await this._map.close();
    this._map = null;
  }
}
