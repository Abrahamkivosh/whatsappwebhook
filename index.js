const express = require("express")
const body_parser = require("body-parser")
const app = express()
const axios = require("axios")
require('dotenv').config()

const my_token = process.env.MY_TOKEN
const webhook_url = process.env.WEBHOOK_URL

app.use(body_parser.json())

app.listen( () => console.log(`Server running `))
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
    if (body_param.object === "whatsapp_business_account") {
        let entry = body_param.entry ;      
        axios.post(webhook_url, entry).then(response=>{
            console.log(response.data)
        }).catch(err=>{
            console.log(err)
        })
    }
    res.status(200).send("EVENT_RECEIVED")
   
})
