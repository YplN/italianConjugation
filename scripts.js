let currentVerb;
let currentTense;
let currentPronoun;

let numQuestion = 0;

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateQuestion() {
    // Select a random verb, tense, and pronoun
    currentVerb = getRandomElement(verbs);
    console.log(currentVerb.indicativo);
    let selectedTenses = Array.from(document.getElementById('tenses').selectedOptions).map(option => option.value);
    currentTense = getRandomElement(selectedTenses);
    currentPronoun = getRandomElement(currentVerb.indicativo.persona);

    // Update prompt, reset input and feedback
    document.getElementById('verb').innerText = `${currentVerb.infinito.capitalize()}`;
    document.getElementById('tense').innerText = `${currentTense}`;
    document.getElementById('pronoun').innerText = `${currentPronoun.capitalize()}`;
    document.getElementById('answer').value = '';
    document.getElementById('feedback').style.visibility = 'hidden';
    document.getElementById('feedback_container').style.visibility = 'hidden';

    const submit_button = document.getElementById("submit_answer");
    submit_button.classList.remove('inactive');
    submit_button.addEventListener("click", submitAnswer);

    difficulty = document.getElementById('difficulty').value;

    displayHints(difficulty);

}

function submitAnswer() {
    let userAnswer = document.getElementById('answer').value.trim().toLowerCase();
    let correctAnswer = currentVerb.indicativo.tempi[currentTense][currentVerb.indicativo.persona.indexOf(currentPronoun)];

    const progressSubBar = document.getElementById(`p_${numQuestion}`);
    progressSubBar.style.visibility = 'visible';

    const feedback = document.getElementById('feedback');
    const feedbackContainer = document.getElementById('feedback_container');

    if (userAnswer === correctAnswer.toLowerCase()) {
        feedback.innerText = 'Correct! Bravo!';
        progressSubBar.style.backgroundColor = 'green';
        feedback.style.color = 'green';
        document.getElementById('continue').style.backgroundColor = 'green';
    } else {
        feedback.innerText = `Incorrect! The correct answer is ${correctAnswer}.`;
        progressSubBar.style.backgroundColor = 'red';
        feedback.style.color = 'red';
        document.getElementById('continue').style.backgroundColor = 'red';
    }


    feedback.style.visibility = 'visible';
    feedbackContainer.style.visibility = 'visible';

    const submit_button = document.getElementById("submit_answer");
    submit_button.classList.add('inactive');
    submit_button.removeEventListener("click", submitAnswer);

    if (numQuestion !== 0) {
        document.getElementById(`p_${numQuestion - 1}`).style.borderRadius = '0px';
    }
    progressSubBar.style.borderBottomRightRadius = "5px";
    progressSubBar.style.borderTopRightRadius = "5px";


    numQuestion++;

    if (numQuestion > 9) {
        resetGame();
    }
}


function resetGame() {
    numQuestion = 0;
    showSettings();
    hideQuestion();

    document.querySelectorAll('.progress').forEach(p => {
        p.style.visibility = 'hidden';
    });

}

