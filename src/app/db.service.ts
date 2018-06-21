import { Injectable, EventEmitter } from "@angular/core";
import * as IPFS from "ipfs";
import * as OrbitDB from "orbit-db";

@Injectable()
export class DbService {
  private ipfs: any;
  private orbitdb: any;
  private map: any;
  private featureSet: Set<string>;
  public ready: boolean;
  public events: any;

  constructor() {
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

    this.ipfs = new IPFS(ipfsOptions);
    this.ready = false;
    this.events = {
      mapReady: new EventEmitter(),
      mapReplicated: new EventEmitter()
    };

    this.ipfs.once("ready", async () => {
      this.orbitdb = new OrbitDB(this.ipfs);
      this.ready = true;

      console.log("IPFS is ready");
    });
  }

  get mapAddress(): string {
    if (!this.ready || !this.map) {
      return null;
    }

    return this.map.address.toString();
  }

  async createMap(name: string): Promise<string> {
    if (!this.ready) {
      throw new Error("IPFS is not ready.");
    }

    if (this.map) {
      throw new Error("Map has been created.");
    }

    this.map = await this.orbitdb.docs(name, { write: ["*"] });
    this.map.events.on("replicated", () => {
      const newFeatures = this.map.query(doc => !this.featureSet.has(doc._id));

      for (const feature of newFeatures) {
        this.featureSet.add(feature._id);
      }

      this.events.mapReplicated.emit(newFeatures);
    });

    await this.map.load();

    const ids = this.map.query(doc => true).map((doc: any) => doc._id);

    this.featureSet = new Set(ids);
    this.events.mapReady.emit();

    return this.map.address.toString();
  }

  async joinMap(address: string): Promise<string> {
    return this.createMap(address);
  }

  async addFeature(feature): Promise<any> {
    if (!this.map) {
      throw new Error("Map is not created.");
    }

    if (!feature._id) {
      throw new Error("Feature ID is undefined.");
    }

    await this.map.put(feature);
  }
}
