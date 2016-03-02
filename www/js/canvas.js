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
    function cloneCanvas(canvas) {
        var newCanvas = document.createElement('canvas');

        var context = newCanvas.getContext('2d');

        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;

        context.drawImage(canvas, 0, 0);

        return newCanvas;
    }


    function Canvas(element, stroke) {
        this.element = element;
        this.context = element.getContext("2d");

        this.stroke = {
            width: 5, color: '#000'
        };

        if(typeof stroke !== 'undefined') {
            if(typeof stroke.color !== 'undefined') {
                this.stroke.color = stroke.color;
            } else if(typeof stroke.width !== 'undefined') {
                this.stroke.width = stroke.width;
            }
        }

        this.width = element.width;
        this.height = element.height;

        this.started = false;
    }

    Canvas.prototype.resize = function(width, height) {
        var tempCanvas = cloneCanvas(this.element);

        this.element.width = width;
        this.element.height = height;

        this.context.drawImage(tempCanvas, 0, 0);
    };

    Canvas.prototype.move = function(x, y) {

        if (this.started) {
            this.context.lineTo(x, y);

            this.context.strokeStyle = this.stroke.color;
            this.context.lineWidth = this.stroke.width;
            this.context.stroke();
        } else {
            this.context.beginPath();
            this.context.moveTo(x, y);
            this.started = true;
        }
    };

    Canvas.prototype.end = function() {
        this.started = false;
    };

    Canvas.prototype.clear = function(){
        this.context.clearRect(0,0, this.width, this.height);
    };

    window.Canvas = Canvas;
})(window);