class Game {
    constructor() {
        this.images = [
            { src: 'https://www.drupal.org/files/project-images/edit%2827117%29.png', hearts: [{x: 10, y: 20}, {x: 50, y: 70}, {x: 80, y: 40}] },
            { src: 'imagen2.jpg', hearts: [{x: 30, y: 60}, {x: 70, y: 30}, {x: 90, y: 80}] },
            { src: 'imagen3.jpg', hearts: [{x: 20, y: 40}, {x: 60, y: 50}, {x: 85, y: 70}] },
            { src: 'imagen4.jpg', hearts: [{x: 15, y: 30}, {x: 55, y: 65}, {x: 75, y: 45}] }
        ];
        this.currentImageIndex = 0;
        this.heartsFound = 0;
        this.totalHearts = 0;
        this.score = 0;
        this.timeLeft = 30;
        this.timerInterval = null;

        this.imageContainer = document.getElementById('image-container');
        this.gameImage = document.getElementById('game-image');
        this.heartsFoundElement = document.getElementById('hearts-found');
        this.totalHeartsElement = document.getElementById('total-hearts');
        this.scoreElement = document.getElementById('score-value');
        this.timerElement = document.getElementById('time-left');
        this.messageArea = document.getElementById('message-area');
        this.startButton = document.getElementById('start-button');
        this.hintButton = document.getElementById('hint-button');
        this.heartSound = document.getElementById('heart-sound');

        this.startButton.addEventListener('click', () => this.startGame());
        this.hintButton.addEventListener('click', () => this.showHint());

        this.backgroundMusic = document.getElementById('background-music');

        this.player1Name = document.getElementById('player1-name');
        this.player2Name = document.getElementById('player2-name');
    }

    startGame() {
        this.currentImageIndex = 0;
        this.heartsFound = 0;
        this.score = 0;
        this.loadImage();
        this.startButton.style.display = 'none';
        this.hintButton.style.display = 'inline-block';
        this.updateScore();

        this.backgroundMusic.play();

        const name1 = this.player1Name.value || "Jugador 1";
        const name2 = this.player2Name.value || "Jugador 2";
        this.showMessage(`${name1} y ${name2}, encuentren los corazones de su amor`);
    }

    loadImage() {
        if (this.currentImageIndex < this.images.length) {
            const currentImage = this.images[this.currentImageIndex];
            this.gameImage.src = currentImage.src;
            this.totalHearts = currentImage.hearts.length;
            this.totalHeartsElement.textContent = this.totalHearts;
            this.heartsFound = 0;
            this.heartsFoundElement.textContent = this.heartsFound;
            this.placeHearts(currentImage.hearts);
            this.resetTimer();
        } else {
            this.endGame();
        }
    }

    placeHearts(hearts) {
        this.imageContainer.innerHTML = '';
        this.imageContainer.appendChild(this.gameImage);
        
        hearts.forEach((heart, index) => {
            const heartElement = document.createElement('img');
            heartElement.src = 'https://clipart-library.com/images/rcjranxMi.png';
            heartElement.className = 'heart';
            heartElement.style.left = heart.x + '%';
            heartElement.style.top = heart.y + '%';
            heartElement.dataset.index = index;
            heartElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.heartClicked(index);
            });
            this.imageContainer.appendChild(heartElement);
        });
    }

    heartClicked(index) {
        const heartElement = this.imageContainer.querySelector(`.heart[data-index="${index}"]`);
        if (heartElement) {
            heartElement.remove();
            this.heartsFound++;
            this.heartsFoundElement.textContent = this.heartsFound;
            this.score += 10 + this.timeLeft;
            this.updateScore();
            this.showMessage('¡Encontraste un corazón!');
            this.playHeartSound();
            if (this.heartsFound === this.totalHearts) {
                this.nextImage();
            }
        }
        this.showRomanticMessage();
        this.createHeartBurst(heartElement);
    }

    showRomanticMessage() {
        const messages = [
            "Tu amor ilumina mi mundo",
            "Cada momento contigo es un tesoro",
            "Eres el latido de mi corazón",
            "Nuestro amor es eterno",
            "Contigo, cada día es San Valentín"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.showMessage(randomMessage);
    }

    createHeartBurst(heartElement) {
        const burst = document.createElement('div');
        burst.className = 'heart-burst';
        burst.style.left = heartElement.style.left;
        burst.style.top = heartElement.style.top;
        this.imageContainer.appendChild(burst);
        setTimeout(() => burst.remove(), 1000);
    }

    resetTimer() {
        clearInterval(this.timerInterval);
        this.timeLeft = 30;
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            if (this.timeLeft <= 0) {
                this.nextImage();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        this.timerElement.textContent = this.timeLeft;
    }

    nextImage() {
        clearInterval(this.timerInterval);
        this.currentImageIndex++;
        if (this.currentImageIndex < this.images.length) {
            this.loadImage();
            this.showMessage('¡Imagen completada! Pasando a la siguiente...');
        } else {
            this.endGame();
        }
    }

    showMessage(msg) {
        this.messageArea.textContent = msg;
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    playHeartSound() {
        this.heartSound.currentTime = 0;
        this.heartSound.play();
    }

    showHint() {
        const hearts = this.imageContainer.getElementsByClassName('heart');
        if (hearts.length > 0) {
            const randomIndex = Math.floor(Math.random() * hearts.length);
            hearts[randomIndex].style.opacity = '1';
            setTimeout(() => {
                hearts[randomIndex].style.opacity = '0.5';
            }, 1000);
            this.score -= 5;
            this.updateScore();
        }
    }

    endGame() {
        this.backgroundMusic.pause();

        clearInterval(this.timerInterval);
        this.showMessage(`¡Has encontrado todos los corazones de mi amor! Tu puntuación de amor es: ${this.score}`);
        this.startButton.style.display = 'block';
        this.startButton.textContent = 'Volver a enamorarse';
        this.hintButton.style.display = 'none';
        
        // Mostrar un mensaje final romántico
        setTimeout(() => {
            alert("Gracias por jugar. Recuerda que nuestro amor es como estos corazones escondidos: siempre presente, aunque a veces haya que buscarlo con atención. ¡Feliz San Valentín!");
        }, 1000);
    }
}

const game = new Game();