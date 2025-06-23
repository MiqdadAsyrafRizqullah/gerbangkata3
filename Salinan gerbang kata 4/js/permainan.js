// Game Data
const games = {
  sound: {
    items: [
      { name: "Anjing", sound: "anjing.mp3", image: "anjing.png" },
      { name: "Kucing", sound: "kucing.mp3", image: "kucing.png" },
      { name: "Mobil", sound: "mobil.mp3", image: "mobil.png" }
    ],
    currentIndex: 0,
    score: 0
  },
  image: {
    items: [
      { image: "apel.png", correctAnswer: "Apel" },
      { image: "bola.png", correctAnswer: "Bola" }
    ],
    currentIndex: 0,
    score: 0
  }
};

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
  // Set active nav
  setActiveNav();
  
  // Animate game cards
  animateCards();
  
  // Initialize game buttons
  initGameButtons();
});

function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop();
  const navButtons = document.querySelectorAll('.nav-btn-3d');
  
  navButtons.forEach(button => {
    button.classList.remove('active');
    const buttonPage = button.getAttribute('onclick').match(/'([^']+)'/)[1];
    if (buttonPage === currentPage) {
      button.classList.add('active');
      // Tambahkan efek khusus untuk tombol aktif
      button.style.backgroundColor = '#00ccff';
      button.style.boxShadow = '0 0 15px #00ccff';
      button.querySelector('i').style.color = '#021a40';
    }
  });
}

function animateCards() {
  const cards = document.querySelectorAll('.game-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.animation = `cardEntrance 0.5s ease-out ${index * 0.1}s forwards`;
  });
}

function initGameButtons() {
  const gameButtons = document.querySelectorAll('.game-btn');
  
  gameButtons.forEach(button => {
    // Hover effect
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-3px)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
    
    // Click effect
    button.addEventListener('click', function() {
      // Ripple effect
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      this.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

function startGame(gameType) {
  console.log(`Memulai game: ${gameType}`);
  // Sembunyikan semua game screen
  document.querySelectorAll('.game-screen').forEach(screen => {
    screen.style.display = 'none';
  });
  
  // Tampilkan game screen yang dipilih
  const gameScreen = document.getElementById(`${gameType}GameScreen`);
  if (gameScreen) {
    gameScreen.style.display = 'block';
    initGame(gameType);
  }
}

function initGame(gameType) {
  switch(gameType) {
    case 'sound':
      initSoundGame();
      break;
    case 'image':
      initImageGame();
      break;
    // Tambahkan case untuk game lainnya
  }
}

function initSoundGame() {
  const gameData = games.sound;
  gameData.currentIndex = 0;
  gameData.score = 0;
  updateSoundGame();
}

function updateSoundGame() {
  const gameData = games.sound;
  const currentItem = gameData.items[gameData.currentIndex];
  
  const animalCard = document.querySelector('#soundGameScreen .animal-card');
  animalCard.querySelector('h3').textContent = currentItem.name;
  animalCard.querySelector('img').src = `src/game/images/${currentItem.image}`;
  animalCard.querySelector('audio').src = `src/game/sounds/${currentItem.sound}`;
  
  // Update progress
  const progress = (gameData.currentIndex / gameData.items.length) * 100;
  document.querySelector('#soundGameCard .progress-bar').style.width = `${progress}%`;
}

function playSound(animal) {
  const audio = document.querySelector(`#soundGameScreen audio[src*="${animal}"]`);
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

function giveFeedback(feedbackType) {
  const gameData = games.sound;
  
  if (feedbackType === 'good') {
    gameData.score += 10;
    showFeedback('Bagus!', 'success');
  } else {
    showFeedback('Coba lagi!', 'warning');
  }
  
  // Update score
  document.querySelector('#soundGameScreen .game-score span').textContent = gameData.score;
  
  // Next item
  gameData.currentIndex++;
  if (gameData.currentIndex < gameData.items.length) {
    updateSoundGame();
  } else {
    // Game over
    showFeedback('Permainan selesai!', 'success');
    setTimeout(exitGame, 2000);
  }
}

function showFeedback(message, type) {
  const feedback = document.createElement('div');
  feedback.className = `feedback ${type}`;
  feedback.textContent = message;
  
  const gameContent = document.querySelector('#soundGameScreen .game-content');
  gameContent.appendChild(feedback);
  
  setTimeout(() => {
    feedback.remove();
  }, 2000);
}

function exitGame() {
  document.querySelectorAll('.game-screen').forEach(screen => {
    screen.style.display = 'none';
  });
  
  // Update progress bars
  updateAllProgressBars();
}

function updateAllProgressBars() {
  // Implementasi update progress untuk semua game
}

function navigateTo(page) {
  window.location.href = page;
}