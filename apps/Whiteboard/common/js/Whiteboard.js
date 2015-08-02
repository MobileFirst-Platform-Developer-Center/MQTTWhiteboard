/*
 * COPYRIGHT LICENSE: This information contains sample code provided in source code form. You may copy, modify, and distribute
 * these sample programs in any form without payment to IBM® for the purposes of developing, using, marketing or distributing
 * application programs conforming to the application programming interface for the operating platform for which the sample code is written.
 * Notwithstanding anything to the contrary, IBM PROVIDES THE SAMPLE SOURCE CODE ON AN "AS IS" BASIS AND IBM DISCLAIMS ALL WARRANTIES,
 * EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, SATISFACTORY QUALITY,
 * FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND ANY WARRANTY OR CONDITION OF NON-INFRINGEMENT. IBM SHALL NOT BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR OPERATION OF THE SAMPLE SOURCE CODE.
 * IBM HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS OR MODIFICATIONS TO THE SAMPLE SOURCE CODE.
 */

var Colors = ["rgb(255,0,0)", "rgb(0,170,0)", "rgb(0,0,255)", "rgb(0,0,0)",
              "rgb(230,230,0)", "rgb(127,255,212)", "rgb(139,69,19)"];

function WhiteboardApp() {
    this.size = 8;
    this.color = Colors[Math.floor(Math.random() * Colors.length)];
    this.drawOn = false;
    this.canvas = $("canvas")[0];
    
    this.host = "127.0.0.1";
    this.port = 1883;
    // generate a 6-character
    // alphanumeric unique ID
    this.uuid = Math.random().toString(36)
                    .slice(2).substring(0, 6);
    this.clientId = "whiteboard-"+this.uuid;
    this.client = new Messaging.Client(this.host, this.port, this.clientId);
}

WhiteboardApp.prototype.connect = function() {
    this.client.onMessageArrived = (function(self) {
    	return function(msg) {
    		self.onMsg(msg);
    	}
    })(this);
    this.client.onConnectionLost = function() {
        alert("Connection lost!");
    };

    var connectOptions = new Object();
    connectOptions.keepAliveInterval = 3600;
    connectOptions.onSuccess = (function(self) {
    	return function() {
    		self.onConn();
    	}
    })(this);
    connectOptions.onFailure = function() {
        alert("Failed to connect!");
    };

    this.client.connect(connectOptions);
}

WhiteboardApp.prototype.onMsg = function(msg) {
	var topic = msg.destinationName;
    var payload = msg.payloadString;
    if (topic.indexOf("whiteboard/") == 0) {
        var sourceUUID = topic.split("/")[1];
        // don't process own actions
        if (sourceUUID == this.uuid) { return; } 
        var data = JSON.parse(payload);
        if (data.type == "draw") {
            this.draw(data.x, data.y, this.size, data.color, true);
        } else if (data.type == "clear") {
            this.clear(true);
        }
    }
}

WhiteboardApp.prototype.onConn = function() {
	this.client.subscribe("whiteboard/+");
}

WhiteboardApp.prototype.draw = function(x, y, size, color, fromOutside) {
    var context = this.canvas.getContext("2d");
    for (var i = 1; i <= size; i+=2) {
        context.save();
        context.beginPath();
        var alpha = 1.0 - Math.pow(i/size, 2);
        context.globalAlpha = alpha;
        context.strokeStyle = color;
        context.arc(x, y, i, 0, 2*Math.PI);
        context.stroke();
        context.restore();
    }
    
    if (!fromOutside) {
    	this.publishDraw(x, y, color);
    }
}

WhiteboardApp.prototype.clear = function(fromOutside) {
    var context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (!fromOutside) {
    	this.publishClear();
    }
}

WhiteboardApp.prototype.publishDraw = function(x, y, color) {

    var topic = "whiteboard/" + this.uuid;
    var data = JSON.stringify({
        type: "draw",
        x: x,
        y: y,
        color: color,
    });

    var msg = new Messaging.Message(data);
    msg.destinationName = topic;
    msg.qos = 0;
    msg.retained = false;

    this.client.send(msg);
}

WhiteboardApp.prototype.publishClear = function() {
    
	var topic = "whiteboard/" + this.uuid;
    var data = JSON.stringify({
        type: "clear"
    });

    var msg = new Messaging.Message(data);
    msg.destinationName = topic;
    msg.qos = 0;
    msg.retained = false;

    this.client.send(msg);
}