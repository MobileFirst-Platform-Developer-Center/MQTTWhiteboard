var Messages = {
    // Add here your messages for the default language.
    // Generate a similar file with a language suffix containing the translated messages.
    // key1 : message1,
};

var wlInitOptions = {
    // Options to initialize with the WL.Client object.
    // For initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center.
};

// Called automatically after MFP framework initialization by WL.Client.init(wlInitOptions).
function wlCommonInit(){
	// Common initialization code goes here
    document.getElementById('app_version').textContent = WL.Client.getAppProperty("APP_VERSION");
    document.getElementById('mobilefirst').setAttribute('style', 'display:block;');

    // Copied from 7.1
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
      // end of copied from 7.1
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
    // function, 'app.receivedEvent(...);' must be explicitly called.
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update the DOM on a received event.
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

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
