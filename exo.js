const { log } = require('console');
const {MongoClient} = require('mongodb'); // create an instance from database
const {ObjectId} = require('mongodb')
const { title } = require('process');
const fs = require('fs').promises;

async function main() {

    // connecting to the database
    const uri = "mongodb://localhost:27017/films";
    const client = new MongoClient(uri);
    const db = client.db();
    try {
            // exo1 ----------------------------------------
        const res = await db.collection('films').find(
            {genre: "Aventure", "director.last_name": "Spielberg"},
            { projection: { title: 1, _id: 0 } }
        ).toArray();
        // console.log(res);

        const res01= await db.collection('films').find({
            $and : [
                {"director.last_name" : "Spielberg"}, 
                {"genre" : "Aventure"}
            ]
        }).  project({"title" : true})

        .toArray(); 
        // console.log(res01);

        // exo2 --------------------------------------------
        const res2 = await db.collection('films').find(
            {year: 2000},
            { projection: { title: 1, _id: 0 } }
        ).toArray();
        // console.log(res2);
        // exo3 --------------------------------------------
        const res3 = await db.collection('films').find(
            {genre: 'Action'},
            { projection: { title: 1, _id: 0 } }
        ).toArray();
        // console.log(res3);
        // exo4 ---------------------------------------------
        const res4 = await db.collection('films').distinct('genre');
        // console.log('the Genres Are: ', res4, 'unique genres are: ', res4.length);
        // exo5 ----------------------------------------------
        const res5 = await db.collection('films').find(
            {country: 'FR'},
            {projection: {title: 1, year: 1, _id: 0}}
        ).toArray();
        // console.log(res5);
        // exo6-------------------------------------------------
        const res6 = await db.collection('films').find(
            {'actors.first_name': 'Uma', 'actors.last_name': 'Thurman'},
            {projection: {title: 1, year: 1, _id: 0}}
        ).toArray();
        // console.log(res6);
        // exo7 --------------------------------------------------
        const res7 = await db.collection('films').find(
            {title: 'Memento'},
            {projection: {'director.first_name': 1 , 'director.last_name': 1, _id: 0}}
        ).toArray();
        // const directors = res7.map(doc => `${doc.director.first_name} ${doc.director.last_name}`);
        // console.log(res7);
        // exo8 --------------------------------------------------------
        const res8 = await db.collection('films').find(
            {title: 'Apocalypse Now'},
            {projection: {actors: 1, _id: 0}}            
        ).toArray();
        const actors = res8.map(doc =>
            doc.actors.map(actor => `${actor.first_name} ${actor.last_name}`)
        );
        // console.log('The actors are: ' + actors);
        // exo9-------------------------------------------------------------
        const res9 = await db.collection('films').find(
            {year: {$gte: 1968, $lte:1978}},
            {projection: {title: 1, year: 1, _id: 0}}  
        ).toArray();
        // console.log(res9);
        // exo10--------------------------------------------------------
        const res10 = await db.collection('films').find(
            {year: {$lte: 1968}},
            {projection: {title: 1, year: 1, _id: 0}}
        ).toArray();
        // console.log(res10);

        const res100 = await db.collection('films').find(
            {year: {$ne: 1968}},
            {projection: {title: 1, year: 1, _id: 0}}
        ).toArray();
        // console.log(res100);
        // exo11------------------------------------------------------
        const res11 = await db.collection('films').find(
            {year: {$ne: 1968}},
            {projection: {title: 1, year: 1, _id: 0}}
        ).sort({year: -1}).toArray();
        // console.log(res11);
        const res011 = await db.collection('films').find(
            {year: {$ne: 1968}},
            {projection: {title: 1, year: 1, _id: 0}}
        ).sort({year: -1}).limit(5).toArray();
        // console.log(res011);
        // exo12-------------------------------------------------------
        const res12 = await db.collection('films').find(
            // {genre: { $in: ['Action', 'Aventure'] } },
            {
                $or: [
                    { genre: 'Action' },
                    { genre: 'Aventure' }
                ]
            },
            {projection: {title: 1, genre: 1, _id: 0}}
        ).toArray();
        // console.log(res12);
        // exo13 -----------------------------------------------
        const res13 = await db.collection('films').find(
            {
                'director.last_name': { $nin: ['Tarantino'] }
            },
            {
                projection: {title: 1, 'director.last_name': 1, _id: 0}
            }
        ).toArray();
        // console.log(res13);
        // exo14-------------------------------------------------------
        const res14 = await db.collection('films').aggregate([
            {
                $group: {
                    _id: '$genre', 
                    count: { $sum: 1 }
                }
            },
        ]).toArray();
        // console.log(res14);
        // exo15----------------------------------------------
        const res15 = await db.collection('films').countDocuments({
            year: {$gte: 2000}
        })
        // console.log(res15);
        // exo16-------------------------------------------------
        const res16 = await db.collection('films').find(
            {
                summary: {$regex: 'la guerre du Vietnam', $options: 'i'}
            },
            {
                projection: {title: 1, year: 1, _id: 0}
            }
        ).toArray();
        // console.log(res16);
        // exo 17--------------------------
        const res17 = await db.collection('films').find(
            {'actors.first_name': 'Robert', 'actors.last_name': 'Redford'},
            {projection: {title: 1, _id: 0}}
        ).toArray();

        const res177 = await db.collection('films').aggregate([
            {
                $match: {
                    'actors.first_name': 'Robert',
                    'actors.last_name': 'Redford'
                }
            },
            {
                $project: {
                    title: 1,
                    _id: 0
                }
            }
        ]).toArray();
        // console.log(res177);
        // exo18--------------------------------------------
        const res18 = await db.collection('films').aggregate([
            {
                $match: {
                    summary: { $regex: 'famille', $options: 'i' }
                }
            },
            {
                $project: {
                    title: 1,
                    _id: 0
                }
            } 
        ]).toArray();
        // console.log(res18);
        // exo19 ---------------------------------------------------------------
        const res19 = await db.collection('films').updateOne(
            {
                title: 'La Guerre des étoiles'
            },
            {
                $set: {year: 1978}
            }
        )
        // console.log(res19);
        // exo20-------------------------------------------------------------
        const res20 = await db.collection('films').find(
            {
                'actors.first_name': 'Clint', 'actors.last_name': 'Eastwood'
            },
            {
                projection: {title: 1, _id: 0}
            }
        ).toArray();
        // console.log(`Film Title:`,  res20);
        // exo21---------------------------------------------------
        const res21 = await db.collection('films').find(
            {
                genre: 'Science-Fiction'
            },
            {
                projection: {title: 1, _id: 0}
            }
        ).toArray();

        res21.forEach((film, index) => {
            // console.log(`${index + 1}: ${film.title}`);
        });
        // exo22-------------------------------------------------------
        const res22 = await db.collection('films').insertOne(
            {
                title: 'Pixels',
                year: 2005,
                genre: 'Comedy',
                country: 'US',
                director: {
                    _id: new ObjectId(),
                    last_name: "Columbus",
                    first_name: "Chris"
                },
            }
        )
        // console.log(res22);
        // exo23---------------------------------------------------------
        const res23 = await db.collection('films').updateOne(
            {
                title: 'Le Parrain'
            },
            {
                $addToSet: {
                    actors: {
                        last_name: "Keaton",
                        first_name: "Diane",
                        birth_date: 1946
                    }
                } 
            }
        )
        // console.log(res23);
        // exo24------------------------------------------------------------
        const res24 = await db.collection('films').updateOne(
            {
                title: 'Le Parrain'
            },
            {
                $addToSet: {
                    actors: {
                        $each: [
                        {
                            last_name: "Cazale",
                            first_name: "John",
                            birth_date: 1935
                        },
                        {
                            last_name: "Conte",
                            first_name: "Richard",
                            birth_date: 1910
                        }
                        ]
                    }
                }
            }
        )
        // console.log(res24);
        // exo25----------------------------------------------------------------
        const res25 = await db.collection('films').deleteOne(
            {
                title: 'Impitoyable'
            }
        )
        // console.log(res25);
        // eso26-----------------------------------------------------------------
        const res26 = await db.collection('films').deleteMany(
            {
                year: 1970
            }
        )
        // console.log(res26);
        // exo27-------------------------------------------------------------------
        const res27 = await db.collection('films').updateMany(
            {
                genre: 'Science Fiction'
            },
            {
                $set: {
                genre: 'Science-Fiction'
                }
            }   
        )
        console.log(res27);
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        

    }
    catch(e) {
        console.error(e);        
    }
    finally{
        await client.close();
    }
}
main().catch(console.error);
