/**
 * Copyright 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function WhiteBoard(config) {
    if (typeof config === 'undefined') {
        throw {message: "Configuration is required"};
    } else if (typeof config.host === 'undefined') {
        throw {message: "Host is required"};
    } else if (typeof  config.port === 'undefined') {
        throw {message: "Port is required"};
    } else if (typeof config.container === 'undefined' || !(config.container instanceof HTMLElement)) {
        throw {message: 'canvas container element is required'}
    }

    this.canvases = {};

    var id = this.random();
    this.uuid = this.canvasUUID(id);

    this.client = new Messaging.Client(config.host, config.port, this.uuid);

    this.container = config.container;

    var canvasElement = document.createElement('canvas');
    canvasElement.id = this.uuid;
    canvasElement.width = this.container.scrollWidth;
    canvasElement.height = this.container.scrollHeight;


    this.container.appendChild(canvasElement);

    var self = this;

    var canvas = new Canvas(canvasElement, {
        color: '#' + id,
        width: 10
    });

    this.canvases[this.uuid] = canvas;

    canvasElement.addEventListener('touchstart', function (e) {
        canvas.end();

        var touch = e.touches[0];

        var x = touch.pageX;
        var y = touch.pageY - touch.target.offsetParent.offsetTop;


        self.draw(x, y, canvas, true);
    }, false);

    canvasElement.addEventListener('touchend', function () {
        canvas.end();

        var color = canvas.stroke.color;

        self.broadcastEvent({
            type: 'end-draw',
            canvas: {
                color: color,
                id: self.canvasUUID(color.substring(1))
            }
        });

    }, false);

    canvasElement.addEventListener('touchmove', function (e) {
        if (canvas.started) {
            var touch = e.touches[0];

            var x = touch.pageX;
            var y = touch.pageY - touch.target.offsetParent.offsetTop;

            self.draw(x, y, canvas, true);
        }
    }, false);

    // Disable Page Move
    document.body.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, false);


}

WhiteBoard.prototype.canvasUUID = function(id) {
    return 'c-' + id;
};

WhiteBoard.prototype.random = function () {
    var color = parseInt(Math.random() * 0xFFFFFF);

    return color.toString(16);
};

WhiteBoard.prototype.connect = function () {

    this.client.onMessageArrived = (function (self) {
        return function (message) {
            self.onMessage(message);
        };
    })(this);

    this.client.onConnectionLost = (function (self) {
        return self.onConnectionLost;
    })(this);

    var connectOptions = {};
    connectOptions.keepAliveInterval = 3600;
    connectOptions.onSuccess = (function (self) {
        return function () {
            self.onConnect();
        };
    })(this);
    connectOptions.onFailure = (function (self) {
        return self.onFailure;
    })(this);

    this.client.connect(connectOptions);
};

WhiteBoard.prototype.onConnect = function () {
    this.client.subscribe('whiteboard/+');
};

WhiteBoard.prototype.onFailure = function () {
    alert('Failed to connect!');
};

WhiteBoard.prototype.onConnectionLost = function () {
    alert('Connection lost!');
};

WhiteBoard.prototype.onMessage = function (message) {
    var topic = message.destinationName;
    var payload = message.payloadString;
    if (topic.indexOf("whiteboard/") == 0) {
        var sourceUUID = topic.split("/")[1];
        // don't process own actions
        if (sourceUUID == this.uuid) {
            return;
        }

        try {
            var data = JSON.parse(payload);

            if (data.type == "clear") {
                return this.clear(false);
            }

            var canvasElement = document.querySelector('#' + data.canvas.id);

            if (!canvasElement) {
                canvasElement = document.createElement('canvas');
                canvasElement.id = data.canvas.id;
                canvasElement.width = this.container.scrollWidth;
                canvasElement.height = this.container.scrollHeight;


                this.container.appendChild(canvasElement);

                this.canvases[data.canvas.id] = new Canvas(canvasElement, {
                    color: data.canvas.color,
                    width: 10
                });
            }

            var canvas = this.canvases[data.canvas.id];

            if (data.type == "draw") {
                this.draw(data.position[0], data.position[1], canvas, false);
            } else if (data.type == "end-draw") {
                canvas.end();
            }

        } catch (e) {
            console.error(e);
        }
    }
};

WhiteBoard.prototype.draw = function (x, y, canvas, publish) {
    canvas.move(x, y);

    if (publish) {
        var color = canvas.stroke.color;
        this.broadcastEvent({
            type: 'draw',
            position: [x, y],
            canvas: {
                color: color,
                id: this.canvasUUID(color.substring(1))
            }
        });
    }
};

WhiteBoard.prototype.clear = function (broadcast) {

    for (var key in this.canvases) {
        var canvas = this.canvases[key];
        canvas.clear();
    }

    if (broadcast) {
        this.broadcastEvent({
            type: 'clear'
        });
    }
};

WhiteBoard.prototype.broadcastEvent = function (event) {
    var topic = 'whiteboard/' + this.uuid;

    if (typeof event.type === 'undefined') {
        throw {message: 'event type is required'};
    }

    var message = new Messaging.Message(JSON.stringify(event));
    message.destinationName = topic;
    message.qos = 0;
    message.retained = false;

    this.client.send(message);
};