const {MongoClient} = require('mongodb');

import { secrets } from './secrets.json';

async function main(){
    let username = secrets.username;
    let password = secrets.password;
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://${username}:${password}@cluster0.ct7oi.mongodb.net/?retryWrites=true&w=majority";
 

    const client = new MongoClient(uri);

    async function listDatabases(client){
        databasesList = await client.db().admin().listDatabases();
     
        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    };    
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await  listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);