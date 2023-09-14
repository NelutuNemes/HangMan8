//https://random-word-api.herokuapp.com/word?length=5
let cuvantul_ascuns = document.getElementById("first-section");
let hint_for_user = document.getElementById("hint");
let keyboard_first_row = document.getElementById("keyboard-first-row");
let keyboard_second_row = document.getElementById("keyboard-second-row");
let keyboard_third_row = document.getElementById("keyboard-third-row");
let game_result = document.getElementById("game-result");
let bad_user_choices = document.getElementById("bad-user-choices");
let correct_user_choices = document.getElementById("correct-user-choices");

const alphabet_first_row = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const alphabet_second_row = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const alphabet_third_row = ["Z", "X", "C", "V", "B", "N", "M"];
const user_key_choice = [];

let random_generated_word; // Variabila pentru cuvântul generat aleatoriu
let pushed_letter; // Declar o variabila pushed_letter înainte de a o folosi
let correct_choice_counter = 0; // Contor pentru literele corecte
let wrong_choice_counter = 0; // Contor pentru literele greșite
let first_section = document.getElementById("first-section");

// const apiUrlEasy = "https://random-word-api.herokuapp.com/word?length=5";
const apiUrl_medium = "https://random-word-api.herokuapp.com/word?length=8";
// const apiUrlHard = "https://random-word-api.herokuapp.com/word?length=12";
const difficulty_form = document.getElementById("difficulty-form");
const wrong_message = document.getElementById("wrong-message");
const correct_message = document.getElementById("correct-message");

// Obținem elementul select și butonul de submit din formular
const select = document.getElementById("difficulty-select");
const submitButton = document.getElementById("submit-button");

const navbar = document.getElementById("navbar");

let player_wins = 0;
let computer_wins = 0;


// Definesc URL-urile pentru nivelele de dificultate
const difficulty_urls = {
    "Ușor": "https://random-word-api.herokuapp.com/word?length=5",
    "Mediu": "https://random-word-api.herokuapp.com/word?length=8",
    "Dificil": "https://random-word-api.herokuapp.com/word?length=12",
};
// Declar variabila 'apiUrl' pentru a stoca URL-ul API corespunzător nivelului de dificultate implicit (de exemplu, mediu)
let apiUrl = apiUrl_medium;

// Adaugăm un eveniment "change" pentru elementul select
select.addEventListener("change", function () {
    // Obținem valoarea selectată
    const selectedValue = select.value;

    // Actualizez apiUrl în funcție de valoarea selectată
    switch (selectedValue) {
        case "Easy":
            apiUrl = difficulty_urls["Ușor"] || apiUrl_medium;
            break;
        case "Medium":
            apiUrl = difficulty_urls["Mediu"] || apiUrl_medium;
            break;
        case "Hard":
            apiUrl = difficulty_urls["Dificil"] || apiUrl_medium;
            break;
        default:
            // Dacă valoarea selectată nu corespunde niciunei opțiuni cunoscute, puteți trata acest caz sau să lăsați apiUrl neschimbat.
            break;
    }
});
// Adaug un eveniment "submit" pentru formular pentru a preveni comportamentul implicit al formularului
submitButton.addEventListener("click", function (event) {
    event.preventDefault(); // Previn trimiterea formularului

    // Fac cererea către API utilizând 'apiUrl'
    fetch_data_from_api(apiUrl);
});


document.addEventListener("DOMContentLoaded", function () {
    generateKeyboard(); // Apelează funcția pentru a crea tastatura inițială
});





