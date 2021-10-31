const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const app = express();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT|| 5000;

//middlewars
app.use(cors());
app.use(express.json());

//Crud operation start here
const uri = "mongodb+srv://Travels:RYwdB1z4HBkrq4iE@mydatabase.jdlyw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run(){
    
    try{
        await client.connect();
        console.log('database connected successfully')
        const database = client.db("crimson");
        const serviceCollection = database.collection("service");
        const orderCollection = database.collection("orders");

        //get services
         app.get('/service',async(req, res)=>{
            const cursor = serviceCollection.find({});
            const service= await cursor.toArray();
            res.send(service)
          })
        
        //get single service
         app.get('/service/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await serviceCollection.findOne(query);
        res.json(service)
     })
        //order service
       app.post('/Orders', async (req, res)=>{
           const order = req.body;
           console.log(order)
           const result = await orderCollection.insertOne(order);
           res.json(result)
       })
       //get order
       app.get('/Orders', async (req, res)=>{
        const cursor = orderCollection.find({});
        const service= await cursor.toArray();
        res.send(service)
       })
       //delete api
       app.delete('/Orders/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await orderCollection.deleteOne(query);
        console.log("deleting order with id",id);
        res.json(result);
        })
 }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res)=>{
    res.send('this is crismon server')
})

app.listen(port, ()=>{
    console.log('listing the port', port)
})