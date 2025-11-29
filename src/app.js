// Birthday Quest App - Main JavaScript (updated)
// Actual birthday date: November 29, 2025
// Demo countdown: 5 seconds

class BirthdayQuest {
    constructor() {
        this.currentScreen = 'countdown';
        this.completed = [];
        this.noClickCount = 0;
        this.totalCountdown = 5; // keep a reference for progress calculations
        this.init();
    }

    init() {
        this.injectStyles();
        this.startCountdown();
        this.setupEventListeners();
    }

    // Inject small helper styles for animations / centering that the app expects
    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* flicker (original) */
            @keyframes flicker { 0%,100%{opacity:1;transform:translateX(0);}25%{opacity:0.8;transform:translateX(-2px);}75%{opacity:0.9;transform:translateX(2px);} }

            /* card fade in */
            .card { opacity: 0; transform: translateY(10px); transition: opacity 400ms ease, transform 400ms ease; }
            .card.fade-in { opacity: 1; transform: translateY(0); }

            /* modal centered image for cake */
            .cake-centered { display: block; margin: 0 auto; max-width: 80%; height: auto; }

            /* song answer slots and letters */
            .answer-slot { display:inline-block; width:28px; height:36px; border-bottom:2px solid rgba(0,0,0,0.2); margin:2px; text-align:center; vertical-align:bottom; font-weight:600; }
            .letter-btn { display:inline-block; margin:4px; padding:8px 10px; border-radius:6px; cursor:pointer; user-select:none; }
            .letter-btn.disabled { opacity:0.35; pointer-events:none; }

