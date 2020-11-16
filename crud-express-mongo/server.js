const express = require("express");
const app = express();

/**
 * pro chytání dat z inputu
 * */
const bodyParser = require('body-parser')

var connectionString = "mongodb+srv://root:root@cluster0.veums.mongodb.net/PrvniProjekt?retryWrites=true&w=majority\n";
const MongoClient = require('mongodb').MongoClient

MongoClient.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(client => {
        const db = client.db('PrvniProjekt')
        const quotesCollection = db.collection('quotes')
        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({ extended: true }))
        /* read JSON data */
        app.use(bodyParser.json())
        app.use(express.static('public'))

        app.listen(8000, () => {
            console.log("listening to port 8000");
        });

        app.get('/', (req, res) => {
            quotesCollection.find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
                .catch(error => console.error(error))
        })

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        });

        /* pro update PUT */
        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: 'prvni' },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                /* jestliže žádný neexistuje, vytvoří se */
                {
                    upsert: true
                },
            )
                .then(result => {
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name },
            )
            .then(result => {
                if(result.deletedCount === 0){
                    res.json('No quote to delete')
                }
                res.json('Delete quote')
            })
            .catch(error => console.error(error))
        })

    })
    .catch(console.error)



