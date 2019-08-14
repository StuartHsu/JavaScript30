/*jshint esversion: 6 */

const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  // 取用視訊裝置，回傳 Promise 狀態
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    // 當 promise 回傳成功後，將 mediaStream 轉成 video player 了解的東西
    .then(localMediaStream => {
      // console.log(localMediaStream);
      // TypeError: Failed to execute 'createObjectURL' on 'URL': No function
      // https://stackoverflow.com/questions/27120757/failed-to-execute-createobjecturl-on-url
      // video.src = window.URL.createObjectURL(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.error(`OH NO!!`, err);
    });
}

function paintToCanvas() {
  // 設定長寬
  const width = video.videoWidth;
  const height = video.videoHeight;
  // console.log(width, height);
  // 讓 canvas 長寬要跟 video 一樣
  canvas.width = width;
  canvas.height = height;

  // 用 setInterval 持續獲得影像
  return setInterval(() => {
    // 抓取 video 的影像放在位置 (0,0)
    ctx.drawImage(video, 0, 0, width, height);
    // filter： get the pixel out of canvas, and then you mess whit then, changing the RGB values, and put then back in.
    // take the pixel out, 取出目前 canvas 這區域中所有像素位置
    let pixels = ctx.getImageData(0, 0, width, height);
    // console.log(pixels);
    // mess with them, 產生效果
    // pixels = redEffect(pixels);

    // mess with them, 產生效果
    // pixels = rgbSplit(pixels);
    // 設置透明效果
    // ctx.globalAlpha = 0.1;

    // pixels = greenScreen(pixels);

    // put them back, 置入效果回 canvas
    ctx.putImageData(pixels, 0, 0);

  }, 16);
}

function takePhoto() {
  // play the sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of canvas ;將 canvas 中的影像轉出來
  const data = canvas.toDataURL("image/jpeg");
  // console.log(data);
  // 直接建立圖片連結，建立 HTML 的連結元素 <a>
  const link = document.createElement("a");
  // 將連結與轉出後的圖檔連在一起
  link.href = data;
  // 設置連結為下載
  link.setAttribute("download", "handsome");
  // 設置預覽圖
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
  // 將新圖片插入在最新的位置
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  // pixels not an array, pixels.data is an array
  // 用 for loop 將每個像素做一次下面的效果，而像素資料是每 4 個一組 (red, greed, blue, alpha)
  for (let i = 0; i < pixels.data.length; i+=4) {
    // 每個紅色像素的位置+100 增強紅色
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // red
    // 每個綠色像素的位置-50 降低綠色
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    // 每個藍色像素的位置*0.5 降低藍色
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    // 將原本位置為第 i - 500 的像素改成位置第 i + 0 的像素顏色 2
    pixels.data[i - 150] = pixels.data[i + 0];
    // 將原本位置為第 i + 500 的像素改成位置第 i + 1 的像素顏色 0
    pixels.data[i + 500] = pixels.data[i + 1];
    // 將原本位置為第 i - 550 的像素改成位置第 i + 2 的像素顏色 1
    pixels.data[i - 548] = pixels.data[i + 2];
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  // console.log(levels);

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      // i + 3 為 alpha，而 alpha = 0代表透明
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

getVideo();

// 當 getVideo 可以播放，則呼叫 paintToCanvas
video.addEventListener("canplay", paintToCanvas);
