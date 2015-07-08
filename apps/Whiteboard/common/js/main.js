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