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
function Canvas(element, stroke) {
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