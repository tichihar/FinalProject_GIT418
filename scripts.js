'use strict'

let contentHolder = document.getElementById("quiz-holder");

window.addEventListener("load", function () {
    contentHolder.innerHTML = `
    <div>
        <h1 id="start-title" class="upper-element">Let's capture<br />your mood with<br />Songs!</h1>
        <button id="launch-btn" class="white">Get Started ></button>
    </div>
    `

    this.document.getElementById("launch-btn").onclick = function() {
        contentHolder.innerHTML = "";
        askQuestion();
    }
});

function askQuestion() {
    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            contentHolder.innerHTML = `
            <div>
                <h1 class="upper-element">Question 1</h1>
                <div>
                    <button id="option1">${data.question1.answer1.answer}</button>
                    <button id="option2">${data.question2.answer1.answer}</button>
                </div>
            </div>
            `
        
            let btns = document.querySelectorAll("button");
            btns.forEach(btn => 
                btn.onclick = () => {
                    console.log(btn.id)
                }
            );
        });
}