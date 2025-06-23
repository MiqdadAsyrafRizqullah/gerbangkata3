// Data Suara dan Kata Kunci
const soundData = [
    {
      name: "Anjing",
      image: "src/game/images/anjing.png",
      sound: "src/game/sounds/anjing.mp3",
      keywords: ["guk", "gong", "haf", "woof", "anjing"]
    },
    {
      name: "Kucing",
      image: "src/game/images/kucing.png",
      sound: "src/game/sounds/kucing.mp3", 
      keywords: ["meong", "ngeong", "miaw", "cat", "kucing"]
    },
    {
      name: "Sapi",
      image: "src/game/images/sapi.png",
      sound: "src/game/sounds/sapi.mp3",
      keywords: ["moo", "mu", "sapi", "cow"]
    },
    {
      name: "Mobil",
      image: "src/game/images/mobil.png",
      sound: "src/game/sounds/mobil.mp3",
      keywords: ["broom", "vroom", "ngeng", "mobil", "car"]
    },
    {
      name: "Pintu",
      image: "src/game/images/pintu.png",
      sound: "src/game/sounds/pintu.mp3",
      keywords: ["kreek", "creak", "pintu", "door"]
    },
    {
      name: "Burung",
      image: "src/game/images/burung.png",
      sound: "src/game/sounds/burung.mp3",
      keywords: ["cit", "cuit", "kicau", "bird"]
    },
    {
      name: "Kambing",
      image: "src/game/images/kambing.png",
      sound: "src/game/sounds/kambing.mp3",
      keywords: ["mbek", "mee", "goat", "kambing"]
    }
  ];
  
  let currentGameIndex = 0;
  let score = 0;
  let recognition;
  let isListening = false;
  
  document.addEventListener('DOMContentLoaded', () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Browser Anda tidak mendukung Speech Recognition. Gunakan Chrome atau Edge terbaru.");
      return;
    }
  
    initSpeechRecognition();
    loadGame(currentGameIndex);
  });
  
  function initSpeechRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'id-ID';
  
    recognition.onstart = () => {
      isListening = true;
      document.getElementById('micBtn').classList.add('listening');
      document.getElementById('resultText').textContent = "Mendengarkan...";
    };
  
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      checkSpeechResult(speechResult);
    };
  
    recognition.onerror = (event) => {
      console.error("Error:", event.error);
      document.getElementById('resultText').textContent = "Error: " + event.error;
      stopListening();
    };
  
    recognition.onend = () => {
      stopListening();
    };
  }
  
  function loadGame(index) {
    if (index >= soundData.length) {
      // Game selesai
      document.getElementById('resultText').innerHTML = `
        <strong>Permainan Selesai!</strong><br>
        Skor akhir Anda: ${score} dari ${soundData.length * 10}
      `;
      document.getElementById('nextBtn').disabled = true;
      return;
    }
  
    const currentSound = soundData[index];
    document.getElementById('animalImage').src = currentSound.image;
    document.getElementById('animalName').textContent = currentSound.name;
    document.getElementById('animalSound').src = currentSound.sound;
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('resultText').textContent = "Tekan tombol 'Tirukan' lalu ucapkan suara yang Anda dengar";
    document.getElementById('accuracyBar').style.width = "0%";
    document.getElementById('accuracyText').textContent = "0% Kemiripan";
  }
  
  function playSound() {
    const sound = document.getElementById('animalSound');
    sound.currentTime = 0;
    sound.play();
  }
  
  function startListening() {
    if (isListening) return;
    recognition.start();
  }
  
  function stopListening() {
    isListening = false;
    document.getElementById('micBtn').classList.remove('listening');
  }
  
  function checkSpeechResult(speech) {
    const currentSound = soundData[currentGameIndex];
    let maxMatch = 0;
    
    // Cari kata kunci yang paling cocok
    currentSound.keywords.forEach(keyword => {
      if (speech.includes(keyword)) {
        const matchPercentage = (keyword.length / speech.length) * 100;
        if (matchPercentage > maxMatch) maxMatch = matchPercentage;
      }
    });
  
    // Hitung akurasi (minimal 30% untuk dianggap benar)
    const accuracy = Math.min(Math.round(maxMatch * 1.5), 100);
    const isCorrect = accuracy >= 30;
    
    // Update UI
    document.getElementById('accuracyBar').style.width = `${accuracy}%`;
    document.getElementById('accuracyText').textContent = `${accuracy}% Kemiripan`;
    
    if (isCorrect) {
      score += 10;
      document.getElementById('soundScore').textContent = score;
      document.getElementById('resultText').innerHTML = `
        <strong>Benar!</strong><br>
        Anda mengucapkan: "${speech}"<br>
        Jawaban yang diharapkan: "${currentSound.keywords[0]}"
      `;
      document.getElementById('resultFeedback').style.backgroundColor = "rgba(76, 175, 80, 0.2)";
    } else {
      document.getElementById('resultText').innerHTML = `
        <strong>Coba lagi!</strong><br>
        Anda mengucapkan: "${speech}"<br>
        Coba tirukan: "${currentSound.keywords[0]}"
      `;
      document.getElementById('resultFeedback').style.backgroundColor = "rgba(255, 193, 7, 0.2)";
    }
    
    document.getElementById('nextBtn').disabled = false;
  }
  
  function nextGame() {
    currentGameIndex++;
    loadGame(currentGameIndex);
  }
  
  // Event Listeners
  document.getElementById('playSoundBtn').addEventListener('click', playSound);
  document.getElementById('micBtn').addEventListener('click', startListening);
  document.getElementById('nextBtn').addEventListener('click', nextGame);