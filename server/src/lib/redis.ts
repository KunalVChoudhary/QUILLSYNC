import { Redis } from "ioredis";

const url = process.env.REDIS_URL;

if (!url) {
  throw new Error("REDIS_URL is not defined");
}

const redis = new Redis(url);

export const subscriber = redis.duplicate()
export const publisher = redis.duplicate()

for (const client of [redis, publisher, subscriber]) {
  client.on("connect", () => console.log("Redis Connected"));
  client.on("error", (err) => console.error("Redis Error:", err));
}
export default redis;