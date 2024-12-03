const { log } = require('console');
const {MongoClient} = require('mongodb'); // create an instance from database
const { title } = require('process');
const fs = require('fs').promises;

async function main() {

    // connecting to the database
    const uri = "mongodb://localhost:27017/films";
    const client = new MongoClient(uri);
    const db = client.db();
    try {
        
        // exo1 --------------------------------------------
        const res1 = await db.collection('exploitation').find(
            {
                'Box_office_fr': {
                    $exists: true
                }
            },
            {
                projection: {
                    title: 1, Box_office_fr: 1, _id: 0
                }
            }
        ).toArray();
        // console.log(res1);
        // exo2-----------------------------------------------
        const res2 = await db.collection('exploitation').aggregate([
            {
                $group: {
                    _id: 'Box_office_fr',
                    total: {
                        $sum: '$Box_office_fr'
                    }
                }
            }
        ]).toArray();
        // console.log(res2);
        const res3 = await db.collection('films').aggregate([
            {
                $lookup: {
                    from: 'exploitation',
                    localField: 'title',
                    foreignField: 'title',
                    as: 'joinTwo'
                }
            },
            {
                $match: {
                'director.last_name': 'Scott',
                'director.first_name': 'Ridley'
                }
            },
            {
                $unwind: '$joinTwo' 
            },
            {
                $project: {
                    title: 1,
                    'joinTwo.Box_office_fr': 1,
                    'joinTwo.Box_office_us': 1,
                    _id: 0
                }
            }
        ]).toArray();
        // console.log(res3);
        // exo4------------------------------------------------------------------
        const res4 = await db.collection('films').aggregate([
            {
                $lookup: {
                    from: 'exploitation',
                    localField: 'title',
                    foreignField: 'title',
                    as: 'joinTwo'
                }
            },
            {
                $unwind: '$joinTwo' 
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    'joinTwo.Box_office_fr': 1,
                    'joinTwo.Box_office_us': 1,
                    actors: 1
                }
            }
        ]).toArray();
        // res4.forEach(film => {
        //     console.log(`Titre: ${film.title}`);
        //     console.log(`Box Office (FR): ${film.joinTwo.Box_office_fr}`);
        //     console.log(`Box Office (US): ${film.joinTwo.Box_office_us}`);
        
        //     film.actors.forEach(actor => {
        //         console.log(`Nom Complet: ${actor.first_name} ${actor.last_name}, Age: ${new Date().getFullYear() - actor.birth_date}`);
        //     })
        //     console.log(`---------------------`);
            
        // })
        // exo5-------------------------------------------
        const res5 = await db.collection('films').aggregate([
            {
                $lookup: {
                    from: 'exploitation',
                    localField: 'title',
                    foreignField: 'title',
                    as: 'joinTwo'
                }
            },
            {
                $unwind: '$joinTwo' 
            },
            // {
            //     $group: {
            //         $match
            //     }
            // },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    'joinTwo.Box_office_fr': 1,
                    'joinTwo.Box_office_us': 1,
                    actors: 1
                }
            }
        ]).toArray();
        const currentYear = new Date().getFullYear();
const filteredResults = res5.filter(film => {
    if (film.actors && film.actors.length > 0) {
        // Calculate average age of actors
        const averageAge = film.actors.reduce((sum, actor) => {
            return sum + (currentYear - actor.birth_date);
        }, 0) / film.actors.length;
        
        return averageAge < 70; // Filter condition for average age less than 70
    }
    return false; // Skip films with no actors
});

// Print filtered results
filteredResults.forEach(film => {
    console.log({
        title: film.title,
        box_office_fr: film.joinTwo.Box_office_fr,
        box_office_us: film.joinTwo.Box_office_us
    });
});


    }
    catch(e) {
        console.error(e);        
    }
    finally{
        await client.close();
    }
}
main().catch(console.error);
