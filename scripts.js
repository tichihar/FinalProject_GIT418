'use strict'

// #quiz-holder is selected for modification
let contentHolder = document.getElementById("quiz-holder");
// contains data retrieved from the questions.json 
let allQuestions;
// unique number to track which path the user took to match it with the playlist number
let identifier = "";
// track the progress
let progressValue = 0;

let colorPalettes = new Object;
colorPalettes = {
    firstPalette: ["F4F4F4", "F4F4F6", "EEEEEE", "BFBFBF", "E6E6E9"],
    lovePalette: ["fbeaec", "e0bbcc", "fff1f5", "d7c1e0"],
    kiPalette: ["D4F1F9", "FFF2CC", "FFE5A1", "DCD9F2", "DFE4F2"],
    doPalette: ["7914AD"],
    aiPalette: ["0E4A6C", "136290", "003769", "2C345C", "40434E", "879191", "615483"],
    rakuPalette: ["678D58", "98BB77 ", "C1D6AE", "FFC870", "F9EFDC"]
}

// event called upon the pageload
window.addEventListener("load", function () {
    // add an introduction statement and a button to launch the questionary
    contentHolder.innerHTML = `
    <div>
        <h1 id="start-title" class="upper-element">Let's capture<br />your mood with<br />Songs!</h1>
        <button id="launch-btn" class="white">Get Started ></button>
    </div>
    `;

    // dilay the function and add animation
    this.setTimeout(() => {
        contentHolder.classList.remove("transparent");
        contentHolder.classList.add("fade-in")

        // remove fade-in class for the fade-out animation later implemented
        setTimeout(() => {
            contentHolder.classList.remove("fade-in")
        }, 100)

        // add event to the button to start the quiz
        this.document.getElementById("launch-btn").onclick = function() {

            document.getElementById("launch-btn").disabled = true;

            const pBar = document.createElement("div");
            pBar.setAttribute("id", "progress-bar");
            pBar.classList.add("transparent");
            document.getElementById("main-content").appendChild(pBar);

            // get data from the questions.json
            fetch("questions.json")
                .then(response => response.json())
                .then(data => {
                    allQuestions = data;
                    console.log(data)
                });

            addProgressBar()
            displayQuestion("Q1-1");
            setTimeout(() => {
                pBar.classList.add("fade-in")
                pBar.classList.remove("transparent")
            }, 2100)
        }
    }, 100)
});

// function to display questions
function displayQuestion(key) {

    contentHolder.classList.add("fade-out");
    updateProgressBar(progressValue);

    setTimeout(() => {
        let customBtns = "";
    
        for(let i = 0; i < allQuestions[key].answers.length ; i++) {
            customBtns += `
            <button id="${allQuestions[key].answers[i]._id}">${allQuestions[key].answers[i].answer}</button>
            `;
        }
        
        bubbleGenerator(key);
    
        contentHolder.innerHTML = `
        <div>
            <h2 class="upper-element">${allQuestions[key].question}</h1>
            <div id="btns-holder">
                ${customBtns}
            </div>
        </div>
        `;
        
        for(let i = 0; i < allQuestions[key].answers.length ; i++) {
            let answerBtn = document.getElementById(`${allQuestions[key].answers[i]._id}`);
            let deg = Math.floor(Math.random() * 361);
            let grad1 = Math.floor(Math.random() * 15);
            let grad2 = Math.floor((Math.random() * 8) + 51);
            let grad3 = Math.floor((Math.random() * 15) + 86);
            answerBtn.style.backgroundImage = `linear-gradient(${deg}deg, #${allQuestions[key].answers[i].color[0]} ${grad1}%, #${allQuestions[key].answers[i].color[1]} ${grad2}%, #${allQuestions[key].answers[i].color[2]} ${grad3}%)`

            if(allQuestions[key].answers[i].white)
                answerBtn.classList.add("white");
        }

        contentHolder.classList.remove("fade-out");
        contentHolder.classList.add("fade-in");

        setTimeout(() => {
            contentHolder.classList.remove("fade-in");
        }, 2000);

        let btns = document.querySelectorAll("button");
        btns.forEach(btn => 
            btn.onclick = () => {
                console.log(btn);
                console.log(btn.target);
                progressValue += 25;

                btns.forEach(btn => btn.disabled = true);
                for(let answer of allQuestions[key].answers) {
                    if(answer._id === btn.id) {
                        const colorSelection = answer.color;
                        const firstPick = Math.floor(Math.random() * 3);
                        const color1 = "#" + colorSelection[firstPick];
                        colorSelection.splice(firstPick, 1);
                        const color2 = "#" + colorSelection[Math.floor(Math.random() * 2)];

                        identifier += answer._id;
                        removingBubbles();
                        if(answer.nextKey) {
                            displayQuestion(answer.nextKey);
                        } else {
                            displayPlaylist()
                        }
                        updateProgressBar(progressValue, color1, color2);
                    }
                }
            }
        )
    }, 2000);
};

