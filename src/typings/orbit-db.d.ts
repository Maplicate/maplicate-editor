import IPFS from "ipfs";
import DocStore, { IDocStoreOptions } from "./orbit-db-docstore";

export default class OrbitDB {
  constructor(ipfs?: IPFS);

  docs(address: string, options?: IDocStoreOptions): Promise<DocStore>;
}