function displayHints(difficulty) {
    let hints = document.getElementById('hints');
    hints.innerHTML = '';
    let answerInput = document.getElementById('answer');
    let correctAnswer = currentVerb.indicativo.tempi[currentTense][currentVerb.indicativo.persona.indexOf(currentPronoun)];

    if (difficulty === 'easy') {
        console.log('easy');
        let possibleAnswers = currentVerb.indicativo.tempi[currentTense].slice();
        shuffleArray(possibleAnswers);

        possibleAnswers.forEach(answer => {
            let button = document.createElement('button');
            button.innerText = answer;
            button.classList.add('word-button');
            button.onclick = () => {
                document.getElementById('answer').value = answer;
            };
            hints.appendChild(button);
        });
    } else if (difficulty === 'medium') {
        let shuffledLetters = correctAnswer.split('').sort(() => Math.random() - 0.5);

        shuffledLetters.forEach(letter => {
            let button = document.createElement('button');
            button.innerText = letter;
            button.classList.add('letter-button');
            button.onclick = null;
            button.onclick = () => {
                document.getElementById('answer').value += letter;
                button.classList.add('used');
                button.onclick = null;
            };
            hints.appendChild(button);
        });

        answerInput.addEventListener('click', () => {
            let answerInput = document.getElementById('answer');
            let cursorPosition = answerInput.selectionStart;
            if (cursorPosition > 0 && cursorPosition <= answerInput.value.length) {
                let removedLetter = answerInput.value[cursorPosition - 1];
                answerInput.value = answerInput.value.substring(0, cursorPosition - 1) + answerInput.value.substring(cursorPosition);
                let letterButtons = document.querySelectorAll('.letter-button');
                for (let button of letterButtons) {
                    if (button.innerText === removedLetter && button.classList.contains('used')) {
                        button.classList.remove('used');
                        button.onclick = playButtonLetter;
                        break;
                    }
                }
            }
        });


    }

    answerInput.removeEventListener('keydown', onKeyDown);
    answerInput.removeEventListener('cut', onCutCopyPaste);
    answerInput.removeEventListener('copy', onCutCopyPaste);
    answerInput.removeEventListener('paste', onCutCopyPaste);

    // Add new event listeners
    answerInput.addEventListener('keydown', onKeyDown);
    answerInput.addEventListener('cut', onCutCopyPaste);
    answerInput.addEventListener('copy', onCutCopyPaste);
    answerInput.addEventListener('paste', onCutCopyPaste);
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function playButtonLetter() {
    document.getElementById('answer').value += this.innerText;;
    this.classList.add('used');
    this.onclick = null;
}


function onKeyDown(e) {
    let answerInput = document.getElementById('answer');
    if (e.key === 'Enter') {
        const submit_button = document.getElementById('submit_answer');
        if (submit_button.classList.contains('inactive')) {
            generateQuestion();
        } else {
            submitAnswer();
        }
    } else if (e.key === 'Escape') {
        document.querySelectorAll(".letter-button").forEach(button => {
            button.classList.remove('used');
            button.onclick = playButtonLetter;
        });
        answerInput.value = "";
    } else {
        var difficulty = document.getElementById('difficulty').value;
        if (difficulty == 'medium') {
            e.preventDefault();
            allButtons = document.querySelectorAll('.letter-button');
            let usedLetters = [];
            let unusedLetters = [];
            for (let button of allButtons) {
                if (button.classList.contains('used')) {
                    usedLetters.push(button.innerText);
                } else {
                    unusedLetters.push(button.innerText);
                }
            }
            if (e.key === 'Backspace') {
                if (answerInput.value.length > 0) {
                    console.log(usedLetters);
                    let index;
                    if (answerInput.value.slice(-1) === ' ') {
                        index = usedLetters.indexOf('');
                    } else {
                        index = usedLetters.indexOf(answerInput.value.slice(-1));
                    }
                    if (index > -1) {
                        for (let button of allButtons) {
                            if (button.innerText === usedLetters[index] && button.classList.contains('used')) {
                                button.classList.remove('used');
                                button.onclick = playButtonLetter;
                                answerInput.value = answerInput.value.slice(0, -1);
                                break;
                            }

                        }
                    }

                }
            } else {
                const key = (e.code === "Space") ? "" : e.key;
                let index = unusedLetters.indexOf(key);
                if (index > -1) {
                    for (let button of allButtons) {
                        if (button.innerText === unusedLetters[index] && !button.classList.contains('used')) {
                            button.classList.add('used');
                            button.onclick = null;
                            answerInput.value += e.key; // Add the typed key to the input
                            break;
                        }
                    }
                }
            }
        }
    }
}

function onCutCopyPaste(e) {
    e.preventDefault();
}

function hideSettings() {
    document.getElementById('settings_container').style.display = 'none';
}

function showSettings() {
    document.getElementById('settings_container').style.display = 'flex';
}

function showQuestion() {
    document.getElementById('question_container').style.display = 'flex';
}

function hideQuestion() {
    document.getElementById('question_container').style.display = 'none';
}


Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});