//facem apel catre api
function fetch_data_from_api(apiUrl) {
    // Sterg cuvântul vechi si hintul vechi
    cuvantul_ascuns.innerHTML = '';
    hint_for_user.innerHTML = 'Hint   :<p class="spacer"></p>';
    fetch(apiUrl)
        .then(response => {
            //handle response            
            return response.json();
        })
        .then(data => {
            //handle data
            random_generated_word = data[0]; // Atribuim cuvantul generat la variabila globala
            let result = random_generated_word.split("");
            console.log(result);
            result.forEach(function (item) {
                let span = document.createElement("span");
                span.innerText = item;
                // span.setAttribute("class", item);
                //adaugam o clasa span-ul cu....
                span.setAttribute("class", `unknown ${item}`);
                // span.setAttribute("class", "unknown");
                cuvantul_ascuns.appendChild(span);
            });
            console.log(data[0]);
            console.log(random_generated_word);


            let unknown_letters = document.getElementsByClassName("unknown");
            console.log(unknown_letters);

            let hint_letters = [];
            Array.prototype.forEach.call(unknown_letters, (element) => {
                hint_letters.push(element.innerText);
            });
            console.log(hint_letters);
            let hintSpan = document.createElement("span");
            hintSpan.innerText = hint_letters[(Math.floor(Math.random() * hint_letters.length))];
            hint_for_user.appendChild(hintSpan);


        })
        .catch(error => {
            //handle error
        });
}
// Apelul funcției pentru a face cererea către API
fetch_data_from_api(apiUrl);


// Funcție de verificare dacă litera tastată este în cuvântul generat
function check_Letter_InWord(letter) {
    letter = letter.toLowerCase();
    if (random_generated_word.includes(letter)) {
        console.log("Litera este în cuvânt!");
        // contorizam
        let correct_spans = document.getElementsByClassName(letter);
        console.log(correct_spans.length);
        correct_choice_counter = correct_choice_counter + correct_spans.length;

        Array.prototype.forEach.call(correct_spans, (element) => {
            element.classList.add("correct");
        });
        console.log("Incercari reusite", correct_choice_counter);
        correct_user_choices.textContent = correct_choice_counter;
        // Afisez un mesaj temporar pentru alegere corectă
        correct_message.textContent = "Right choice !";
        setTimeout(function () {
            correct_message.textContent = ""; // Șterge mesajul după 2s
        }, 2000); // 2000 milisecunde = 2 secunde
        // Actualizează bara de progres
        updateProgressBar();
    } else {
        console.log("Litera nu este în cuvânt.");
        // contorizam
        wrong_choice_counter++;
        console.log("Incercari Nereusite", wrong_choice_counter);
        bad_user_choices.textContent = wrong_choice_counter;
        // Afisez un mesaj temporar pentru alegere incorecta
        wrong_message.textContent = "Wrong choice !";
        setTimeout(function () {
            wrong_message.textContent = ""; // Șterge mesajul după 2s
        }, 2000); // 2000 milisecunde = 2 secunde

        // Actualizează bara de progres
        updateProgressBar();
        drawNextHangmanPart();
    }

    if (correct_choice_counter === random_generated_word.length) {
        console.log("Ai castigat !");
        game_result.style.color = "light-green";
        game_result.textContent = "Congratulations ! You are a winner ! The game is over !";
        player_wins++;
        updateWinsOnPage();
        navbar.style.display = "block";
        setTimeout(function () {
            navbar.style.display = "none";

        }, 3000);



    } else if (wrong_choice_counter === 6) {
        console.log("Ai pierdut! Jocul s-a încheiat.");
        game_result.textContent = "I'm sorry, you lost ! The game is over !";
        game_result.style.color = "red";
        first_section.style.backgroundColor = "#c1bebe";
        setTimeout(function () {
            first_section.style.backgroundColor = "white";
        }, 2000); // Aduce inapoi coloarea alb a backround-ului după 2 secunde
        computer_wins++;
        setTimeout(function () {
            updateWinsOnPage();
        }, 2000);
        navbar.style.display = "block";
        setTimeout(function () {
            navbar.style.display = "none";

        }, 3000);



    }
}

