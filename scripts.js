'use strict'
// v
let contentHolder = document.getElementById("main-content");
// contains data retrieved from the questions.json 
let allQuestions;
// contains data retrieved from the playlists.json 
let allPlaylists;
// unique number to track which path the user took to match it with the playlist number
let identifier = "";
// track the progress
let progressValue = 0;

let currentValue = 0;

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
window.addEventListener("load", () => {
    fetch("playlists.json")
        .then(response => response.json())
        .then(data => {
            allPlaylists = data;
        });
    newQuiz();
    intializeSwiper()
});

// function to display the first page
function newQuiz() {
    //initialize identifier and progress value
    identifier = "";
    progressValue = 0;
    currentValue = 0;

     // create a landing/start page and add it to the main-content
     let introHolder = document.createElement("div");
     introHolder.setAttribute("id", "intro-holder")
     introHolder.classList.add("transparent", "main-script");
     introHolder.innerHTML = `
     <h1 id="start-title" class="upper-element">Let's capture<br />your mood with<br />Songs!</h1>
     <button id="launch-btn" class="white">Get Started ></button>
     `;
     contentHolder.appendChild(introHolder)

     setTimeout(() => {
        revealElement("intro-holder");
     }, 1000)
 
     // launch the quiz upon click to add event to the button to start the quiz
     document.getElementById("launch-btn").onclick = function() {
        // prevent from clicking more than one time
        document.getElementById("launch-btn").disabled = true;

        removeElement("intro-holder");

        // create an element to display quiz info
        const quizHolder = document.createElement("div");
        quizHolder.setAttribute("id", "quiz-holder");
        quizHolder.classList.add("main-script", "transparent")

        // create a progress bar to track the quiz progrss
        const pBar = document.createElement("div");
        pBar.setAttribute("id", "progress-bar");
        pBar.classList.add("transparent");

        // get data from the questions.json and assign it in the allQuestions variable
        fetch("questions.json")
            .then(response => response.json())
            .then(data => {
                allQuestions = data;
            });
        
        // append all elements created in this function after the introHolder is completely gone
        setTimeout(() => {
            contentHolder.appendChild(quizHolder);
            contentHolder.appendChild(pBar);
            addProgressBar(progressValue)
            displayQuestion("Q1-1");
        }, 1000)
    }
}
// function to display questions
function displayQuestion(key) {
    // access quiz-holder in the DOM tree
    const quizHolder = document.getElementById("quiz-holder")

    // insert bubbles
    bubbleGenerator(key);

    // create a set of button elements
    let customBtns = "";
    for(let option of allQuestions[key].answers) {
        customBtns += `
        <button id="${option._id}">${option.answer}</button>
        `;
    }

    quizHolder.innerHTML = `
    <h2 class="upper-element">${allQuestions[key].question}</h1>
    <div id="btns-holder">
        ${customBtns}
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

    setTimeout(() => {
        revealElement("quiz-holder");
    }, 1500)

    let btns = document.querySelectorAll("button");
    btns.forEach(btn => 
        btn.onclick = () => {
            quizHolder.classList.remove("fade-in")
            // disable the button action to avoid clicking more than two times
            btns.forEach(btn => btn.disabled = true);

            // increase the value in the progress bar
            progressValue += 25;

            // see which button the user clicked
            for(let answer of allQuestions[key].answers) {
                if(answer._id === btn.id) {
                    //pick the colors for the progress bar
                    const colorSelection = answer.color;
                    const firstPick = Math.floor(Math.random() * 3);
                    const color1 = "#" + colorSelection[firstPick];
                    colorSelection.splice(firstPick, 1);
                    const color2 = "#" + colorSelection[Math.floor(Math.random() * 2)];

                    // update the identifier
                    identifier += answer._id;

                    // check if there are still quizes left
                    if(progressValue < 100) {
                        quizHolder.classList.add("fade-out");
                        // remove bubbles
                        removeBubbles();
                        setTimeout(() => {
                            quizHolder.classList.add("transparent");
                            quizHolder.classList.remove("fade-out");
                            displayQuestion(answer.nextKey);
                        },2000)
                    } else {
                        removeElement("quiz-holder");
                        removeElement("progress-bar");
                        updateMoodList();
                        displayPlaylist().then(() => {
                            intializeSwiper()
                        });
                    }
                    // update Progress
                    updateProgressBar(progressValue, color1, color2);
                }
            }
        }
    )
};

function displayPlaylist() {
    return new Promise ((resolve) => {
        // create an element to display the result
        let resultHolder = document.createElement("div");
        resultHolder.setAttribute("id", "result-holder");
        resultHolder.classList.add("main-script", "transparent");

        contentHolder.appendChild(resultHolder);

        // create a title and discriptions
        let intro = document.createElement("p");
        intro.innerText = "The captured vibe was..."

        let title = document.createElement("h2");
        title.setAttribute("id", "playlist-title");
        title.innerText = allPlaylists[identifier].title

        // create an iframe element to embed a spotify info
        let iframe = document.createElement("iframe");
        iframe.width = "95%";
        iframe.height = "300";
        iframe.allow = "encrypted-media";
        iframe.src = `https://open.spotify.com/embed/playlist/${allPlaylists[identifier].link}?utm_source=generator`;

        // swiper
        let swiper = document.createElement("div");
        swiper.classList.add("swiper");
        let swiperWrapper = document.createElement("div")
        swiperWrapper.classList.add("swiper-wrapper")

        let userPlaylists = JSON.parse(localStorage.getItem("capturedMood"));

        userPlaylists.forEach(playlist => {
            let swiperSlider = document.createElement("div");
            swiperSlider.classList.add("swiper-slide");
            swiperSlider.innerHTML = `<div>${allPlaylists[playlist].title}</div>`;

            swiperWrapper.appendChild(swiperSlider);
        })

        const pagination = document.createElement("div");
        pagination.classList.add("swiper-pagination");

        const prevBtn = document.createElement("div");
        prevBtn.classList.add("swiper-button-prev");

        const nextBtn = document.createElement("div");
        nextBtn.classList.add("swiper-button-next");

        swiper.appendChild(swiperWrapper);
        swiper.appendChild(pagination);
        swiper.appendChild(prevBtn);
        swiper.appendChild(nextBtn);


        // create a button to let users take the quiz again
        let retakeBtn = document.createElement("button")
        retakeBtn.innerText = "Take the Quiz Again"

        //create a button to delete the stored data
        let deleteBtn = document.createElement("button")
        deleteBtn.innerText = "Delete saved playlists";

        setTimeout(() => {
            resultHolder.appendChild(intro);
            resultHolder.appendChild(title);
            resultHolder.appendChild(iframe);
            resultHolder.appendChild(swiper);
            resultHolder.appendChild(retakeBtn);
            resultHolder.appendChild(deleteBtn);
            resultHolder.classList.add("fade-in");

            retakeBtn.onclick = () => {
                retakeBtn.disabled = true;
                removeElement("result-holder");
                removeBubbles();
                setTimeout(newQuiz, 1500);
            };

            deleteBtn.onclick = () => {localStorage.clear();};

            setTimeout(() => {
                resolve();
              }, 50);
        }, 2000);
    });
};

