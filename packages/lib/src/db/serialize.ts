export interface MongoDoc {
  _id: unknown;
  __v?: number;
  [key: string]: unknown;
}

export interface SerializedDoc {
  id: string;
  [key: string]: unknown;
}

export function serialize(doc: MongoDoc): SerializedDoc {
  const { _id, __v, ...rest } = doc;
  return { id: String(_id), ...rest };
}

export function serializeArray(docs: MongoDoc[]): SerializedDoc[] {
  return docs.map(serialize);
}
