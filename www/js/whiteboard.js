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

(function(window){

    function randomColor() {
        var color = parseInt(Math.random() * 0xFFFFFF);

        return '#' + color.toString(16);
    }

    /**
     * @return {string}
     */
    function colorToUUID(color) {
        if(color[0] === '#') {
            color = color.substring(1);
        }

        return 'c-' + color;
    }

    function draw(x, y, canvas, publish, app) {
        canvas.move(x, y);

        if (publish) {
            var color = canvas.stroke.color;

            app.broadcastEvent({
                type: 'draw',
                position: [x, y],
                color: color
            });
        }
    }

    function WhiteBoard(config) {
        if (typeof config === 'undefined') {
            throw {message: "Configuration is required"};
        } else if (typeof config.host === 'undefined') {
            throw {message: "Host is required"};
        } else if (typeof  config.port === 'undefined') {
            throw {message: "Port is required"};
        } else if (typeof config.container === 'undefined' || !(config.container instanceof HTMLElement)) {
            throw {message: 'canvas container element is required'};
        }

        var color = randomColor();

        this.uuid = colorToUUID(color);

        this.client = new Messaging.Client(config.host, config.port, this.uuid);

        this.canvases = {};

        this.container = config.container;

        var canvasElement = document.createElement('canvas');
        canvasElement.id = this.uuid;
        canvasElement.width = this.container.clientWidth;
        canvasElement.height = this.container.clientHeight;

        this.container.appendChild(canvasElement);

        this.canvases[this.uuid] = new Canvas(canvasElement, {
            color: color,
            width: 10
        });

        this.canvasElement = canvasElement;
    }

    WhiteBoard.prototype.getCanvasElement = function() {
        return this.canvasElement;
    };

    WhiteBoard.prototype.resize = function(width, height) {
        for (var id in this.canvases) {
            var canvas = this.canvases[id];
            canvas.resize(width, height);
        }
    };

    WhiteBoard.prototype.getCanvas = function(id) {
        if(typeof id === 'undefined') {
            return this.canvases[this.uuid];
        }

        return this.canvases[id];
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
        navigator.notification.alert('Failed to connect!');
    };

    WhiteBoard.prototype.onConnectionLost = function () {
        navigator.notification.alert('Connection lost!');
    };

    WhiteBoard.prototype.onMessage = function (message) {
        var topic = message.destinationName;
        var payload = message.payloadString;
        if (topic.indexOf("whiteboard/") === 0) {
            var sourceUUID = topic.split("/")[1];
            // don't process own actions
            if (sourceUUID == this.uuid) {
                return;
            }

            try {
                var data = JSON.parse(payload);

                if (data.type == "clear") {
                    return this.clear(true);
                }

                var canvasId = colorToUUID(data.color);

                var canvasElement = document.querySelector('#' + canvasId);

                if (!canvasElement) {
                    canvasElement = document.createElement('canvas');
                    canvasElement.id = canvasId;
                    canvasElement.width = this.container.scrollWidth;
                    canvasElement.height = this.container.scrollHeight;


                    this.container.appendChild(canvasElement);

                    this.canvases[canvasId] = new Canvas(canvasElement, {
                        color: data.color,
                        width: 10
                    });
                }

                var canvas = this.canvases[canvasId];

                if (data.type == 'draw') {
                    draw(data.position[0], data.position[1], canvas, false, this);
                } else if (data.type == 'stop') {
                    canvas.end();
                }

            } catch (e) {
                console.error(e);
            }
        }
    };

    WhiteBoard.prototype.draw = function(x, y) {
        draw(x, y, this.getCanvas(), true, this);
    };

    WhiteBoard.prototype.stop = function() {

        var canvas = this.getCanvas();
        canvas.end();

        this.broadcastEvent({
            type: 'stop',
            color: canvas.stroke.color
        });
    };

    WhiteBoard.prototype.clear = function (silent) {

        for (var key in this.canvases) {
            var canvas = this.canvases[key];
            canvas.clear();
        }

        if (!silent) {
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

    window.WhiteBoard = WhiteBoard;
})(window);