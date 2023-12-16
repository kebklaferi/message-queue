import amqp from 'amqplib/callback_api.js';
import {plain} from "amqplib/lib/credentials.js";

const url = 'amqp://localhost:5672/';
const queue = "message-queue";
const username = 'user';
const password = "bitnami";
const options = {
    credentials: plain(username, password)
}

amqp.connect(url, options,(error, connection) => {
    if (error) {
        console.error(error)
    }
    connection.createChannel((error, channel) => {
        if (error) {
            console.error(error)
        }
        channel.assertQueue(queue, {
            durable: false
        })
        console.log("Waiting for messages in ", queue);

        channel.consume(queue, (message) => {
            if(message){
                console.log("Received: ", message.content.toString());
                setTimeout(() => {
                    channel.ack(message);
                    console.log("Message acknowledged.")
                }, 1000)
            }
        })
    })
})