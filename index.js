const express = require("express")
const body_parser = require("body-parser")
const app = express()
const axios = require("axios")
require('dotenv').config()

const my_token = process.env.MY_TOKEN
const webhook_url = process.env.WEBHOOK_URL

app.use(body_parser.json())

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`)
}
)

app.get("/", (req, res) => {

    res.status(200).send("Application to receive webhook from WhatsApp Business API")
})

// Webhook verification
app.get("/webhook", (req, res) => {
  
    let mode=req.query["hub.mode"];
    let challenge=req.query["hub.challenge"];
    let token=req.query["hub.verify_token"];

    if (mode && token) {
        if (mode === "subscribe" && token === my_token) {
            console.log("Webhook verified")
            res.status(200).send(challenge)
        }else{
            console.log("Webhook not verified")
            res.status(403).send("Forbidden")
            
        }

    }
})

app.post("/webhook", (req, res) => {
    let body_param=req.body;

    if (body_param.object === "whatsapp_business_account") {
        let entry = body_param.entry ;   
        console.log("Webhook url : " + webhook_url);   
       
        axios({
            method: 'post',
            url: webhook_url,
            data: entry,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        res.status(200).send("EVENT_RECEIVED")

    }else{
        console.log("Not a whatsapp_business_account")
        console.log(body_param.object)
        res.status(403).send("Forbidden")
    }
    res.status(200).send("EVENT_RECEIVED")
   
})
