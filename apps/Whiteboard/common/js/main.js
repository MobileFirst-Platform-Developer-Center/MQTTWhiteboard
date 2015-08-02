/**
* Copyright 2015 IBM Corp.
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
function wlCommonInit(){	
	window.app = new WhiteboardApp();
	app.connect();
    
	$("#whiteboard").on("vmousemove", function(event) {
        if (app.drawOn) {
            var x = event.pageX;
            var y = event.pageY - $("canvas").offset().top;
            app.draw(x, y, app.size, app.color);
        }
        event.preventDefault();
    });
    $("#whiteboard").on("vmousedown", function(event) {
        var x = event.pageX;
        var y = event.pageY - $("canvas").offset().top;
        app.draw(x, y, app.size, app.color);
        app.drawOn = true;
    });
    $("#whiteboard").on("vmouseup", function(event) {
        app.drawOn = false;
    });
    $("#whiteboard").bind("tap", function(event) {
        event.preventDefault();
    });
    
    $(window).resize(function() { resize(); });
    resize();
}

var resize = function() {
    var winSize = {
            width: window.innerWidth || document.body.clientWidth,
            height: window.innerHeight || document.body.clientHeight
    };
    // make canvas fill space under header
    $("canvas").css("top", $("#header").innerHeight() + "px");
    $("canvas")[0].width = winSize.width;
    $("canvas")[0].height = winSize.height - $("#header").innerHeight();
}