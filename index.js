const express = require("express")
const body_parser = require("body-parser")
const app = express()
require('dotenv').config()
const port = process.env.PORT 
const token = process.env.TOKEN
const my_token = process.env.MY_TOKEN


// get the server url access from the environment variables

const server_url = process.env.SERVER_URL

const  localhost = server_url +":" + port
app.use(body_parser.json())

app.listen(port, () => console.log(`Listening on port ${port} \r \n${localhost}`))
app.get("/", (req, res) => {
    res.send(`Access the webhook at ${localhost}/webhook`)
})
app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"]
    let token = req.query["hub.verify_token"]
    let challenge = req.query["hub.challenge"]
    if (mode && token) {
        if (mode === "subscribe" && token === my_token) {
            console.log("Webhook verified")
            res.status(200).send(challenge)
        }else{
            res.sendStatus(403)
            console.log("Webhook not verified")
        }

    }
})

app.post("/webhook", (req, res) => {
    let body_param=req.body;
    console.log(JSON.stringify(body_param,null,2));
    console.log("====================================");
    console.log(body_param.object);
    console.log("====================================");
    console.log(body_param.entry[0].messaging[0].sender.id);
    console.log("====================================");
    console.log(body_param.entry[0].messaging[0].message.text);
    console.log("====================================");
    console.log(res);
    console.log("====================================");
    
    if (body_param.object === "page") {
    }
   
})