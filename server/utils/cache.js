import {redis} from '../configs/redis.js';

async function setCache(key, value, expirationInSeconds=300) {
    try {
        await redis.set(key, JSON.stringify(value), 'EX', expirationInSeconds);
    } catch (error) {
        console.error("❌ Redis Set Error:", error.message);
    }
}

async function getCache(key){
    try{
        const cachedData = await redis.get(key);
        if(cachedData){
            console.log(`🟢 Redis HIT: ${key}`);
            return JSON.parse(cachedData);
        }

        console.log(`🔴 Redis MISS: ${key}`);
        return null;
    }catch(error){
        console.error("❌ Redis Get Error:", error.message);
        return null;
    }
}

async function deleteCache(key){
    try{
        const result = await redis.del(key);
        if(result > 0){
            console.log(`🟢 Redis Deleted: ${key}`);
        }

    }catch(error){
        console.error("❌ Redis Delete Error:", error.message);
    }
}

export {
    setCache,
    getCache,
    deleteCache
}