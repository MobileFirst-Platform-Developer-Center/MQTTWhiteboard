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
function wlCommonInit(){
    //MFP APIs should only be called within wlCommonInit() or after it has been called, to ensure that the APIs have loaded properly
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    onDeviceReady: function() {

        // TODO: update connection details, HOST and PORT
        var wb = new WhiteBoard({
            host: 'YOUR_MQ_SERVER_HOST',
            port: 61623,
            container: document.querySelector('#canvas-container')
        });

        wb.connect();

        document.querySelector("#eraser").addEventListener('click', function(){
            wb.clear(true);
        })
    }
};

app.initialize();