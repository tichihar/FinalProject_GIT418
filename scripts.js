'use strict'

// #quiz-holder is selected for modification
let contentHolder = document.getElementById("quiz-holder");
// contains data retrieved from the questions.json 
let allQuestions;
// unique number to track which path the user took to match it with the playlist number
let identifier = "";

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
        // get data from the questions.json
        fetch("questions.json")
            .then(response => response.json())
            .then(data => {
                allQuestions = data;
                console.log(data)
                displayQuestion("Q1-1");
            });
        }
    }, 100)
});

// function to display questions
function displayQuestion(key) {

    contentHolder.classList.add("fade-out");

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
            answerBtn.style.backgroundImage = `linear-gradient(${deg}deg, ${allQuestions[key].answers[i].color[0]} ${grad1}%, ${allQuestions[key].answers[i].color[1]} ${grad2}%, ${allQuestions[key].answers[i].color[2]} ${grad3}%)`

            if(allQuestions[key].answers[i].dark)
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
                btns.forEach(btn => btn.disabled = true);
                for(let answer of allQuestions[key].answers) {
                    if(answer._id === btn.id) {
                        identifier += answer._id;
                        console.log(identifier);
                        if(answer.nextKey) {
                            removingBubbles();
                            displayQuestion(answer.nextKey);
                        } else {
                            displayPlaylist()
                        }
                    }
                }
            }
        )
    }, 2000);
}

function displayPlaylist() {
    let iframe = document.createElement("iframe");
    iframe.width = "95%";
    iframe.height = "380";
    iframe.allow = "encrypted-media"

    fetch("playlists.json")
        .then(response => response.json())
        .then(data => {
            iframe.src = `https://open.spotify.com/embed/playlist/${data[identifier].link}?utm_source=generator`;

            contentHolder.innerHTML = "";
            contentHolder.appendChild(iframe);
        })
}

function bubbleGenerator(key) {
    let bubblesHolder = document.getElementById("bubbles-holder");

    let colorPallet = allQuestions[key].colorPallet;
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

        let color1 = colorPallet[Math.floor(Math.random() * 5)];
        let color2 = colorPallet[Math.floor(Math.random() * 5)];
        let color3 = colorPallet[Math.floor(Math.random() * 5)];
        let deg = Math.floor(Math.random() * 361);
        let grad1 = Math.floor(Math.random() * 31);
        let grad2 = Math.floor((Math.random() * 31) + 70);

        bubble.style.backgroundImage = `linear-gradient(${deg}deg, ${color1} ${grad1}%, ${color2} ${grad2}%)`
        bubble.style.boxShadow = `0 0 ${size / 4}px ${color2}`

        quadrant.appendChild(bubble)
        setTimeout(() => {
            bubble.classList.remove("fade-out");
            bubble.classList.add("fade-in");
            setTimeout(() => bubble.classList.remove("fade-in"), 300);

        }, 300);
    })
}

function removingBubbles() {
    let quadrants = document.querySelectorAll("#bubbles-holder div");
    quadrants.forEach(quadrant => quadrant.classList.add("byebye-bubbles"));
}