function updateWinsOnPage() {
    const player_wins_element = document.getElementById("player-wins");
    const computer_wins_element = document.getElementById("computer-wins");

    // Resetez valorile pentru o nouă rundă aici
    correct_choice_counter = 0;
    wrong_choice_counter = 0;
    fetch_data_from_api(apiUrl);
    ///resetez afisarea contoarelor de alegeri corecte/gresite
    correct_user_choices.textContent = correct_choice_counter;
    bad_user_choices.textContent = wrong_choice_counter;
    setTimeout(function () {
        game_result.textContent = "Round result !";
    }, 3000);
    // Fac din nou tastatura activă
    generateKeyboard();
    resetHangman();
    initCanvas();
    setTimeout(function () {
        resetProgressBar();
    }, 2000);

    check_Letter_InWord


    // Actualizați conținutul elementelor HTML cu câștigurile actuale
    player_wins_element.textContent = `Player : ${player_wins} points`;
    computer_wins_element.textContent = `Computer : ${computer_wins} points`;
}

function resetHangman() {
    // Șterge canvasul și resetați variabila currentHangmanPart
    context.clearRect(0, 0, canvas.width, canvas.height);
    currentHangmanPart = 0;
}
function resetProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const progressMessage1 = document.getElementById("progress-message");
    const progressMessage2 = document.getElementById("progress-message");
    const progressMessage3 = document.getElementById("progress-message");

    progressBar.style.width = "100%"; // Resetează lungimea la 100%
    progressBar.style.backgroundColor = "rgb(145, 145, 235)"; // Schimbă culoarea la cea dorită

}




//reactivare tastatura
function generateKeyboard() {
    // Șterge tastatura veche, dacă există
    keyboard_first_row.innerHTML = '';
    keyboard_second_row.innerHTML = '';
    keyboard_third_row.innerHTML = '';

    // Crează tastatura nouă
    alphabet_first_row.forEach(function (item) {
        let span = document.createElement("span");
        function clickHandler(el) {
            if (!span.classList.contains("disabled")) {
                console.log(el, this.innerText);
                pushed_letter = item;
                user_key_choice.push(pushed_letter);

                check_Letter_InWord(pushed_letter); // Apelează funcția pentru a verifica litera în cuvânt

                span.classList.add("disabled"); // Adaugă clasa CSS pentru a o face să arate dezactivată
                span.removeEventListener("click", clickHandler); // Elimină gestionarea evenimentului de clic
            }
        }
        span.addEventListener("click", clickHandler);
        span.innerText = item;
        keyboard_first_row.appendChild(span);
    });
    alphabet_second_row.forEach(function (item) {
        let span = document.createElement("span");
        function clickHandler(el) {
            if (!span.classList.contains("disabled")) {
                console.log(el, this.innerText);
                pushed_letter = item;
                user_key_choice.push(pushed_letter);
                check_Letter_InWord(pushed_letter); // Apelează funcția pentru a verifica litera în cuvânt
                span.classList.add("disabled"); // Adaugă clasa CSS pentru a o face să arate dezactivată
                span.removeEventListener("click", clickHandler); // Elimină gestionarea evenimentului de clic
            }
        }
        span.addEventListener("click", clickHandler);
        span.innerText = item;
        keyboard_second_row.appendChild(span);
    });
    alphabet_third_row.forEach(function (item) {
        let span = document.createElement("span");
        function clickHandler(el) {
            if (!span.classList.contains("disabled")) {
                console.log(el, this.innerText);
                pushed_letter = item;
                user_key_choice.push(pushed_letter);

                check_Letter_InWord(pushed_letter); // Apelează funcția pentru a verifica litera în cuvânt

                span.classList.add("disabled"); // Adaugă clasa CSS pentru a o face să arate dezactivată
                span.removeEventListener("click", clickHandler); // Elimină gestionarea evenimentului de clic
            }
        }
        span.addEventListener("click", clickHandler);
        span.innerText = item;
        keyboard_third_row.appendChild(span);
    });
}





document.getElementById("reset-button").addEventListener("click", function () {
    location.reload();
    initCanvas();
});


