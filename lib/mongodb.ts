import mongoose from 'mongoose';

const MONGODB_USERNAME = process.env.MONGODB_USERNAME || '';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || '';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || '';
const MONGODB_HOST = process.env.MONGODB_HOST || '';
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;

const MONGODB_URI =
  process.env.MONGODB_PORT ||
  `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`;

// @ts-ignore
let cached = global.mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  // @ts-ignore
  global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export function documentToJson<T>(document: T): any {
  return JSON.parse(JSON.stringify(document));
}
