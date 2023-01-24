const express = require("express")
const body_parser = require("body-parser")
const app = express()
require('dotenv').config()
const port = process.env.PORT || 80
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
    let body = req.body
    if (body.object) {
        body.entry.forEach(entry => {
            let phone_no_id = entry.changes[0].value.metadata.phone_number_id
            let from = entry.changes[0].value.messages[0].from
            let message_body = entry.changes[0].value.messages[0].text.body
            console.log(entry)
            axios({
                method: "post",
                url: "https://graph.facebook.com/v15.0/"+ phone_no_id + "/messages",
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    text:{
                        body: "Hello, I am a bot. You sent me this message: " 
                    },
                    language: "en_US"
                },
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "authorization": "Bearer " + token
                }
            });
            res.sendStatus(200)
            console.log("Message sent")
        })
        res.status(200).send("EVENT_RECEIVED")
    }else{
        res.sendStatus(404)
    }
})