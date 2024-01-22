let timer = 30
let level = 1
let score = 0;
let round
let playerName
let board = document.querySelector('#boardGame')
let nbBlock = 16;
let sqrt = 100/Math.sqrt(nbBlock)
let rand
let oldRand
let victory = false
let defeat = false
let interval = 1000
let block

    

document.querySelector('#startGame').addEventListener('click', () =>{
    //TODO permettre au joueur d'entrer son nom
    document.body.style.cursor = "url('/public/img/4.cur'), auto";

    timer = setInterval(() => {
        timer += 1;
        document.querySelector('#timer').innerText = `Time: ${timer}s`;
    
        if (timer === 0) {
            clearInterval(timer);
        }
    }, 2000);

    document.querySelector('#startGame').classList.add('none')
    victory = false
    defeat = false
    for (let i = 1; i <= nbBlock; i++){
        var element = `<div class="block" data-id="${i}"></div>`
        board.innerHTML += element
    }
    document.querySelector('#boardGame').addEventListener('click', (event) => {
        const clic = event.target;
    
        if (clic.classList.contains('character')) {
            clic.classList.remove('character');
            incrementScore(); 
            displayScore(); 
            displayCharacter();
        }
    });
    
    function incrementScore() {
        score += 1;
        if (score % 5 === 0) {
            level += 1;
            document.querySelector('#niveau').innerText = `Niveau: ${level}`;
        }
    }
    
    function displayScore() {
        document.querySelector('#score').innerText = `Score : ${score}`;
    }
    

    document.querySelectorAll('.block').forEach((block) => {
        block.style.width=`${sqrt -1}%`
        block.style.height=`${sqrt}%`
    })
    displayCharacter()
    
})
removeCharacter()
checkVictory()
checkDefeat()
displayScore()
rand()

function getRandomInt() {
    return Math.floor(Math.random() * nbBlock); 
  }
  
function displayCharacter() {
    setInterval(() => {
        document.querySelectorAll('.block').forEach((block) => {
            block.classList.remove('character');
        });

        let block = document.querySelector(`[data-id='${getRandomInt(nbBlock)}']`);
        block.classList.add('character');
    }, interval);
}



function checkVictory() {
    if (score === round) {
        victory = true
    }
}

function checkDefeat() {
    if (defeat === true) {
        alert('Game Over')
    }
}
function displayScore() {
    document.querySelector('#score').innerHTML = score
}

timer = setInterval(() => {
    time -= 1;
    document.querySelector('#timer').innerText = `Time: ${time}s`;

    if (time === 0) {
        clearInterval(timer);
    }
}, 1000);