function displayPlaylist() {
    let iframe = document.createElement("iframe");
    iframe.width = "95%";
    iframe.height = "380";
    iframe.allow = "encrypted-media"

    fetch("playlists.json")
        .then(response => response.json())
        .then(data => {
            iframe.src = `https://open.spotify.com/embed/playlist/${data[identifier].link}?utm_source=generator`;


            setTimeout(() => {
                contentHolder.innerHTML = "";
                contentHolder.appendChild(iframe);

            }, 5000)
        });

};

function bubbleGenerator(key) {
    let bubblesHolder = document.getElementById("bubbles-holder");

    bubblesHolder.classList.remove("transparent");

    let quadrants = document.querySelectorAll("#bubbles-holder div");
    quadrants.forEach(quadrant => {
        quadrant.innerHTML = "";
        let bubble = document.createElement("div");
        bubble.classList.add("bubble");
        bubble.classList.add("fade-out");

        let size = Math.floor((Math.random() * 200) + 100);
        bubble.style.height = `${size}px`;
        bubble.style.width = `${size}px`;


        const dimention = quadrant.getBoundingClientRect();
        let maxTop = dimention.height - size;
        let maxLeft = dimention.width - size
        let top = Math.floor(Math.random() * maxTop);
        let left = Math.floor(Math.random() * maxLeft);

        bubble.style.position = "absolute"
        bubble.style.top = `${top}px`;
        bubble.style.left = `${left}px`;

        let paletteType = [];
        if(allQuestions[key].colorTheme) {
            paletteType.push(...colorPalettes[allQuestions[key].colorTheme])
        } else {
            allQuestions[key].answers.forEach(answer => {
                paletteType.push(...answer.color);
            })
        }

        console.log(paletteType)
        const firstPick = Math.floor(Math.random() * paletteType.length);
        let color1 = "#" + paletteType[firstPick];
        paletteType.splice(firstPick, 1);
        let color2 = "#" + paletteType[Math.floor(Math.random() * paletteType.length)];
        let deg = Math.floor(Math.random() * 361);
        let grad1 = Math.floor(Math.random() * 31);
        let grad2 = Math.floor((Math.random() * 31) + 70);

        bubble.style.backgroundImage = `linear-gradient(${deg}deg, ${color1} ${grad1}%, ${color2} ${grad2}%)`

        quadrant.appendChild(bubble)
        setTimeout(() => {
            bubble.classList.remove("fade-out");
            bubble.classList.add("fade-in");
            setTimeout(() => bubble.classList.remove("fade-in"), 800);

        }, 800);
    })
};

function removingBubbles() {
    let quadrants = document.querySelectorAll("#bubbles-holder div");
    quadrants.forEach(quadrant => {
        quadrant.classList.add("byebye-bubbles");
    });

    setTimeout(() => {quadrants.forEach(quadrant => {
        document.getElementById("bubbles-holder").classList.add("transparent");
        quadrant.classList.remove("byebye-bubbles");
    }
    )}, 2000);
};


// JQuery starts from here
let currentValue = 0;
function addProgressBar() {
    $("#progress-bar").progressbar({
        value: 0
    });
};

function updateProgressBar(progress, color1, color2) {
    let newValue = progress;

    $({value: currentValue}).animate({value: newValue}, {
        duration: 2000,
        easing: "swing",
        step: function(update) {
            $("#progress-bar").progressbar("value", update);
        },
        complete: function() {
            currentValue = progress;
        }
    })

    $(".ui-progressbar-value").css({
        "background-image": `linear-gradient(45deg, ${color1} 34%, ${color2} 80%)`,
        "transition": "background-image 5s ease-in-out"
    })
}