            /* puzzle pieces layout */
            .puzzle-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap:2px; }
            .puzzle-piece {
            width:100px; 
            height:100px;
            background-size: cover;
            border: 1px solid rgba(0,0,0,0.08);  /* super thin border */
            padding:0;
            margin:0;
            cursor:pointer;
        }
            .memory-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 6px;
            margin: 10px auto;
        }

        .memory-tile {
            width: 70px;
            height: 70px;
            perspective: 600px;
            cursor: pointer;
        }

        .tile-inner {
            width: 100%;
            height: 100%;
            transition: transform 0.45s;
            transform-style: preserve-3d;
        }

        .memory-tile.flipped .tile-inner {
            transform: rotateY(180deg);
        }

        .tile-front,
        .tile-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 6px;
        }

        .tile-front {
            background: #d9d9d9;
        }

        .tile-back {
            transform: rotateY(180deg);
            background-size: cover;
            background-position: center;
        }

        .matched .tile-inner {
            outline: 3px solid #ff7eb3;
        }

        .album-view .dot {
            width: 10px;
            height: 10px;
            display: inline-block;
            background:#ccc;
            border-radius: 50%;
            margin: 2px;
        }

        .album-view .dot.active {
            background:#ff4d6d;
        }
        
        #memory-progress-container {
        width: 100%;
        background: rgba(0,0,0,0.1);
        height: 10px;
        border-radius: 6px;
        overflow: hidden;
    }

    #memory-progress-fill {
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #ff7eb3, #ff4d6d);
        transition: width 0.3s ease;
        border-radius: 6px;
    }



            /* small helpers */
            .hidden { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    // COUNTDOWN LOGIC
    startCountdown() {
        let timeLeft = this.totalCountdown; // Demo: 5 seconds (actual: Nov 29, 2025)
        const total = this.totalCountdown;
        const countdownNumber = document.getElementById('countdown-number');
        const progressCircle = document.getElementById('progress-circle');

        if (!countdownNumber) return; // defensive

        this.spawnFloatingHearts();

        // initialize UI immediately
        countdownNumber.textContent = timeLeft;
        // initialize dots
        for (let i = 0; i < total; i++) {
            const dot = document.getElementById(`dot-${i}`);
            if (dot) dot.classList.remove('active');
        }

        const countdownInterval = setInterval(() => {
            // Update circle progress
            const progress = (total - timeLeft) / total;
            const circumference = 565.48;
            const offset = circumference - (progress * circumference);
            if (progressCircle) progressCircle.style.strokeDashoffset = offset;

            // Update dot states
            const dotIndex = total - timeLeft; // how many passed
            for (let i = 0; i < total; i++) {
                const dot = document.getElementById(`dot-${i}`);
                if (!dot) continue;
                if (i < dotIndex) dot.classList.add('active');
                else dot.classList.remove('active');
            }

            // Update number display
            countdownNumber.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                // ensure final states
                countdownNumber.textContent = 0;
                for (let i = 0; i < total; i++) {
                    const dot = document.getElementById(`dot-${i}`);
                    if (dot) dot.classList.add('active');
                }

                // small delay so user sees 0
                setTimeout(() => this.showScreen('greeting-screen'), 500);
                return;
            }

            timeLeft--;
        }, 1000);
    }

    spawnFloatingHearts() {
        const container = document.getElementById('floating-hearts');
        if (!container) return;
        const hearts = ['❤️', '💕', '💖', '💗'];

        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (16 + Math.random() * 24) + 'px';
            heart.style.animationDelay = Math.random() * 3 + 's';
            container.appendChild(heart);
        }
    }

    // GREETING LOGIC
    setupGreetingScreen() {
        const yesBtn = document.getElementById('yes-btn');
        const noBtn = document.getElementById('no-btn');
        const noMessage = document.getElementById('no-message');

        this.spawnFloatingElements();
        this.noClickCount = 0;

        if (yesBtn) yesBtn.onclick = () => this.showScreen('adventure-screen');

        if (noBtn) noBtn.onclick = () => {
            this.noClickCount++;

            if (this.noClickCount >= 3) {
                if (noMessage) noMessage.textContent = 'You better say yes, love.';
            } else {
                if (noMessage) noMessage.textContent = 'Aww, come on! There\'s a surprise waiting for you! ❤️';
            }

            if (noMessage) {
                noMessage.classList.remove('hidden');
                setTimeout(() => noMessage.classList.add('hidden'), 2000);
            }

            // Move button around
            noBtn.style.position = 'absolute';
            noBtn.style.left = Math.random() * 80 + 10 + '%';
            noBtn.style.top = Math.random() * 80 + 10 + '%';
            setTimeout(() => noBtn.style.position = 'static', 2000);
        };
    }

    spawnFloatingElements() {
        const container = document.getElementById('floating-elements');
        if (!container) return;
        container.innerHTML = '';

        for (let i = 0; i < 20; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.textContent = Math.random() > 0.5 ? '❤️' : '✨';
            element.style.left = Math.random() * 100 + '%';
            element.style.top = Math.random() * 100 + '%';
            element.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(element);
        }
    }

    // ADVENTURE LOGIC
    setupAdventureScreen() {
        this.createQuestCards();
        this.updateProgressBar();
    }

    createQuestCards() {
        const grid = document.getElementById('cards-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const cards = [
            { id: 'love-letter', title: 'Love Letter', icon: '💌', gradient: 'card-gradient-1', challenge: 'heart-tap' },
            { id: 'poem', title: 'Poem', icon: '📖', gradient: 'card-gradient-2', challenge: 'word-scramble' },
            { id: 'flower', title: 'Flower', icon: '🌹', gradient: 'card-gradient-3', challenge: 'flower-quiz' },
            { id: 'cake', title: 'Cake', icon: '🍰', gradient: 'card-gradient-4', challenge: 'cake-challenge' },
            { id: 'song', title: 'Song', icon: '🎵', gradient: 'card-gradient-5', challenge: 'song-challenge' },
            { id: 'album', title: 'Album', icon: '📷', gradient: 'card-gradient-6', challenge: 'puzzle-challenge' },
        ];

        cards.forEach((card, index) => {
            const isLocked = index > 0 && !this.completed.includes(cards[index - 1].id);
            const isCompleted = this.completed.includes(card.id);

            const cardEl = document.createElement('div');
            cardEl.className = `card ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`;
            cardEl.innerHTML = `
                <div class="card-icon ${card.gradient}">
                    ${isLocked ? '🔒' : (isCompleted ? '✓' : card.icon)}
                </div>
                <h3 class="card-title">${card.title}</h3>
                <p class="card-description">
                    ${isLocked ? 'Complete previous' : (isCompleted ? 'View gift' : 'Start challenge')}
                </p>
                ${isCompleted ? '<div class="card-badge">✓</div>' : ''}
                ${!isLocked && !isCompleted ? '<div class="card-heart">❤️</div>' : ''}
            `;

            // Staggered fade-in animation
            setTimeout(() => cardEl.classList.add('fade-in'), index * 100 + 50);

            if (!isLocked) {
                cardEl.onclick = () => {
                    if (isCompleted) {
                        this.showGift(card.id);
                    } else {
                        this.showChallenge(card.challenge);
                    }
                };
            }

            grid.appendChild(cardEl);
        });
    }

    updateProgressBar() {
        const count = this.completed.length;
        const total = 6;
        const completedCountEl = document.getElementById('completed-count');
        const progressFill = document.getElementById('progress-fill');
        const questComplete = document.getElementById('quest-complete');

        if (completedCountEl) completedCountEl.textContent = count;
        if (progressFill) progressFill.style.width = (count / total) * 100 + '%';

        if (questComplete) {
            if (count === total) questComplete.classList.remove('hidden');
            else questComplete.classList.add('hidden');
        }
    }

    // CHALLENGE LOGIC
    showChallenge(challengeType) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(m => m.classList.add('hidden'));

        const modalId = `${challengeType}-modal`;
        const target = document.getElementById(modalId);
        if (target) target.classList.remove('hidden');

        // Setup challenge
        switch (challengeType) {
            case 'heart-tap':
                this.setupHeartTapChallenge();
                break;
            case 'word-scramble':
                this.setupWordScrambleChallenge();
                break;
            case 'flower-quiz':
                this.setupFlowerQuizChallenge();
                break;
            case 'cake-challenge':
                this.setupCakeChallengeChallenge();
                break;
            case 'song-challenge':
                this.setupSongChallenge();
                break;
            case 'puzzle-challenge':
                this.setupPuzzleChallenge();
                break;
        }
    }

    setupHeartTapChallenge() {
        const container = document.getElementById('hearts-container');
        if (!container) return;
        container.innerHTML = '';

        let tappedCount = 0;
        const targetCount = 10;

        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('button');
            heart.className = 'floating-heart-btn';
            heart.textContent = '❤️';
            heart.style.left = Math.random() * 90 + '%';
            heart.style.top = Math.random() * 90 + '%';

            heart.onclick = (e) => {
                e.stopPropagation();
                if (!heart.classList.contains('tapped')) {
                    heart.classList.add('tapped');
                    tappedCount++;

                    const heartsCount = document.getElementById('hearts-count');
                    const heartsProgress = document.getElementById('hearts-progress');
                    if (heartsCount) heartsCount.textContent = `${tappedCount} / ${targetCount}`;
                    if (heartsProgress) heartsProgress.style.width = (tappedCount / targetCount) * 100 + '%';

                    if (tappedCount >= targetCount) {
                        setTimeout(() => this.completeChallenge('love-letter'), 500);
                    }
                }
            };

            container.appendChild(heart);
        }
    }

    setupWordScrambleChallenge() {
        const words = ['I', 'love', 'you', 'always', 'in', 'all', 'ways'];
        let selectedWords = [];
        let shuffledWords = [...words].sort(() => Math.random() - 0.5);

        const selectedContainer = document.getElementById('selected-words');
        const scrambledContainer = document.getElementById('scrambled-words');
        const errorDiv = document.getElementById('word-error');

        const renderWords = () => {
            if (!selectedContainer || !scrambledContainer) return;

            selectedContainer.innerHTML = selectedWords.length === 0
                ? 'Tap words below to arrange them here'
                : selectedWords.map((w, i) => `
                    <div class="word-badge" data-index="${i}">${w}</div>
                `).join('');

            scrambledContainer.innerHTML = shuffledWords.map((w, i) => `
                <div class="word-badge scrambled" data-index="${i}">${w}</div>
            `).join('');

            selectedContainer.querySelectorAll('.word-badge').forEach(badge => {
                badge.onclick = () => {
                    const index = parseInt(badge.dataset.index);
                    selectedWords.splice(index, 1);
                    const removed = shuffledWords.indexOf(badge.textContent);
                    if (removed === -1) shuffledWords.push(badge.textContent);
                    renderWords();
                };
            });

            scrambledContainer.querySelectorAll('.word-badge').forEach(badge => {
                badge.onclick = () => {
                    const word = badge.textContent;
                    selectedWords.push(word);
                    const index = shuffledWords.indexOf(word);
                    if (index > -1) shuffledWords.splice(index, 1);
                    renderWords();
                };
            });
        };

        const resetBtn = document.getElementById('reset-words');
        if (resetBtn) resetBtn.onclick = () => {
            selectedWords = [];
            shuffledWords = [...words].sort(() => Math.random() - 0.5);
            renderWords();
            if (errorDiv) errorDiv.classList.add('hidden');
        };

        const checkBtn = document.getElementById('check-words');
        if (checkBtn) checkBtn.onclick = () => {
            if (selectedWords.join(' ') === 'I love you always in all ways') {
                setTimeout(() => this.completeChallenge('poem'), 500);
            } else {
                if (errorDiv) {
                    errorDiv.textContent = 'Not quite right, try again!';
                    errorDiv.classList.remove('hidden');
                    setTimeout(() => errorDiv.classList.add('hidden'), 2000);
                }
            }
        };

        renderWords();
    }

    setupFlowerQuizChallenge() {
        const flowers = [
            { name: 'rose', image: 'rose.jpg', hint: 'Symbol of love' },
            { name: 'tulip', image: 'tulip.jpg', hint: 'Famous in Netherlands' },
            { name: 'sunflower', image: 'sunflower.jpg', hint: 'Follows the sun' },
            { name: 'daisy', image: 'daisy.jpg', hint: 'He loves me, he loves me not' },
            { name: 'lily', image: 'lily.jpg', hint: 'Symbol of purity' },
            { name: 'orchid', image: 'orchid.jpg', hint: 'Exotic and elegant' },
            { name: 'carnation', image: 'carnation.jpg', hint: 'Mother\'s Day flower' },
            { name: 'peony', image: 'peony.jpg', hint: 'Romantic and fluffy' }
        ];

        let currentFlower = 0;
        let guessedCount = 0;
        const input = document.getElementById('flower-input');
        const errorDiv = document.getElementById('flower-error');
        const progressDiv = document.getElementById('flower-progress');
        const cardDiv = document.getElementById('flower-card');

        const updateFlowerDisplay = () => {
            const flower = flowers[currentFlower];
            if (!cardDiv) return;
            cardDiv.innerHTML = `
                <div>
                    <img src="${flower.image}" alt="${flower.name}" style="max-width: 150px; height: 150px; border-radius: 8px; object-fit: cover;">
                    <div style="margin-top: 10px; font-size: 0.9rem; color: var(--text-light);">Hint: ${flower.hint}</div>
                </div>
            `;

            let dotsHTML = '';
            flowers.forEach((f, i) => {
                dotsHTML += `<span class="flower-dot ${i < currentFlower ? 'completed' : ''} ${i === currentFlower ? 'active' : ''}"></span>`;
            });
            if (progressDiv) progressDiv.innerHTML = dotsHTML;
        };

        const submitBtn = document.getElementById('submit-flower');
        if (submitBtn) submitBtn.onclick = () => {
            const answer = input.value.toLowerCase().trim();
            const flower = flowers[currentFlower];

            if (answer === flower.name) {
                guessedCount++;
                input.value = '';
                if (errorDiv) errorDiv.classList.add('hidden');

                if (currentFlower < flowers.length - 1) {
                    currentFlower++;
                    updateFlowerDisplay();
                } else if (guessedCount >= 6) {
                    setTimeout(() => this.completeChallenge('flower'), 500);
                }
            } else {
                if (errorDiv) {
                    errorDiv.textContent = 'Try another flower!';
                    errorDiv.classList.remove('hidden');
                }
            }
        };

        const skipBtn = document.getElementById('skip-flower');
        if (skipBtn) skipBtn.onclick = () => {
            if (currentFlower < flowers.length - 1) {
                currentFlower++;
                input.value = '';
                updateFlowerDisplay();
            }
        };

        updateFlowerDisplay();
    }

    setupCakeChallengeChallenge() {
        const flavors = ['chocolate', 'caramel', 'strawberry', 'mocha'];
        let guessedFlavors = new Set();
        const input = document.getElementById('cake-input');
        const errorDiv = document.getElementById('cake-error');
        const flavorsDiv = document.getElementById('cake-flavors');
        const cakeImage = document.getElementById('cake-image');
        const progressDiv = document.getElementById('cake-progress');
        const modal = document.getElementById('cake-challenge-modal');

        if (!cakeImage) return;

        // Display the birthday cake image (centered)
        cakeImage.src = 'birthdaycake.jpg';
        cakeImage.alt = 'Birthday Cake';
        cakeImage.classList.add('cake-centered');

        const updateDisplay = () => {
            if (flavorsDiv) {
                flavorsDiv.innerHTML = flavors.map(f => `
                    <span class="flavor-badge ${guessedFlavors.has(f) ? 'guessed' : ''}">
                        ${guessedFlavors.has(f) ? f : '?'}
                    </span>
                `).join('');
            }
            if (progressDiv) progressDiv.textContent = `Guessed: ${guessedFlavors.size} / ${flavors.length}`;
        };

        const submitBtn = document.getElementById('submit-cake');
        if (submitBtn) submitBtn.onclick = () => {
            const answer = input.value.toLowerCase().trim();

            if (flavors.includes(answer) && !guessedFlavors.has(answer)) {
                guessedFlavors.add(answer);
                input.value = '';
                if (errorDiv) errorDiv.classList.add('hidden');
                updateDisplay();

                if (guessedFlavors.size >= flavors.length) {
                    // Show celebration and candle blowing
                    if (modal) {
                        const header = modal.querySelector('.modal-header h2');
                        const headerP = modal.querySelector('.modal-header p');
                        if (header) header.textContent = 'Make a Wish!';
                        if (headerP) headerP.textContent = 'Blow out the candle and celebrate!';

                        // Update button behaviour to "blow the candle"
                        submitBtn.textContent = 'Blow the Candle';
                        submitBtn.onclick = () => {
                            // Show celebration effects
                            const celebrationDiv = document.createElement('div');
                            celebrationDiv.innerHTML = `
                                <div style="text-align: center; animation: bounce-in 0.6s ease-out;">
                                    <div style="font-size: 2rem; margin: 20px 0; animation: float-celebration 2s ease-in-out infinite;">
                                        🎉 🎊 🎈 💕 ✨ 🎁 💕 🎊 🎉
                                    </div>
                                    <div style="font-family: 'Dancing Script', cursive; font-size: 1.5rem; color: var(--primary); margin-top: 15px;">
                                        The candle is out! Make a wish! 
                                    </div>
                                </div>
                            `;
                            const body = modal.querySelector('.modal-body');
                            if (body) body.innerHTML = celebrationDiv.innerHTML;

                            setTimeout(() => this.completeChallenge('cake'), 2000);
                        };
                    }
                }
            } else if (guessedFlavors.has(answer)) {
                if (errorDiv) {
                    errorDiv.textContent = 'Already guessed!';
                    errorDiv.classList.remove('hidden');
                }
            } else {
                if (errorDiv) {
                    errorDiv.textContent = 'Try another flavor!';
                    errorDiv.classList.remove('hidden');
                }
            }
        };

        updateDisplay();
    }

            setupSongChallenge() {
            const lyricsDiv = document.getElementById('song-lyrics');
            const playerDiv = document.getElementById('song-player');
            const audio = document.getElementById('song-audio');

            lyricsDiv.innerHTML = '';
            playerDiv.classList.add('hidden');

            const target = "MAKEITWITHYOU";
            let current = "";
            let pressedStack = [];

            // Build 18 letters
            const needed = target.split('');
            const extra = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                .split('')
                .filter(l => !needed.includes(l))
                .sort(() => Math.random() - 0.5)
                .slice(0, 18 - needed.length);

            const pool = [...needed, ...extra].sort(() => Math.random() - 0.5);

            // Build UI
            lyricsDiv.innerHTML = `
                <div id="answer-preview" style="min-height:40px;text-align:center;font-size:1.4rem;font-weight:600;letter-spacing:4px;margin-bottom:10px;"></div>

                <div id="keyboard" style="
                    display:grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap:4px;
                    width:100%;
                    max-width:200px;
                    margin:0 auto;">
                </div>

                <div style="text-align:center; margin-top:10px;">
                    <button id="undo-letter" class="btn btn-outline" style="margin-right:5px;">↩ Undo</button>
                    <button id="clear-letters" class="btn btn-outline">🗑 Clear</button>
                </div>
            `;

            const keyboard = document.getElementById("keyboard");
            const answerPreview = document.getElementById("answer-preview");

            // Create letter buttons
            pool.forEach(letter => {
                const btn = document.createElement('button');
                btn.className = "btn btn-primary";
                btn.style.padding = "4px 0";
                btn.style.fontSize = "0.75rem";
                btn.style.minWidth = "28px";
                btn.style.height = "28px";
                btn.textContent = letter;

                btn.onclick = () => {
                    current += letter;
                    answerPreview.textContent = current;
                    pressedStack.push(btn);
                    btn.disabled = true;
                    checkAnswer();
                };

                keyboard.appendChild(btn);
            });

            document.getElementById("undo-letter").onclick = () => {
                if (!pressedStack.length) return;
                const btn = pressedStack.pop();
                current = current.slice(0, -1);
                answerPreview.textContent = current;
                btn.disabled = false;
            };

            document.getElementById("clear-letters").onclick = () => {
                current = '';
                answerPreview.textContent = '';
                pressedStack.forEach(b => b.disabled = false);
                pressedStack = [];
            };

            // CHECK ANSWER
            const checkAnswer = () => {
                if (current.length !== target.length) return;

                if (current === target) {

                    // Unlock next quest
                    this.completed.push("song");
                    this.setupAdventureScreen();

                    playerDiv.classList.remove("hidden");

                    audio.src = "./makeitwithyou.mp3";
                    audio.currentTime = 0;
                    audio.play();

                    const playBtn = document.getElementById("play-song");

                    const setPlayMode = () => playBtn.textContent = "▶ Play Song";
                    const setStopMode = () => playBtn.textContent = "⏹ Stop Song";

                    setStopMode();

                    playBtn.onclick = () => {
                        if (audio.paused) {
                            audio.play();
                            setStopMode();
                        } else {
                            audio.pause();
                            audio.currentTime = 0;
                            setPlayMode();
                        }
                    };

                    // Single button only
                    if (!document.getElementById('song-dedicate-btn')) {
                        const btn = document.createElement("button");
                        btn.className = "btn btn-primary";
                        btn.id = "song-dedicate-btn";
                        btn.style.marginTop = "10px";
                        btn.textContent = "Read Song Dedication";

                        btn.onclick = () => {
                            audio.pause();
                            audio.currentTime = 0;
                            setPlayMode();
                            this.showGift("song");
                        };

                        playerDiv.appendChild(btn);
                    }
                }
            };
        }

        // =======================
        //  MEMORY PUZZLE CHALLENGE
        // =======================

        setupPuzzleChallenge() {
            const grid = document.getElementById("memory-grid");
            // const restartBtn = document.getElementById("restart-memory");

            document.getElementById("album-view").classList.add("hidden");

            // Prepare picture pairs (one.jpg + one1.jpg ... nine.jpg + nine1.jpg)
            const images = [
                "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"
            ];

            // Make the deck: 18 cards total
            this.memoryDeck = [];
            images.forEach(name => {
                this.memoryDeck.push({ img: `${name}.jpg`, pair: name });
                this.memoryDeck.push({ img: `${name}1.jpg`, pair: name });
            });

            // Shuffle
            this.memoryDeck.sort(() => Math.random() - 0.5);

            // Game state
            this.memoryFlipped = [];
            this.memoryMatched = 0;
            document.getElementById("memory-progress-fill").style.width = "0%";
            document.getElementById("memory-progress-text").textContent = "0 / 9 pairs matched";


            // Render board
            grid.innerHTML = "";
            this.memoryDeck.forEach((card, index) => {
                const tile = document.createElement("div");
                tile.className = "memory-tile";
                tile.dataset.index = index;
                tile.dataset.pair = card.pair;

                tile.innerHTML = `
                    <div class="tile-inner">
                        <div class="tile-front"></div>
                        <div class="tile-back" style="background-image:url('${card.img}')"></div>
                    </div>
                `;

                tile.onclick = () => this.flipMemoryTile(tile);

                grid.appendChild(tile);
            });

            // Restart button
            // if (restartBtn) {
            //     restartBtn.onclick = () => this.setupPuzzleChallenge();
            // }
        }

        // Flip logic
        flipMemoryTile(tile) {
            if (tile.classList.contains("matched")) return;
            if (tile.classList.contains("flipped")) return;
            if (this.memoryFlipped.length === 2) return; // block clicks while checking

            tile.classList.add("flipped");
            this.memoryFlipped.push(tile);

            if (this.memoryFlipped.length === 2) {
                setTimeout(() => this.checkPuzzleMatch(), 700);
            }
        }

        // Matching logic
        checkPuzzleMatch() {
            const [t1, t2] = this.memoryFlipped;

            if (!t1 || !t2) return;

            if (t1.dataset.pair === t2.dataset.pair) {
                // matched
                t1.classList.add("matched");
                t2.classList.add("matched");
                this.memoryMatched++;
                // UPDATE PROGRESS BAR
                const fill = document.getElementById("memory-progress-fill");
                const text = document.getElementById("memory-progress-text");

                if (fill) fill.style.width = (this.memoryMatched / 9) * 100 + "%";
                if (text) text.textContent = `${this.memoryMatched} / 9 pairs matched`;

                // all 9 pairs found
                if (this.memoryMatched >= 9) {
                    setTimeout(() => this.showAlbumAfterGame(), 700);
                }
            } else {
                // wrong → flip back
                t1.classList.remove("flipped");
                t2.classList.remove("flipped");
            }

            this.memoryFlipped = [];
        }

        // After matching all tiles
        showAlbumAfterGame() {
            const grid = document.getElementById("memory-grid");
            const album = document.getElementById("album-view");

            grid.classList.add("hidden");
            album.classList.remove("hidden");

            // Prepare album images
            this.albumImages = [
                "one.jpg", "two.jpg", "three.jpg", "four.jpg",
                "five.jpg", "six.jpg", "seven.jpg", "eight.jpg", "nine.jpg"
            ];

            this.albumIndex = 0;

            this.updateAlbumDisplay();

            document.getElementById("prev-photo").onclick = () => {
                this.albumIndex = (this.albumIndex - 1 + this.albumImages.length) % this.albumImages.length;
                this.updateAlbumDisplay();
            };

            document.getElementById("next-photo").onclick = () => {
                this.albumIndex = (this.albumIndex + 1) % this.albumImages.length;
                this.updateAlbumDisplay();
            };

            document.getElementById("finish-album").onclick = () => {
                this.completeAlbumGift();
            };
        }

        updateAlbumDisplay() {
            const img = document.getElementById("album-display");
            const dots = document.getElementById("album-dots");
            const label = document.getElementById("polaroid-text");

            img.src = this.albumImages[this.albumIndex];
            label.textContent = `Memory #${this.albumIndex + 1}`;

            dots.innerHTML = this.albumImages
                .map((_, i) => `<span class="dot ${i === this.albumIndex ? 'active' : ''}"></span>`)
                .join("");
        }

        // Final gift modal after album
        completeAlbumGift() {
            // Show final message + play Make It With You
            const finalMsg = `
                Happy birthday again, love.  
                I hope you enjoyed your virtual birthday adventure.  
                Every picture here is a memory of us —  
                and there will be many more to come.  
                I love you so much.  
            `;

            const iconEl = document.getElementById("gift-icon");
            const titleEl = document.getElementById("gift-title");
            const contentEl = document.getElementById("gift-content");

            iconEl.textContent = "📷";
            titleEl.textContent = "Our Memory Album";
            contentEl.textContent = finalMsg;

            document.getElementById("gift-modal").classList.remove("hidden");

            // Mark challenge complete
            this.completeChallenge("album");

            // Autoplay the song if exists
            const audio = document.getElementById("song-audio");
            if (audio) {
                audio.src = "./makeitwithyou.mp3";
                audio.currentTime = 0;
                audio.play();
            }
        }





    // GIFT LOGIC
    showGift(cardId) {
        const gifts = {
            'love-letter': { 
                title: 'Your Love Letter', 
                icon: '💌', 
                content: `Love,\n\nNo matter what storms rise or how the days may change, know this: I am here—always—steadfast beside you. In every quiet moment and every difficult hour, my heart remains yours without hesitation.\n\nI love you more than words can hold, more than distance can measure, more than yesterday and yet not as much as tomorrow. You are my constant, my comfort, my beloved.` 
            },

            'poem': { 
                title: 'A Poem For You', 
                icon: '📖', 
                content: `"You Are My Home"\n\nIn the depth of your eyes, I’ve found the solace I’ve longed for. When we stand close, even silence becomes a melody. And in the middle of the world’s noise—there is you, always you—the only place my soul returns to.` 
            },

            'flower': { 
                title: 'Your Virtual Bouquet', 
                icon: '🌹', 
                content: `A bouquet woven from the fragrance of affection and the softness of longing. May every petal remind you that somewhere, someone is thinking of you with a tenderness that blooms without end.` 
            },

            'cake': { 
                title: 'Birthday Wishes', 
                icon: '🍰', 
                content: `I whispered a wish to the stars tonight—that your path be light, your heart be full, and that every tomorrow greet you with sweetness. Happy birthday, love` 
            },

            'song': { 
                title: 'Our Song', 
                icon: '🎵', 
                content: `"Make It With You" — Inspired Message\n\nThis song reminds me of us—of choosing each other not only in the bright days, but even in the uncertain ones. It speaks of two souls brave enough to walk into the unknown together, believing that love is something you build hand in hand.\n\nEvery time it plays, I’m reminded that with you, I don’t just dream of a future—I want to make it, live it, and grow it with you.` 
            },

            'album': { 
                title: 'Our Memory Album', 
                icon: '📷', 
                content: `Memories With You\n\nWithin every photograph lives a heartbeat—a laugh, a touch, a moment that refuses to fade. This album is our small sanctuary of stories, kept safe in the light of what we’ve shared.` 
            }
        };
    
        

        const gift = gifts[cardId];
        if (!gift) return;

        const iconEl = document.getElementById('gift-icon');
        const titleEl = document.getElementById('gift-title');
        const contentEl = document.getElementById('gift-content');

        if (iconEl) iconEl.textContent = gift.icon;
        if (titleEl) titleEl.textContent = gift.title;
        if (contentEl) contentEl.textContent = gift.content;

        const giftModal = document.getElementById('gift-modal');
        if (giftModal) giftModal.classList.remove('hidden');

        const claimBtn = document.getElementById('claim-gift');
        if (claimBtn) claimBtn.onclick = () => {
            if (giftModal) giftModal.classList.add('hidden');
        };
    }

    completeChallenge(cardId) {
        if (!this.completed.includes(cardId)) this.completed.push(cardId);
        const modal = document.querySelector('.modal:not(.hidden)');
        if (modal) modal.classList.add('hidden');

        this.showGift(cardId);

        setTimeout(() => {
            this.setupAdventureScreen();
        }, 1000);
    }

    // SCREEN MANAGEMENT
    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) target.classList.add('active');

        if (screenId === 'greeting-screen') {
            this.setupGreetingScreen();
        } else if (screenId === 'adventure-screen') {
            this.setupAdventureScreen();
        }
    }

    setupEventListeners() {
        // Close modals
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.onclick = () => {
                const modal = btn.closest('.modal');
                if (modal) modal.classList.add('hidden');
            };
        });

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.onclick = () => {
                const modal = overlay.closest('.modal');
                if (modal) modal.classList.add('hidden');
            };
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BirthdayQuest();
});
