# Spotify Clone - Web Music Player

This project is a responsive, fully functional music player inspired by Spotify. It is built using pure HTML, CSS, and JavaScript and is deployed on Vercel. All static files, including songs and assets, are placed inside the public folder for seamless deployment.


## Live Demo:
---> https://spotify-clone-inky-eight.vercel.app
---> https://spotify-clone-nirav-uparas-projects.vercel.app/


## Features:

Play and pause any song with a single click

Click the same song again to toggle pause

Albums and songs are loaded dynamically from JSON files

Interactive seek bar with real-time progress

Volume control and mute functionality

Mobile and desktop responsive design


### Keyboard shortcuts:

Spacebar: Play/Pause

Left Arrow: Previous track

Right Arrow: Next track


## Project Structure:

public/
📁 Spotify-Clone/
├── 📁 public/
│   ├── 📁 Songs/
│   │   ├── 📁 Buzzing/
│   │   │   ├── bulleya-sultan.mp3
│   │   │   ├── cover.jpg
│   │   │   └── info.json
│   │   ├── 📁 Chill/
│   │   │   └── ...
│   │   └── index.json
│   ├── 📁 css/
│   │   ├── style.css
│   │   └── utility.css
│   ├── 📁 js/
│   │   └── script.js
│   ├── 📁 img/
│   │   └── play.svg, pause.svg, music.svg, volume.svg, mute.svg, etc.
│   └── index.html
├── README.md
└── (any other config files like .gitignore, vercel.json etc.)



## Tech Stack:

HTML5
CSS
JavaScript
JSON for dynamic data
Vercel for hosting


### How to Use:

Clone this repository using
git clone https://github.com/NiravUpara/spotify-clone.git

Open public/index.html in any modern browser
or use Live Server in VS Code for local development

To deploy on Vercel:

Make sure the public folder is set as the deployment root

All media and JSON files should be accessible inside the public/Songs folder



### Author: Nirav Upara
### GitHub: https://github.com/yourusername

### License: This project is open-source and available under the MIT License for personal and educational use.