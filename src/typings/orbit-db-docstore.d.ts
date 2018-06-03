import IPFS from "ipfs";

export interface IDocStoreOptions {
  indexBy?: string;
  Index?: any;
}

export interface IDoc {
  _id: string;
}

export default class DocStore {
  constructor(
    ipfs: IPFS,
    id: string,
    dbname: string,
    options?: IDocStoreOptions
  );

  events: any;

  get(key: string, caseSensitive?: boolean): any;

  put(doc: IDoc): Promise<string>;

  query(mapper: (doc: IDoc) => boolean): any;

  del(key: string): Promise<IDoc>;
}
