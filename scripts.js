'use strict'

let contentHolder = document.getElementById("quiz-holder");
let allQuestions;
let identifier = "";

window.addEventListener("load", function () {
    contentHolder.innerHTML = `
    <div>
        <h1 id="start-title" class="upper-element">Let's capture<br />your mood with<br />Songs!</h1>
        <button id="launch-btn" class="white">Get Started ></button>
    </div>
    `

    this.document.getElementById("launch-btn").onclick = function() {
        contentHolder.innerHTML = "";
        fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            allQuestions = data;
            console.log(data)
            displayQuestion("Q1-1");
        });
    }
});

function displayQuestion(key) {
    let customBtns = "";
    console.log(allQuestions[key]);

    for(let i = 0; i < allQuestions[key].answers.length ; i++) {
        customBtns += `
        <button id="${allQuestions[key].answers[i]._id}">${allQuestions[key].answers[i].answer}</button>
        `
    }

    contentHolder.innerHTML += `
    <div>
        <h1 class="upper-element">${allQuestions[key].question}</h1>
        <div id="btns-holder">
            ${customBtns}
        </div>
    </div>
    `

    let btns = document.querySelectorAll("button");
    btns.forEach(btn => 
        btn.onclick = () => {
            for(let answer of allQuestions[key].answers) {
                if(answer._id === btn.id) {
                    identifier += answer._id;
                    console.log(identifier);
                    if(answer.nextKey) {
                        displayQuestion(answer.nextKey);
                    } else {
                        displayPlaylist()
                    }
                }
            }
        }
    )
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

            contentHolder.appendChild(iframe);
        })
}