//funcția de actualizare a barei de progres
function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const progressMessage1 = document.getElementById("progress-message");
    const progressMessage2 = document.getElementById("progress-message");
    const progressMessage3 = document.getElementById("progress-message");

    const maxWrongChoices = 6;
    const currentWrongChoices = wrong_choice_counter;

    // Calculează procentul pentru bara de progres
    const progressPercentage = ((maxWrongChoices - currentWrongChoices) / maxWrongChoices) * 100;

    // Actualizează stilul barei de progres
    progressBar.style.width = progressPercentage + "%";

    // Dacă numărul de alegeri greșite ajunge la maxim, resetează bara de progres
    if (currentWrongChoices === maxWrongChoices) {
        progressBar.style.width = "0%";
        progressBar.style.backgroundColor = "white";
        progressMessage1.textContent = "What lives, my friend?";

        setTimeout(function () {
            progressMessage2.textContent = "I'm sorry, but you've just lost your life!";
        }, 1000); // Afișează al doilea mesaj după 3 secunde
        setTimeout(function () {
            progressMessage3.textContent = "I mean, you're dead!";
        }, 2000); // Afișează al treilea mesaj după 6 secunde
        // Șterge ultimul mesaj după 4 secunde
        setTimeout(function () {
            progressMessage3.textContent = "";
        }, 3000);
    }
}


//Stilizare aparitie navbar
// Ascund inițial bara de navigare
navbar.style.display = "none";

// Adaug un eveniment pentru detectarea mișcării mouse-ului
document.addEventListener("mousemove", function (event) {
    // Verifică dacă mouse-ul este aproape de marginea de sus a paginii
    if (event.clientY <= 120) {
        navbar.style.display = "block"; // Afișează bara de navigare
    } else {
        navbar.style.display = "none"; // Ascunde bara de navigare
    }
});
// Ascund inițial bara de navigare
navbar.style.display = "none";

// Adaug un eveniment pentru detectarea mișcării mouse-ului peste bara de navigare și lista de opțiuni
navbar.addEventListener("mouseenter", function () {
    navbar.style.display = "block"; // Afișează bara de navigare
});

// Adaug un eveniment pentru detectarea mișcării mouse-ului în afara barei de navigare și liste de opțiuni
navbar.addEventListener("mouseleave", function () {
    setTimeout(function () {
        navbar.style.display = "none"; // Ascunde bara de navigare
    }, 2000);
});



// Inițializez canvasul pentru partea statică a hangmanului
function initCanvas() {
    const canvas = document.getElementById("hangman-canvas");
    const context = canvas.getContext("2d");

    // codul pentru desenarea partii statice a hangmanului aici
    // Desenează partea verticală
    //si orizontala a spanzuratorii
    context.fillStyle = "grey";
    context.fillRect(30, 140, 115, 5);
    context.fillRect(50, 5, 10, 135);
    context.fillRect(30, 5, 175, 5);
    // context.fillRect(45, 15, 115, 3);


    // Desenează linia diagonală
    context.lineWidth = 5;
    context.strokeStyle = "grey";
    context.beginPath();
    context.moveTo(110, 8); // Punctul de pornire
    context.lineTo(55, 45); // Punctul final
    context.stroke();
    // Resetează grosimea liniei la valoarea implicită (1)
    context.lineWidth = 1;
    context.strokeStyle = "black";
    //Deseneaza franghia
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(150, 5); // Punctul de pornire
    context.lineTo(150, 14); // Punctul final
    context.moveTo(160, 5); // Punctul de pornire
    context.lineTo(160, 10); // Punctul final
    context.moveTo(170, 5); // Punctul de pornire
    context.lineTo(170, 25); // Punctul final
    context.moveTo(180, 5); // Punctul de pornire
    context.lineTo(180, 10); // Punctul final

    context.stroke();
    context.lineWidth = 2;


}

const canvas = document.getElementById("hangman-canvas");
const context = canvas.getContext("2d");
// Desenează partea verticală
//si orizontala a spanzuratorii
context.fillStyle = "grey";
context.fillRect(30, 140, 115, 5);
context.fillRect(50, 5, 10, 135);
context.fillRect(30, 5, 175, 5);
// context.fillRect(45, 15, 115, 3);