function updateMoodList() {
    let storedPlaylists = JSON.parse(localStorage.getItem("capturedMood")) || [];

    storedPlaylists.push(identifier);
    console.log(storedPlaylists);

    localStorage.setItem("capturedMood", JSON.stringify(storedPlaylists));
}

function intializeSwiper() {
   return new Promise ((resolve) => {
    let swiper = new Swiper(".swiper", {
        // ドットインジケーターの表示
        pagination: {
          el: ".swiper-pagination",
        },
        // 前後スライドボタンを表示
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        slidesPerView: 1.6, // 表示するスライドの枚数
        centeredSlides : true, // スライドを中央揃えを有効化
        effect: "coverflow",
        coverflowEffect: {
            rotate: 0, // スライドの回転角度
            stretch: 50, // スライドの間隔（px単位）
            depth: 200, // 奥行きの設定（translateをZ方向にpx単位で移動）
            modifier: 1, //
            slideShadows : true, // 先頭スライドのbox-shadowを有効化
        },
        loop: true, // ループの有効化
      });
      swiper.update();

      setTimeout(() => {
        resolve();
      }, 50);
    });
}

function revealElement(element) {
    let targetElement = document.getElementById(element);
    targetElement.classList.add("fade-in");
    targetElement.classList.remove("transparent");
}

function removeElement(element) {
    let targetElement = document.getElementById(element);
    targetElement.classList.add("fade-out");
    targetElement.classList.remove("fade-in");
    setTimeout(() => {
        targetElement.remove();
    }, 1025)
}

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

function removeBubbles() {
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
function addProgressBar() {
    const $pBar = $("#progress-bar");
    $pBar.progressbar({
        value: 0
    })
    setTimeout(() => {
        $pBar.addClass("fade-in");
        $pBar.removeClass("transparent");
    }, 1500);
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