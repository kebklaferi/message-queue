import amqp from 'amqplib/callback_api.js';
import {plain} from 'amqplib/lib/credentials.js';

const url = 'amqp://localhost:5672/';
const queue = "message-queue";
const username = 'user';
const password = "bitnami";
const options = {
    credentials: plain(username, password)
}
const exchange = "fanout";

amqp.connect(url, options, (error, connection) => {
    if (error) {
        console.error(error)
    }
    connection.createChannel((error, channel) => {
        const messages = ["New message.", "Message 2.", "Message 3."]

        channel.assertExchange(exchange, 'fanout', {durable: false})
        let delay = 0;
        for (const message of messages) {
            sendMessage(channel, message, delay)
            delay += 5000;
        }
    })
    setTimeout(function () {
        connection.close();
        process.exit(0);
    }, 50000);
})

const sendMessage = (channel, message, delay) => {
    setTimeout(() => {
        channel.publish(exchange, '', Buffer.from(message))
        console.log("Sent ", message);
    }, delay)
}