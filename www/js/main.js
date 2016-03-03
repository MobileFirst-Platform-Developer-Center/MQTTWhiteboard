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
var Messages = {};

var wlInitOptions = {};

// Called automatically after MFP framework initialization by WL.Client.init(wlInitOptions).
function wlCommonInit() {
    //MFP APIs should only be called within wlCommonInit() or after it has been called, to ensure that the APIs have loaded properly
}

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    onDeviceReady: function () {

        // Disable Page Move
        document.body.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);

        var canvasContainer = document.querySelector('#canvas-container');

        // TODO: update connection details, HOST and PORT
        var wb = new WhiteBoard({
            host: 'YOUR_MQ_SERVER_HOST',
            port: 61623,
            container: canvasContainer
        });

        wb.connect();

        var canvas = wb.getCanvasElement();

        canvas.addEventListener('touchstart', function (e) {
            var touch = e.touches[0];

            var x = touch.pageX;
            var y = touch.pageY - touch.target.offsetParent.offsetTop;


            wb.draw(x, y);
        }, false);

        canvas.addEventListener('touchend', function () {
            wb.stop();
        }, false);

        canvas.addEventListener('touchmove', function (e) {
            var touch = e.touches[0];

            var y = touch.pageY - touch.target.offsetParent.offsetTop;

            wb.draw(touch.pageX, y);
        }, false);

        window.addEventListener('resize', function () {
            wb.resize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        });

        document.querySelector("#eraser").addEventListener('click', function () {
            wb.clear();
        });
    }
};

app.initialize();
