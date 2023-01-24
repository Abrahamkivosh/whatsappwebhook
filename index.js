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
    // console.log(JSON.stringify(body_param,null,2));
    // console.log("====================================");
    // console.log(body_param.object);
    // console.log("====================================");
  
    if (body_param.object === "whatsapp_business_account") {
        let entry = body_param.entry
        entry.forEach((entry) => {
            let app_id = entry.app_id
            let Phone_number_ID = entry.changes.value.metadata.phone_number_id
            let Phone_number = entry.changes.value.metadata.phone_number

            let message = entry.changes.value.messages[0].text.body
            let message_id = entry.changes.value.messages[0].id
            let message_type = entry.changes.value.messages[0].type
            let message_timestamp = entry.changes.value.messages[0].timestamp
            let message_from = entry.changes.value.messages[0].from

            console.log("====================================");

            axios.post(`https://graph.facebook.com/v15.0/${Phone_number_ID}/messages`, {
                "messaging_product": "whatsapp",
                "to": message_from,
                "language": "en",
                "text": "Hello, I am a bot"+message + " " + message_id + " From "+ message_from 
                }, {
                headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
                }
           
            }).then((response) => {
                console.log(response.data)
            }).catch((error) => {
                console.error(error)
            })

        })
       
    }
    res.status(200).send("EVENT_RECEIVED")
   
})