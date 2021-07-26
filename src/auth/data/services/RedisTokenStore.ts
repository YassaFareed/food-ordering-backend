import { RedisClient } from "redis";
import ITokenStore from "../../services/ITokenStore";
import { promisify } from "util";

//this is the redis token store
export default class RedisTokenStore implements ITokenStore{

    constructor(private readonly client: RedisClient){}

    save(token: string): void {
       this.client.set(token, token)
    }
    async get(token: string): Promise<string> {
        const getAsync = promisify(this.client.get).bind(this.client)
        const res = await getAsync(token)
        return res ?? ''
    }
    
}