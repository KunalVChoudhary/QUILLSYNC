import { Redis } from "ioredis";

const url = process.env.REDIS_URL;

if (!url) {
  throw new Error("REDIS_URL is not defined");
}

const redis = new Redis(url);

redis.on("connect", () => {
  console.log("Redis Connected");
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});

export default redis;