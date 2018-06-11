import { Injectable } from "@angular/core";

const IPFS = require("ipfs");
const OrbitDB = require("orbit-db");

@Injectable()
export class DbService {
  private ipfs: any;
  private orbitdb: any;
  private map: any;
  public ready: boolean;

  constructor() {
    this.ipfs = new IPFS();
    this.ready = false;

    this.ipfs.once("ready", async () => {
      this.orbitdb = new OrbitDB(this.ipfs);
      this.ready = true;

      console.log("IPFS is ready");
    });
  }

  get mapId() {
    if (!this.ready || !this.map) {
      return null;
    }

    return this.map.address.toString();
  }

  async create() {
    if (!this.ready) {
      throw new Error("IPFS is not ready.");
    }

    if (this.map) {
      throw new Error("Map has been created.");
    }

    this.map = await this.orbitdb.docs("orbit.map");
    await this.map.load();

    console.log("map address:", this.map.address.toString());
  }

  async join(address: string) {
    if (!this.ready) {
      throw new Error("IPFS is not ready.");
    }

    if (this.map) {
      throw new Error("Map has been created.");
    }

    this.map = await this.orbitdb.docs(address);
    await this.map.load();

    console.log("map address:", this.map.address.toString());
  }
}