// Desenează linia diagonală
context.lineWidth = 5;
context.strokeStyle = "grey";
context.beginPath();
context.moveTo(110, 8); // Punctul de pornire
context.lineTo(55, 45); // Punctul final
context.stroke();
// Resetează grosimea liniei la valoarea implicită (1)
context.lineWidth = 1;
context.strokeStyle = "black";
//Deseneaza franghia
context.lineWidth = 3;
context.beginPath();
context.moveTo(150, 5); // Punctul de pornire
context.lineTo(150, 14); // Punctul final
context.moveTo(160, 5); // Punctul de pornire
context.lineTo(160, 10); // Punctul final
context.moveTo(170, 5); // Punctul de pornire
context.lineTo(170, 25); // Punctul final
context.moveTo(180, 5); // Punctul de pornire
context.lineTo(180, 10); // Punctul final

context.stroke();
context.lineWidth = 2;

const hangmanParts = [
    drawHead,
    drawBody,
    drawLeftArm,
    drawRightArm,
    drawLeftLeg,
    drawRightLeg
];

let currentHangmanPart = 0;

function drawHead() {
    context.lineWidth = 3;
    context.beginPath();
    context.arc(170, 38, 12, 0, Math.PI * 2);
    context.stroke();
}

function drawBody() {
    context.lineWidth = 3;
    context.moveTo(170, 50);
    context.lineTo(170, 90);
    context.stroke();
}

function drawLeftArm() {
    context.moveTo(170, 55);
    context.lineTo(130, 70);
    context.stroke();
}

function drawRightArm() {
    context.moveTo(170, 55);
    context.lineTo(210, 70);
    context.stroke();
}

function drawLeftLeg() {
    context.moveTo(170, 89);
    context.lineTo(130, 120);
    context.stroke();
}

function drawRightLeg() {
    context.moveTo(170, 89);
    context.lineTo(200, 120);
    context.stroke();
}

//Apel pentru a desena o parte a hangman-ului
//apelez funcția corespunzătoare în funcția check_Letter_InWord

function drawNextHangmanPart() {
    if (currentHangmanPart < hangmanParts.length) {
        const drawFunction = hangmanParts[currentHangmanPart];
        drawFunction();
        currentHangmanPart++;
    }
}


const themeSelect = document.getElementById("theme-select");
const submitButton2 = document.getElementById("submit-button2");
const body_theme = document.getElementById("body");
const keyboard_theme = document.getElementById("keyboard");

let currentTheme = "Clean-white"; // Tema curentă implicită

submitButton2.addEventListener("click", (event) => {
    event.preventDefault();

    const selectedTheme = themeSelect.value;

    // Schimb tema curentă doar dacă este diferită de tema selectată
    if (selectedTheme !== currentTheme) {
        // Elimin clasa CSS a temei anterioare (dacă există)
        body_theme.classList.remove("gradient-background", "gradient-background2", "gradient-background3");
        keyboard_theme.classList.remove("gradient-background", "gradient-background2", "gradient-background3");

        // Actualizează tema curentă
        currentTheme = selectedTheme;

        // Actualizează culoarea de fundal a întregii pagini
        switch (selectedTheme) {
            case "Clean-white":
                document.documentElement.style.removeProperty("--main-background-color");
                body_theme.style.backgroundColor = "#ffffff";
                break;
            case "Barbie-Pink":
                document.documentElement.style.setProperty("--main-background-color", "#fffff");
                body_theme.classList.add("gradient-background");
                keyboard_theme.classList.add("gradient-background");
                break;
            case "Blue-blade":
                document.documentElement.style.setProperty("--main-background-color", "#fffff");
                body_theme.classList.add("gradient-background2");
                keyboard_theme.classList.add("gradient-background2");
                break;
            case "Green-beetle":
                document.documentElement.style.setProperty("--main-background-color", "#ffffff");
                body_theme.classList.add("gradient-background3");
                keyboard_theme.classList.add("gradient-background3");
                break;
            default:
                // Dacă nu se potrivește cu nicio temă cunoscută, nu face nimic.
                break;
        }
    }
});

