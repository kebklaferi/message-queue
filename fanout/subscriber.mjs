import amqp from 'amqplib/callback_api.js';
import {plain} from "amqplib/lib/credentials.js";

const url = 'amqp://localhost:5672/';
const username = 'user';
const password = "bitnami";
const options = {
    credentials: plain(username, password)
}
const exchange = "fanout";

amqp.connect(url, options,(error, connection) => {
    if (error) {
        console.error(error);
    }
    connection.createChannel((error, channel) => {
        if (error) {
            console.error(error);
        }
        channel.assertExchange(exchange, 'fanout', {durable: false});
        channel.assertQueue('', { exclusive: true }, (error, queue) => {
            if (error) {
                console.error(error);
            }
            channel.bindQueue(queue.queue, exchange, '');
            console.log('Waiting for messages.');

            channel.consume(queue.queue, (message) => {
                if (message !== null) {
                    console.log("Received: ", message.content.toString());
                    setTimeout(() => {
                        channel.ack(message);
                        console.log("Message acknowledged.");
                    }, 1000)
                }
            });
        });
    })
})