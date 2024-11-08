<template>
  <div class="color-game">
    <h1>顏色辨識遊戲</h1>
    <p>當顯示顏色時，請用語音說出顯示的顏色名稱！</p>
    <div id="color-display" :style="{ color: colorCode }">{{ displayedWord }}</div>
    <button @click="startGame">開始遊戲</button>
    <div id="result">{{ result }}</div>
    <div id="score">分數: {{ score }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colors: ["黑", "棕", "紅", "橙", "黃", "綠", "藍", "紫", "灰", "白"],
      score: 0,
      roundTime: 30, // 每回合時間（秒）
      timer: null,
      displayedWord: "按下開始遊戲",
      colorCode: "#000000",
      result: "",
      recognition: null, // 語音辨識物件
    };
  },
  methods: {
    startGame() {
      this.score = 0;
      this.result = "";
      this.startRound();
      this.timer = setTimeout(this.endGame, this.roundTime * 1000);
    },
    startRound() {
      const word = this.colors[Math.floor(Math.random() * this.colors.length)];
      let colorDisplayed;
      do {
        colorDisplayed = this.colors[Math.floor(Math.random() * this.colors.length)];
      } while (colorDisplayed === word);

      this.displayedWord = word;
      this.colorCode = this.getColorCode(colorDisplayed);
      this.startSpeechRecognition(colorDisplayed);
    },
    getColorCode(colorName) {
      const colorMap = {
        黑: "#000000",
        棕: "#A52A2A",
        紅: "#FF0000",
        橙: "#FFA500",
        黃: "#FFFF00",
        綠: "#008000",
        藍: "#0000FF",
        紫: "#800080",
        灰: "#808080",
        白: "#FFFFFF",
      };
      return colorMap[colorName];
    },
    startSpeechRecognition(correctColor) {
      // 初始化 SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        this.result = "您的瀏覽器不支援語音辨識";
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = "zh-TW";
      this.recognition.interimResults = false;

      // 開始語音辨識
      this.recognition.start();

      // 處理辨識結果
      this.recognition.onresult = (event) => {
        const userAnswer = event.results[0][0].transcript;
        if (userAnswer === correctColor) {
          this.score++;
          this.result = "答對了！";
        } else {
          this.result = `答錯了！正確答案是：${correctColor}`;
        }
        this.recognition.stop(); // 停止辨識，避免下一回合衝突
        setTimeout(this.startRound, 1000); // 等待一秒再開始新回合
      };

      // 處理錯誤
      this.recognition.onerror = (event) => {
        this.result = "語音辨識失敗，請再試一次";
        console.error("語音辨識錯誤:", event.error);
        this.recognition.stop();
        setTimeout(this.startRound, 1000);
      };
    },
    endGame() {
      clearTimeout(this.timer);
      this.result = `遊戲結束！總分數: ${this.score}`;
      this.displayedWord = "按下開始遊戲";
      if (this.recognition) {
        this.recognition.stop(); // 結束遊戲時停止語音辨識
      }
    },
  },
};
</script>

<style scoped>
.color-game {
  text-align: center;
  font-family: Arial, sans-serif;
}
#color-display {
  font-size: 3em;
  margin-top: 50px;
}
#result, #score {
  margin-top: 20px;
  font-size: 1.5em;
}
button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1em;
}
</style>
