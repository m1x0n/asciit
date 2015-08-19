<?php

namespace App\WebSocket\Delivery;

use ZMQ;
use App\WebSocket\Contracts\HttpToWampDelivery;

/*
 *  Deliver a message from HTTP server to the WAMP server
 */
class ZeroMQDelivery implements HttpToWampDelivery
{
    private $socket;

    public function __construct()
    {
        $context = new \ZMQContext();
        $this->socket = $context->getSocket(ZMQ::SOCKET_PUSH, 'my pusher');
    }

    public function send($data, $port='9091')
    {
        $this->socket->connect("tcp://127.0.0.1:{$port}");
        $this->socket->send(json_encode($data));
    }
}