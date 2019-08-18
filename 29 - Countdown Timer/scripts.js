/*jshint esversion: 6 */
// 建立全域變數
let countdown;

// 建立操作元素
const timerDisplay = document.querySelector(".display__time-left");
const endTime = document.querySelector(".display__end-time");
const buttons = document.querySelectorAll("[data-time]");

// 倒數計時器
function timer(seconds) {
  // 每次啟動新計時器時，先取消已存在的計時器
  clearInterval(countdown);
  // 取得時間
  const now = Date.now();
  const then = now + seconds * 1000;
  // 讓計時器一啟動時，顯示設定時間與預計結束時間
  displayTimeLeft(seconds);
  displayEndTime(then);

  // 將 setInterval 設定在變數 countdown 中，方便後續的使用
  countdown = setInterval(() => {
    // 計算倒數計時總時間長度
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // setInterval 不會自己停下來，要自己設定當 < 0 時終止
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    // 每 1000ms 更新一次顯示時間
    displayTimeLeft(secondsLeft);
  }, 1000);
}

// 顯示倒數計時時間
function displayTimeLeft(seconds) {
  // 取得 分、秒
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  // 讓秒數個位數時前面補 0
  const display = `${minutes}:${remainderSeconds < 10 ? "0" : ""}${remainderSeconds}`;
  // 讓網頁上方頁籤顯示倒數秒數
  document.title = display;
  // 顯示在 HTML 中
  timerDisplay.textContent = display;
  // console.log({minutes, remainderSeconds});
}

// 顯示倒數計時結束時間
function displayEndTime(timestamp) {
  // 將傳入的 timestamp 變成這樣的時間格式資訊 Sat Aug 17 2019 17:03:27 GMT+0800
  const end = new Date(timestamp);
  // 分別取得 時、分
  const hour = end.getHours();
  // 校正成 12 小時制
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();
  // 顯示在 HTML 中
  endTime.textContent = `Be Back At ${adjustedHour}:${minutes < 10 ? "0" : ""}${minutes}`;
}

// 開始計時
function startTimer() {
  // console.log(this.dataset.time);
  // 取得按鈕回傳的值，並轉成 Int
  const seconds = parseInt(this.dataset.time);
  // 回傳至倒數計時器
  timer(seconds);
}

// 監聽事件，監聽上方快速倒數計時按鈕
buttons.forEach(button => button.addEventListener("click", startTimer));

document.customForm.addEventListener("submit", function(e) {
  // 因為按鈕送出預設會 reload 網頁，所以要中斷預設行為
  e.preventDefault();
  const mins = this.minutes.value;
  // console.log(mins);
  timer(mins * 60);
  // 清空輸入值
  this.reset();
});
