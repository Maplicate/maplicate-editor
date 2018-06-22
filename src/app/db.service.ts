import { Injectable, EventEmitter } from "@angular/core";
import * as IPFS from "ipfs";
import * as OrbitDB from "orbit-db";
import * as md5 from "md5";

@Injectable()
export class DbService {
  private ipfs: any;
  private orbitdb: any;
  private map: any;
  private docMap: any;
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
      const newDocs = this.map.query(doc => !this.docMap[doc._id]);
      const editedDocs = this.map.query(doc => {
        return this.docMap[doc._id] && this.docMap[doc._id].hash !== doc._hash;
      });
      const deletedDocs = [];

      for (const id in this.docMap) {
        if (this.map.get(id).length === 0) {
          deletedDocs.push(id);
          delete this.docMap[id];
        }
      }

      const updates: any = {};

      updates.new = newDocs.map(doc => doc.feature);
      updates.edited = editedDocs.map(doc => doc.feature);
      updates.deleted = deletedDocs;

      this.events.mapReplicated.emit(updates);
    });

    await this.map.load();

    this.docMap = this.map.query(doc => doc).reduce((docMap, doc) => {
      docMap[doc._id] = doc._hash;
      return docMap;
    }, {});

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

    if (!feature.properties._id) {
      throw new Error("Feature ID is undefined.");
    }

    const doc = {
      _id: feature.properties._id,
      _hash: md5(JSON.stringify(feature)),
      feature
    };

    await this.map.put(doc);
  }
}
