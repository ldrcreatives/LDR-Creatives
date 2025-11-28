// Birthday Quest App - Main JavaScript
// Actual birthday date: November 29, 2025
// Demo countdown: 5 seconds

class BirthdayQuest {
    constructor() {
        this.currentScreen = 'countdown';
        this.completed = [];
        this.noClickCount = 0;
        this.init();
    }

    init() {
        this.startCountdown();
        this.setupEventListeners();
    }

    startCountdown() {
        let timeLeft = 5;
        const countdownNumber = document.getElementById('countdown-number');
        const progressCircle = document.getElementById('progress-circle');
        
        this.spawnFloatingHearts();
        countdownNumber.textContent = timeLeft;
        
        const countdownInterval = setInterval(() => {
            timeLeft--;
            countdownNumber.textContent = timeLeft;
            
            const progress = (5 - timeLeft) / 5;
            const circumference = 565.48;
            const offset = circumference - (progress * circumference);
            progressCircle.style.strokeDashoffset = offset;
            
            const dotIndex = 5 - timeLeft;
            for (let i = 0; i < 5; i++) {
                const dot = document.getElementById(`dot-${i}`);
                if (i < dotIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            }
            
            if (timeLeft < 0) {
                clearInterval(countdownInterval);
                this.showScreen('greeting-screen');
            }
        }, 1000);
    }

    spawnFloatingHearts() {
        const container = document.getElementById('floating-hearts');
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

    setupGreetingScreen() {
        const yesBtn = document.getElementById('yes-btn');
        const noBtn = document.getElementById('no-btn');
        const noMessage = document.getElementById('no-message');
        
        this.spawnFloatingElements();
        this.noClickCount = 0;
        
        yesBtn.onclick = () => this.showScreen('adventure-screen');
        
        noBtn.onclick = () => {
            this.noClickCount++;
            
            if (this.noClickCount >= 3) {
                noMessage.textContent = 'You better say yes, love.';
            } else {
                noMessage.textContent = 'Aww, come on! There\'s a surprise waiting for you! ❤️';
            }
            
            noMessage.classList.remove('hidden');
            setTimeout(() => noMessage.classList.add('hidden'), 2000);
            
            noBtn.style.position = 'absolute';
            noBtn.style.left = Math.random() * 80 + 10 + '%';
            noBtn.style.top = Math.random() * 80 + 10 + '%';
            setTimeout(() => noBtn.style.position = 'static', 2000);
        };
    }

    spawnFloatingElements() {
        const container = document.getElementById('floating-elements');
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

    setupAdventureScreen() {
        this.createQuestCards();
        this.updateProgressBar();
    }

    createQuestCards() {
        const grid = document.getElementById('cards-grid');
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
                <div class="card-content">
                    <h3 class="card-title">${card.title}</h3>
                    <p class="card-description">
                        ${isLocked ? 'Complete previous' : (isCompleted ? 'View gift' : 'Start challenge')}
                    </p>
                </div>
                ${isCompleted ? '<div class="card-badge">✓</div>' : ''}
                ${!isLocked && !isCompleted ? '<div class="card-heart">❤️</div>' : ''}
            `;
            
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
        document.getElementById('completed-count').textContent = count;
        document.getElementById('progress-fill').style.width = (count / 6) * 100 + '%';
        
        if (count === 6) {
            this.showQuestCompleteModal();
        }
    }

    showQuestCompleteModal() {
        const modal = document.getElementById('quest-complete-modal');
        const celebrationDiv = document.getElementById('celebration-emojis');
        
        const emojis = ['🎉', '🎊', '💕', '🌹', '✨'];
        celebrationDiv.innerHTML = emojis.map(e => `<span>${e}</span>`).join('');
        
        const restartBtn = document.getElementById('restart-quest');
        restartBtn.onclick = () => {
            this.completed = [];
            modal.classList.add('hidden');
            this.setupAdventureScreen();
        };
        
        modal.classList.remove('hidden');
    }

    showChallenge(challengeType) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(m => m.classList.add('hidden'));
        
        const modalId = `${challengeType}-modal`;
        document.getElementById(modalId).classList.remove('hidden');
        
        switch(challengeType) {
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
                    
                    document.getElementById('hearts-count').textContent = `${tappedCount} / ${targetCount}`;
                    document.getElementById('hearts-progress').style.width = (tappedCount / targetCount) * 100 + '%';
                    
                    if (tappedCount >= targetCount) {
                        setTimeout(() => this.completeChallenge('love-letter'), 500);
                    }
                }
            };
            
            container.appendChild(heart);
        }
    }

    setupWordScrambleChallenge() {
        const words = ['you', 'are', 'my', 'home'];
        let selectedWords = [];
        let shuffledWords = [...words].sort(() => Math.random() - 0.5);
        
        const selectedContainer = document.getElementById('selected-words');
        const scrambledContainer = document.getElementById('scrambled-words');
        const errorDiv = document.getElementById('word-error');
        
        const renderWords = () => {
            selectedContainer.innerHTML = selectedWords.length === 0 
                ? 'Tap words below to arrange them here'
                : selectedWords.map((w, i) => `<div class="word-badge" data-index="${i}">${w}</div>`).join('');
            
            scrambledContainer.innerHTML = shuffledWords.map((w, i) => `<div class="word-badge scrambled" data-index="${i}">${w}</div>`).join('');
            
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
        
        document.getElementById('reset-words').onclick = () => {
            selectedWords = [];
            shuffledWords = [...words].sort(() => Math.random() - 0.5);
            renderWords();
            errorDiv.classList.add('hidden');
        };
        
        document.getElementById('check-words').onclick = () => {
            if (selectedWords.join(' ') === 'you are my home') {
                setTimeout(() => this.completeChallenge('poem'), 500);
            } else {
                errorDiv.textContent = 'Not quite right, try again!';
                errorDiv.classList.remove('hidden');
                setTimeout(() => errorDiv.classList.add('hidden'), 2000);
            }
        };
        
        renderWords();
    }

    setupFlowerQuizChallenge() {
        const flowers = [
            { name: 'rose', emoji: '🌹', image: 'https://images.unsplash.com/photo-1518761681033-91b2a8637d4d?w=400&h=400&fit=crop', hint: 'Symbol of love' },
            { name: 'tulip', emoji: '🌷', image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=400&h=400&fit=crop', hint: 'Famous in Netherlands' },
            { name: 'sunflower', emoji: '🌻', image: 'https://images.unsplash.com/photo-1597848212624-e27c2c4de3d1?w=400&h=400&fit=crop', hint: 'Follows the sun' },
            { name: 'daisy', emoji: '🌼', image: 'https://images.unsplash.com/photo-1578844251758-2c4c82f43dfe?w=400&h=400&fit=crop', hint: 'He loves me, he loves me not' },
            { name: 'lily', emoji: '✿', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd8b4fcd?w=400&h=400&fit=crop', hint: 'Symbol of purity' },
            { name: 'orchid', emoji: '🌸', image: 'https://images.unsplash.com/photo-1573848212207-acd37e9dfe22?w=400&h=400&fit=crop', hint: 'Exotic and elegant' },
            { name: 'carnation', emoji: '🥀', image: 'https://images.unsplash.com/photo-1519763474736-c0a0e0ce91a6?w=400&h=400&fit=crop', hint: 'Mother\'s Day flower' },
            { name: 'peony', emoji: '🏵️', image: 'https://images.unsplash.com/photo-1606145063336-810237ca91d8?w=400&h=400&fit=crop', hint: 'Romantic and fluffy' }
        ];
        
        let currentFlower = 0;
        let guessedFlowers = new Set();
        let skippedFlowers = new Set();
        let skipCount = 0;
        const input = document.getElementById('flower-input');
        const errorDiv = document.getElementById('flower-error');
        const progressDiv = document.getElementById('flower-progress');
        const flowerImage = document.getElementById('flower-image');
        const cardDiv = document.getElementById('flower-card');
        
        const getFirstUnanswered = () => {
            for (let i = 0; i < flowers.length; i++) {
                if (!guessedFlowers.has(i) && !skippedFlowers.has(i)) {
                    return i;
                }
            }
            return -1;
        };
        
        const updateFlowerDisplay = () => {
            const flower = flowers[currentFlower];
            flowerImage.src = flower.image;
            cardDiv.innerHTML = `<div style="font-size: 0.9rem; color: var(--text-light); margin-top: 10px;">Hint: ${flower.hint}</div>`;
            
            let dotsHTML = '';
            flowers.forEach((f, i) => {
                const isAnswered = guessedFlowers.has(i);
                const isSkipped = skippedFlowers.has(i);
                const isActive = i === currentFlower;
                dotsHTML += `<span class="flower-dot ${isAnswered ? 'completed' : ''} ${isActive ? 'active' : ''} ${isSkipped ? 'skipped' : ''}"></span>`;
            });
            progressDiv.innerHTML = dotsHTML;
        };
        
        document.getElementById('submit-flower').onclick = () => {
            const answer = input.value.toLowerCase().trim();
            const flower = flowers[currentFlower];
            
            if (answer === flower.name) {
                guessedFlowers.add(currentFlower);
                skippedFlowers.delete(currentFlower);
                input.value = '';
                errorDiv.classList.add('hidden');
                skipCount = 0;
                
                const nextUnanswered = getFirstUnanswered();
                if (nextUnanswered === -1) {
                    setTimeout(() => this.completeChallenge('flower'), 500);
                } else {
                    currentFlower = nextUnanswered;
                    updateFlowerDisplay();
                }
            } else {
                errorDiv.textContent = 'Try another flower!';
                errorDiv.classList.remove('hidden');
            }
        };
        
        document.getElementById('skip-flower').onclick = () => {
            skipCount++;
            skippedFlowers.add(currentFlower);
            input.value = '';
            errorDiv.classList.add('hidden');
            
            if (skipCount >= 5) {
                const firstUnanswered = getFirstUnanswered();
                if (firstUnanswered !== -1) {
                    currentFlower = firstUnanswered;
                    skipCount = 0;
                    skippedFlowers.clear();
                    updateFlowerDisplay();
                    errorDiv.textContent = '🔄 Going back to the beginning - please answer all flowers!';
                    errorDiv.classList.remove('hidden');
                    setTimeout(() => errorDiv.classList.add('hidden'), 2000);
                }
            } else {
                const nextUnanswered = getFirstUnanswered();
                if (nextUnanswered !== -1) {
                    currentFlower = nextUnanswered;
                    updateFlowerDisplay();
                }
            }
        };
        
        updateFlowerDisplay();
    }

    setupCakeChallengeChallenge() {
        const flavors = ['chocolate', 'vanilla', 'strawberry', 'red velvet'];
        let guessedFlavors = new Set();
        const input = document.getElementById('cake-input');
        const errorDiv = document.getElementById('cake-error');
        const flavorsDiv = document.getElementById('cake-flavors');
        const cakeImage = document.getElementById('cake-image');
        const hintDiv = document.getElementById('cake-hint');
        const progressDiv = document.getElementById('cake-progress');
        const modal = document.getElementById('cake-challenge-modal');
        
        cakeImage.src = 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=300&fit=crop';
        
        const updateDisplay = () => {
            flavorsDiv.innerHTML = flavors.map(f => `<span class="flavor-badge ${guessedFlavors.has(f) ? 'guessed' : ''}">${guessedFlavors.has(f) ? f : '?'}</span>`).join('');
            progressDiv.textContent = `Guessed: ${guessedFlavors.size} / ${flavors.length}`;
        };
        
        document.getElementById('submit-cake').onclick = () => {
            const answer = input.value.toLowerCase().trim();
            
            if (flavors.includes(answer) && !guessedFlavors.has(answer)) {
                guessedFlavors.add(answer);
                input.value = '';
                errorDiv.classList.add('hidden');
                updateDisplay();
                
                if (guessedFlavors.size >= flavors.length) {
                    modal.querySelector('.modal-header h2').textContent = 'Make a Wish!';
                    modal.querySelector('.modal-header p').textContent = 'Blow out the candle to receive your cake';
                    cakeImage.src = 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=300&fit=crop';
                    hintDiv.textContent = '🕯️ Make a wish before blowing the candle!';
                    document.getElementById('submit-cake').textContent = 'Blow the Candle';
                    document.getElementById('submit-cake').onclick = () => {
                        setTimeout(() => this.completeChallenge('cake'), 500);
                    };
                }
            } else if (guessedFlavors.has(answer)) {
                errorDiv.textContent = 'Already guessed!';
                errorDiv.classList.remove('hidden');
            } else {
                errorDiv.textContent = 'Try another flavor!';
                errorDiv.classList.remove('hidden');
            }
        };
        
        updateDisplay();
    }

    setupSongChallenge() {
        const lyric = 'Make it with you, ________';
        const answer = 'baby';
        let isCorrect = false;
        const input = document.getElementById('song-input');
        const errorDiv = document.getElementById('song-error');
        const lyricsDiv = document.getElementById('song-lyrics');
        const playerDiv = document.getElementById('song-player');
        const audioElement = document.getElementById('song-audio');
        
        lyricsDiv.innerHTML = `<div style="font-size: 0.9rem; margin-bottom: 10px;">from "Make It With You" by Ben and Ben</div><div style="font-size: 1.2rem;">"${lyric}"</div>`;
        
        document.getElementById('submit-song').onclick = () => {
            if (!isCorrect) {
                if (input.value.toLowerCase().trim() === answer) {
                    isCorrect = true;
                    input.value = '';
                    errorDiv.classList.add('hidden');
                    
                    document.getElementById('submit-song').style.display = 'none';
                    lyricsDiv.innerHTML = `<div style="font-size: 0.9rem; margin-bottom: 10px;">from "Make It With You" by Ben and Ben</div><div style="font-size: 1.2rem;">"${lyric.replace('________', answer)}"</div>`;
                    playerDiv.classList.remove('hidden');
                } else {
                    errorDiv.textContent = 'Not quite, try again!';
                    errorDiv.classList.remove('hidden');
                }
            }
        };
        
        document.getElementById('play-song').onclick = () => {
            const playBtn = document.getElementById('play-song');
            playBtn.textContent = '🎵 Playing...';
            playBtn.disabled = true;
            
            let photoIndex = 0;
            const photos = ['💕', '💖', '💗', '❤️', '💑'];
            
            const interval = setInterval(() => {
                document.getElementById('photo-display').textContent = photos[photoIndex];
                photoIndex = (photoIndex + 1) % photos.length;
            }, 800);
            
            audioElement.src = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_d58c0f5baf.mp3';
            audioElement.play().catch(() => {});
            
            setTimeout(() => {
                clearInterval(interval);
                playBtn.textContent = '✓ Completed!';
                setTimeout(() => this.completeChallenge('song'), 1000);
            }, 5000);
        };
    }

    setupPuzzleChallenge() {
        const pieces = Array.from({length: 9}, (_, i) => i);
        let shuffled = [...pieces].sort(() => Math.random() - 0.5);
        const grid = document.getElementById('puzzle-grid');
        let selectedPiece = null;
        let isComplete = false;
        
        const memoryImages = [
            'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1490587191519-c21cc028cb0d?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1587125269261-ca189db6cf0d?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1563250033-c5f3e5ce8b4b?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1591084728795-2de8030776ba?w=200&h=200&fit=crop'
        ];
        
        const renderPuzzle = () => {
            grid.innerHTML = shuffled.map((piece, pos) => `<button class="puzzle-piece ${piece === pos ? 'correct' : ''}" data-pos="${pos}" style="background-image: url('${memoryImages[piece]}'); background-size: cover; background-position: center; font-size: 0;"></button>`).join('');
            
            grid.querySelectorAll('.puzzle-piece').forEach(btn => {
                btn.onclick = () => {
                    if (isComplete) return;
                    
                    if (selectedPiece === null) {
                        selectedPiece = btn;
                        btn.classList.add('selected');
                    } else {
                        const pos1 = parseInt(selectedPiece.dataset.pos);
                        const pos2 = parseInt(btn.dataset.pos);
                        [shuffled[pos1], shuffled[pos2]] = [shuffled[pos2], shuffled[pos1]];
                        selectedPiece.classList.remove('selected');
                        selectedPiece = null;
                        renderPuzzle();
                        
                        if (shuffled.every((p, i) => p === i)) {
                            isComplete = true;
                            setTimeout(() => this.showAlbumView(memoryImages), 500);
                        }
                    }
                };
            });
        };
        
        document.getElementById('shuffle-puzzle').onclick = () => {
            shuffled = [...pieces].sort(() => Math.random() - 0.5);
            selectedPiece = null;
            renderPuzzle();
        };
        
        renderPuzzle();
    }

    showAlbumView(memoryImages) {
        const albumView = document.getElementById('album-view');
        albumView.classList.remove('hidden');
        
        const polaroidTexts = ['Our Love', 'First Kiss', 'Smile', 'Together', 'Forever', 'Happy'];
        let currentPhoto = 0;
        
        const updatePhoto = () => {
            document.getElementById('album-display').src = memoryImages[currentPhoto];
            document.getElementById('polaroid-text').textContent = polaroidTexts[currentPhoto];
            document.getElementById('album-dots').innerHTML = memoryImages.map((_, i) => `<span class="album-dot ${i === currentPhoto ? 'active' : ''}" data-index="${i}"></span>`).join('');
        };
        
        document.getElementById('prev-photo').onclick = () => {
            currentPhoto = (currentPhoto - 1 + memoryImages.length) % memoryImages.length;
            updatePhoto();
        };
        
        document.getElementById('next-photo').onclick = () => {
            currentPhoto = (currentPhoto + 1) % memoryImages.length;
            updatePhoto();
        };
        
        document.getElementById('finish-album').onclick = () => {
            this.completeChallenge('album');
        };
        
        updatePhoto();
    }

    showGift(cardId) {
        const gifts = {
            'love-letter': {
                title: 'Your Love Letter',
                icon: '💌',
                content: `My dearest love,

Every day with you feels like a beautiful dream. Your smile lights up my world, your laugh is my favorite melody, and your love is the greatest gift I've ever received.

On this special day, I want you to know that you are cherished beyond measure. You make every ordinary moment extraordinary.

Happy Birthday, my love. Here's to many more years of adventures, laughter, and love.

Forever yours`
            },
            'poem': {
                title: 'A Poem For You',
                icon: '📖',
                content: `"You Are My Home"

In your eyes, I find my peace,
In your arms, my heart's release.
Through every storm and sunny day,
You are my home in every way.

Your laughter fills my soul with light,
Your love makes everything feel right.
No matter where our journey leads,
With you, I have all that I need.

Happy Birthday, my everything.`
            },
            'flower': {
                title: 'Your Virtual Bouquet',
                icon: '🌹',
                content: `A bouquet of tulips and carnations,
Each flower represents my admiration.

Tulips for perfect love so true,
Carnations for the fascination I have for you.

May these flowers brighten your day,
Just like you brighten mine in every way.

With love and petals, Happy Birthday!`
            },
            'cake': {
                title: 'Birthday Wishes',
                icon: '🍰',
                content: `Your birthday wish has been sent to the stars!

May this year bring you:

- Endless happiness
- Beautiful surprises  
- Dreams coming true
- Love that grows stronger
- Adventures to remember

The sweetest birthday to the sweetest person in my life!

P.S. Real cake is waiting for you!`
            },
            'song': {
                title: 'Our Song',
                icon: '🎵',
                content: `"Make It With You" by Ben and Ben

This beautiful song reminds me of us - 
of every moment, every memory,
every reason why I love you.

You make me want to make it work,
to build a life together.

You're my person, my love, my everything.

Happy Birthday, my forever song.`
            },
            'album': {
                title: 'Our Memory Album',
                icon: '📷',
                content: `Memories With You

Every photo tells a story,
Every moment, a treasure.

From our first hello to this very day,
You've filled my life with joy in every way.

Our album may be virtual today,
But our memories are real and here to stay.

Can't wait to make more memories with you!

Happy Birthday, my favorite chapter.`
            }
        };
        
        const gift = gifts[cardId];
        document.getElementById('gift-icon').textContent = gift.icon;
        document.getElementById('gift-title').textContent = gift.title;
        document.getElementById('gift-content').textContent = gift.content;
        
        document.getElementById('gift-modal').classList.remove('hidden');
        
        document.getElementById('claim-gift').onclick = () => {
            document.getElementById('gift-modal').classList.add('hidden');
        };
    }

    completeChallenge(cardId) {
        this.completed.push(cardId);
        const modals = document.querySelectorAll('.modal');
        modals.forEach(m => m.classList.add('hidden'));
        
        this.showGift(cardId);
        
        setTimeout(() => {
            this.setupAdventureScreen();
        }, 1000);
    }

    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        
        if (screenId === 'greeting-screen') {
            this.setupGreetingScreen();
        } else if (screenId === 'adventure-screen') {
            this.setupAdventureScreen();
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.onclick = () => {
                btn.closest('.modal').classList.add('hidden');
            };
        });
        
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    overlay.closest('.modal').classList.add('hidden');
                }
            };
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BirthdayQuest();
});