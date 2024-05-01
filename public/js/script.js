let countdown = 30
let level = 1
let score = 0;
let playerName
let board = document.querySelector('#boardGame')
let nbBlock = 16;
let sqrt = 100/Math.sqrt(nbBlock)
let victory = false
let defeat = false
let interval
let block
let baseSpeed = 5000;
    

document.querySelector('#startGame').addEventListener('click', () =>{
    //TODO permettre au joueur d'entrer son nom
    playerName = prompt('Entrez votre nom :')
    timer = setInterval(() => {
        countdown -= 1;
        document.querySelector('#timer').innerText = `Time: ${countdown}s`;
    
        if (countdown === 0) {
            clearInterval(timer);
            defeat = true;
            checkDefeat();
        }
    }, baseSpeed);


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
            checkDefeat();
        }else{
            score -=5;
            document.querySelector('$score').innerText = `Score: ${score}`;
            if (score < 0){
                score = 0;
                defeat = true
                document.querySelector('$affichageVictoire').innerText = 'Game Over';
                clearInterval(timer);
            }
            checkVictory();
            checkDefeat();
        }
    });
    
    function incrementScore() {
        score += 10;
        if (score >= 50 ) {
            level += 1;
            document.querySelector('#niveau').innerText = `Niveau: ${level}`;
            score = 0
            victory = true
            checkVictory()
            interval -= 50
            
            countdown = 30
        }
        displayScore();
        checkGameOver();
    }
    
    function displayScore() {
        document.querySelector('#score').innerText = `Score : ${score}`;
        document.querySelector('#niveau').innerText = `Niveau:  ${level}`;
        document.querySelector('#timer').innerText = `Time:  ${countdown}s`;
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

function calculateSpeed(){
    return (level === 1) ? baseSpeed : baseSpeed - (level * 100);
}
  
function displayCharacter() {
    gameInterval = setInterval(() => {
        document.querySelectorAll('.block').forEach((block) => {
            block.classList.remove('character');
        });

        let block = document.querySelector(`[data-id='${getRandomInt(nbBlock)}']`);
        block.classList.add('character');
    }, calculateSpeed());
}



function checkVictory() {
    if (level === maxLevel) {
        victory = true
        level += 1;
        alert('You won!')
        resetGame();
    }
}

function checkDefeat() {
    if (defeat === true) {
        alert('Game Over')
        askForReplay();
    }
}
function askForReplay() {
    const replay = confirm('Voulez-vous rejouer?');
    if (replay) {
        resetGame();
    }
}
function resetGame(){
    // clearInterval(gameInterval);
    clearInterval(timer);

    score = 0;
    defeat = false;
    level = 1;
    countdown = 30;

    interval = baseSpeed;

    document.querySelector('#score').innerText = 'Score : 0';
    document.querySelector('#niveau').innerText = 'Niveau: 1';
    document.querySelector('#timer').innerText = 'Time: 30s';
    document.querySelector('#boardGame').innerHTML = '';

    document.querySelector('#startGame').classList.remove('none');
}
function displayScore() {
    document.querySelector('#score').innerHTML = score
}

function checkGameOver() {
    if (countdown === 0 && !victory) {
        defeat = true;
        alert('Game Over');
        askForReplay();
    }
}