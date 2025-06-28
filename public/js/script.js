console.log("Running JS");

let currentSong = new Audio();
let songs;
let currFolder; 

// Format time into MM:SS
const formatTime = (seconds) => {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (isNaN(mins) || isNaN(secs)) return "00:00";
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Fetch and display songs of selected folder
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1].replaceAll("%20", " "));
        }
    }

    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li>
            <img class="invert music-icon" width="34" src="/img/music.svg" alt="">
            <div class="info"><div>${song}</div><div></div></div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert play-icon" src="/img/play.svg" alt="Play">
            </div>
        </li>`;
    }

    Array.from(document.querySelectorAll(".songList li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            if (currentSong.src.includes(songs[index]) && !currentSong.paused) {
                currentSong.pause();
                document.querySelector(".playbar #play").src = "/img/play.svg";
                e.querySelector(".playnow img").src = "/img/play.svg";
            } else {
                playMusic(songs[index]);
                updateSongListIcons(index);
            }
        });
    });

    return songs;
}

function updateSongListIcons(activeIndex) {
    Array.from(document.querySelectorAll(".songList li")).forEach((e, index) => {
        const icon = e.querySelector(".playnow img");
        icon.src = (index === activeIndex) ? "/img/pause.svg" : "/img/play.svg";
        e.classList.toggle("active-song", index === activeIndex);
    });
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        document.querySelector("#play").src = "/img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

// Display album cards dynamically
async function displayAlbum() {
    try {
        let response = await fetch("/Songs/index.json");
        let albums = await response.json();
        let cardContainer = document.querySelector(".cardContainer");
        cardContainer.innerHTML = "";

        for (const album of albums) {
            let folder = album.folder;

            let infoResponse = await fetch(`/Songs/${folder}/info.json`);
            let info = await infoResponse.json();

            cardContainer.innerHTML += `
                <div data-folder="/Songs/${folder}" class="card">
                    <div class="play">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="32" fill="" />
                            <polygon points="26,20 26,44 46,32" fill="black" />
                        </svg>
                    </div>
                    <img src="/Songs/${folder}/cover.jpg" width="200" height="200" alt="Cover img">
                    <h3>${info.title}</h3>
                    <p>${info.description}</p>
                </div>
            `;
        }

        Array.from(document.getElementsByClassName("card")).forEach(card => {
            card.addEventListener("click", async item => {
                let folder = item.currentTarget.dataset.folder;
                songs = await getSongs(folder);
                playMusic(songs[0]);
                updateSongListIcons(0);
            });
        });
    } catch (err) {
        console.error("Error loading albums:", err);
    }
}

async function main() {
    await displayAlbum();

    document.querySelector("#play").addEventListener("click", () => {
        let currentTrack = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentTrack);

        if (currentSong.paused) {
            currentSong.play();
            document.querySelector("#play").src = "/img/pause.svg";
            updateSongListIcons(index);
        } else {
            currentSong.pause();
            document.querySelector("#play").src = "/img/play.svg";
            document.querySelectorAll(".playnow img").forEach(img => img.src = "/img/play.svg");
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        let current = formatTime(currentSong.currentTime);
        let duration = formatTime(currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${current} / ${duration}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.clientWidth) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-130%";
    });

    document.querySelector("#previous").addEventListener("click", () => {
        let currentTrack = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentTrack);
        index = (index - 1 + songs.length) % songs.length;
        playMusic(songs[index]);
        updateSongListIcons(index);
    });

    document.querySelector("#next").addEventListener("click", () => {
        let currentTrack = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentTrack);
        index = (index + 1) % songs.length;
        playMusic(songs[index]);
        updateSongListIcons(index);
    });

    document.querySelector(".range input").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        document.querySelector(".volume>img").src = currentSong.volume > 0 ? "/img/volume.svg" : "/img/mute.svg";
    });

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("/img/volume.svg", "/img/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = e.target.src.replace("/img/mute.svg", "/img/volume.svg");
            currentSong.volume = 0.5;
            document.querySelector(".range input").value = 50;
        }
    });

    document.addEventListener("keydown", (e) => {
        if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
        switch (e.code) {
            case "Space":
                e.preventDefault();
                document.querySelector("#play").click();
                break;
            case "ArrowLeft":
                document.querySelector("#previous").click();
                break;
            case "ArrowRight":
                document.querySelector("#next").click();
                break;
        }
    });

    currentSong.addEventListener("ended", () => {
        let currentTrack = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentTrack);
        index = (index + 1) % songs.length;
        playMusic(songs[index]);
        updateSongListIcons(index);
    });
}

main();
