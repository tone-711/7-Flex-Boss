import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";


export default function getDb(uri, dbName) {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        });
        
    return client.db("7FlexDB");
}
