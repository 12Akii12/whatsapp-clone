const express = require('express');
const mongoose = require('mongoose');
const dbMessages = require('./dbMessages.js');
const Pusher = require('pusher');
const cors = require('cors');

//app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1137982",
    key: "69f95b32393e5ac4a9ca",
    secret: "974c771a7f7fca7b2875",
    cluster: "eu",
    useTLS: true
  });

//middlware
app.use(express.json());
app.use(cors());

//DB config
const connection_url = 'mongodb+srv://admin:nJ88TmwGV9DM1Wnx@cluster0.wgx1n.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.once("open", () => {
    console.log("DB is connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        console.log(change);

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted',
            {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            }
            );
        } else {
            console.log('Error triggering Pusher')
        }
    });
});

//api ruotes
app.get('/', (req,res) => {
    res.status(200).send('hello world !!!');
});

app.get('/messages/sync', (req, res) => {
    dbMessages.find((err, data) => {
        if (err) {
            res.status(500).send(data);
        } else {
            res.status(200).send(data);
        }
    });
});


app.post('/messages/new', (req, res) => {
    const dbMessage = req.body

    dbMessages.create(dbMessage, (err, data) => {
        if(err){
            res.status(500).send(err);
        }else {
            res.status(201).send(data);
        }
    });
});


app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
});