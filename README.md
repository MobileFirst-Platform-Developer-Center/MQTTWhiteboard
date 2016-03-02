IBM MobileFirst Platform Foundation
===
## MQTT Whiteboard
An application demonstrating the usage of the MQTT protocol using websockets

### Tutorials
https://mobilefirstplatform.ibmcloud.com/tutorials/en/product-integration/8.0/mq-telemetry-transport/

### Usage

1. Update the MQ server endpoint and port in `main.js`
```
var wb = new WhiteBoard({
    host: 'YOUR_MQ_SERVER_HOST.COM',
    port: 61623,
    container: canvasContainer
});
```
2. From the command-line, navigate to the project's root folder.
2. Add a platform by running the `cordova platform add` command.
3. Run the Cordova application by running the `cordova run` command.

### Supported Levels
IBM MobileFirst Platform Foundation 8.0

### License
Copyright 2016 IBM Corp.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.