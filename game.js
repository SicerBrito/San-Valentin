class Game {
    constructor() {
        this.images = [
            { src: 'https://media.istockphoto.com/id/1416797815/es/foto/golden-n%C3%BAmero-uno.jpg?s=612x612&w=0&k=20&c=cK-oYEs4j7BcU_Z5Vv7GvunHu6syIFU_DM8u9ox4NlQ=', hearts: [{x: 10, y: 20}, {x: 50, y: 70}, {x: 80, y: 40}] },
            { src: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.123rf.com%2Fclipart-vector%2Fnumeros_uno.html&psig=AOvVaw2X5EIVoi2qsc7HUGQ1pfLu&ust=1724860205290000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPC0lpLDlYgDFQAAAAAdAAAAABAJ', hearts: [{x: 30, y: 60}, {x: 70, y: 30}, {x: 90, y: 80}] },
            { src: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.123rf.com%2Fclipart-vectorizado%2Fthe_number_one.html&psig=AOvVaw2X5EIVoi2qsc7HUGQ1pfLu&ust=1724860205290000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPC0lpLDlYgDFQAAAAAdAAAAABAQ', hearts: [{x: 20, y: 40}, {x: 60, y: 50}, {x: 85, y: 70}] },
            { src: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fgaleria.dibujos.net%2Fletras-y-numeros%2Fnumeros%2Fnumero-1-pintado-por--11739672.html&psig=AOvVaw2X5EIVoi2qsc7HUGQ1pfLu&ust=1724860205290000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPC0lpLDlYgDFQAAAAAdAAAAABAX', hearts: [{x: 15, y: 30}, {x: 55, y: 65}, {x: 75, y: 45}] }
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
        this.backgroundMusic = document.getElementById('background-music');

        this.startButton.addEventListener('click', () => this.startGame());
        this.hintButton.addEventListener('click', () => this.showHint());

        this.initParticles();
    }

    initParticles() {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80 },
                color: { value: '#ff69b4' },
                shape: { type: 'heart' },
                opacity: { value: 0.5, random: true },
                size: { value: 5, random: true },
                move: { enable: true, speed: 3 }
            }
        });
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
            heartElement.src = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fes.pngtree.com%2Ffree-png-vectors%2Fcoraz%25C3%25B3n&psig=AOvVaw0tVjFlv_yWvcq6V2tKDd1h&ust=1724860347488000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMjCrtTDlYgDFQAAAAAdAAAAABAE';
            heartElement.className = 'heart';
            heartElement.style.left = heart.x + '%';
            heartElement.style.top = heart.y + '%';
            heartElement.dataset.index = index;
            heartElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.heartClicked(index, e.target);
            });
            this.imageContainer.appendChild(heartElement);
        });
    }

    heartClicked(index, heartElement) {
        heartElement.remove();
        this.heartsFound++;
        this.heartsFoundElement.textContent = this.heartsFound;
        this.score += 10 + this.timeLeft;
        this.updateScore();
        this.showRomanticMessage();
        this.playHeartSound();
        this.createHeartBurst(heartElement);

        if (this.heartsFound === this.totalHearts) {
            setTimeout(() => this.nextImage(), 1000);
        }
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
            this.showMessage('¡Imagen de amor completada! Pasando a la siguiente...');
        } else {
            this.endGame();
        }
    }

    showRomanticMessage() {
        const messages = [
            "Tu amor es la luz que ilumina mi mundo",
            "Cada latido de mi corazón es por ti",
            "Contigo, cada día es una aventura de amor",
            "Eres el sueño del que nunca quiero despertar",
            "Nuestro amor es eterno, como las estrellas en el cielo",
            "Tu sonrisa es el sol que alegra mis días",
            "En tus brazos encuentro mi hogar",
            "Eres la melodía más dulce en la sinfonía de mi vida",
            "Nuestro amor crece más fuerte con cada día que pasa",
            "Contigo, el amor es mágico y real a la vez"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.showMessage(randomMessage);
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
            hearts[randomIndex].style.filter = 'drop-shadow(0 0 10px #ff69b4)';
            setTimeout(() => {
                hearts[randomIndex].style.filter = '';
            }, 1000);
            this.score -= 5;
            this.updateScore();
        }
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.backgroundMusic.pause();
        this.showMessage(`¡Has encontrado todos los corazones de nuestro amor! Tu puntuación de amor es: ${this.score}`);
        this.startButton.style.display = 'block';
        this.startButton.textContent = 'Revivir Nuestro Amor';
        this.hintButton.style.display = 'none';
        
        setTimeout(() => {
            alert("Mi amor eterno, gracias por jugar. Cada corazón que encontraste representa un momento especial en nuestra historia de amor. Sigamos creando más recuerdos juntos. ¡Te amo más que ayer y menos que mañana!");
        }, 1000);
    }
}

const game = new Game();