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
    let body_param = req.body
    console.log(JSON.stringify(body_param, null, 2))
    if (body_param.object ) {
        console.log("Webhook event")
        let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
        let from = body_param.entry[0].changes[0].value.messages[0].from; 
        let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

        axios({
            method:"POST",
            url:"https://graph.facebook.com/v13.0/"+phon_no_id+"/messages?access_token="+token,
            data:{
                messaging_product:"whatsapp",
                to:from,
                text:{
                    body:"Hi.. I'm Prasath, your message is "+msg_body
                }
            },
            headers:{
                "Content-Type":"application/json"
            }

        });

        res.sendStatus(200);

       

    }else{
        res.sendStatus(404);
    }
    
   
})