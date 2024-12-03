const { log } = require('console');
const {MongoClient} = require('mongodb'); // create an instance from database
const fs = require('fs').promises;

async function main() {

    // connecting to the database
    const uri = "mongodb://localhost:27017/films";
    const client = new MongoClient(uri);
    const db = client.db();
    try {
        const data = JSON.parse(await fs.readFile('films.json', 'utf-8'));
        await client.connect();

            const collection = db.collection('films');
            await collection.insertMany(data);
            console.log(`Documents imported successfully into the "films" collection`);           
        

    }
    catch(e) {
        console.error(e);        
    }
    finally{
        await client.close();
    }
}
main().catch(console.error);
