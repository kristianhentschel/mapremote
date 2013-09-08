mapremote
=========
A tool to control a map representation on a presentation screen from a mobile device. Works best in Chrome/Chrome for Android. Think of it as Chromecast but for Google Maps rather than Netflix. (Chromecast may or may not support similar functionality).

Uses node.js with dependencies socket.io and hashids. Currently using the Google Maps API for displaying the map.

Live Demo: [mapremote.herokuapp.com](http://mapremote.herokuapp.com)

Installation/Usage
------------------
On any computer on a network accessible from both your presentation laptop and your remote control mobile device (e.g. any computer, including the one you present from, on your WiFi), you need to install [node.js and npm](http://nodejs.org/download/). This will be your server. Place server.js, index.html, package.json from this repository in any folder on your server computer. Open a command line, change to this folder, and run `npm install`. This will download any dependency packages. To start the server, type `node server.js`. The server will run on the default HTTP port (80), so you cannot run a web server on the same machine at the same time.

Open a web browser on both the presentation screen and your mobile device and navigate both to the IP of your server computer. On your remote, type the numerical pin code displayed on the screen computer, and hit Enter/Go on the keyboard. Both screens should display a map.

On your mobile device, drag and drop to move the map, use the pinch gesture (or scroll wheel on a laptop) to zoom, and click the map to place a marker. All these changes will be reflected on the big screen.

Caveats
-------
* You need to have a server with node.js and npm installed, and know the IP address of this server. I just use my laptop, but it does not have to be on your local network. __Update:__ There now is a demo hosted on heroku at [mapremote.herokuapp.com](http://mapremote.herokuapp.com)
* The map position on the host screen is only updated at the end of a scrolling motion.
* With different size screens, area covered may not be exact, but should be close enough.
* Google displays icons and labels for points of interest. If you try to place a marker on top of such a label, the click event will be caught by the label and Google will display an info window about that POI on your mobile device. There seems to be no easy way to disable this behaviour without also removing all POI labels.

License
-------
The MIT License (MIT)

Copyright (c) 2013 Kristian Hentschel 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.



