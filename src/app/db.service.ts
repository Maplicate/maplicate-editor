/// <reference path="../typings/orbit-db.d.ts"/>

import { Injectable } from "@angular/core";

import { IPFS } from "ipfs";
import OrbitDB from "orbit-db";

@Injectable()
export class DbService {
  private ipfs: any;

  constructor() {
    this.ipfs = new IPFS();

    this.ipfs.on("ready", async () => {
      const orbitdb = new OrbitDB(this.ipfs);
      const db = await orbitdb.docs("hello");
    });
  }
}
