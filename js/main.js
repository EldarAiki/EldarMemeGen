"use strict";

// to whom might CR this, apologies for the mess, I know I should have divided the files better and use better names. 
// I was just trying to make it work atleast and then tried to patch up the caos. 




var gElCanvas;
var gCtx;
var gFillColor = "white";
var gStrokeColor;
var gTxtArray = [];
var gSelcetedImg;
var gCurrTextY = 70;
var gCurrTextX;
var gFontSize = 60;
var gFont = "Impact";
var gIsPressed = false;
var gIsSelected = false;
var gSelectedTxtIndex = null;
var gSelectedID = null;
var gID = 101;
var gIsToggled = false 
const gTouchEvs = ["touchstart", "touchmove", "touchend"];
const memeKey = "memes";

function init() {
  renderImages();
  renderTags();
}

function resizeCanvas() {
  const elContainer = document.querySelector(".canvas-container");
  gElCanvas.width = elContainer.offsetWidth;
  gElCanvas.height = elContainer.offsetHeight;
  renderCanvas();
}

function setCanvas(img) {
  gSelcetedImg = img;
  gElCanvas = document.querySelector("#canvas");
  gCtx = gElCanvas.getContext("2d");

  window.addEventListener("resize", resizeCanvas);

  // add listeners
  const addInput = document.querySelector("#addTxt")
    addInput.addEventListener("keypress", checkKey);

  gElCanvas.addEventListener("mousemove", onDrag);
  gElCanvas.addEventListener("mousedown", onDown);
  gElCanvas.addEventListener("mouseup", onUp);

  gElCanvas.addEventListener("touchmove", onDrag);
  gElCanvas.addEventListener("touchstart", onDown);
  gElCanvas.addEventListener("touchend", onUp);

  gCurrTextX = parseInt(gElCanvas.width / 2);
  layImage();
}

function layImage() {
  var img = new Image();
  img.src = gSelcetedImg;
  img.onload = DrawImgSize;
  function DrawImgSize() {
    const imgWidth = this.naturalWidth
    const imgHight = this.naturalHeight
    const ratio = imgHight/imgWidth

    const elContainer = document.querySelector('.canvas-container')

    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetWidth * ratio

    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    renderEditedTxt();
    renderTxtArray();
    renderSelection();
  }
}

function onInputChange(ev) {
    if (gIsToggled) return
  layImage();

  if (gSelectedTxtIndex) {
      let txt = document.querySelector("#addTxt").value 
      gTxtArray[gSelectedTxtIndex].txt = txt
  }

  const elTxt = document.querySelector("#addTxt");

  let txt = elTxt.value;

  if (gTxtArray.length > 4) return;
  renderCanvas();
}

function setText() {
    gIsToggled = false
    console.log(gCurrTextX,gCurrTextY);
  const elTxt = document.querySelector("#addTxt");
  if (!elTxt.value) return;
  if (gTxtArray.length > 4) return;
  gTxtArray.push({
    txt: elTxt.value,
    x: gCurrTextX,
    y: gCurrTextY,
    id: gID++,
    dimensions: {xS:gCurrTextX - 100, xE:gCurrTextX + 100, yS: gCurrTextY -40 , yE:gCurrTextY +40 }
    // dimensions: drawSrroundRect(gCurrTextX, gCurrTextY, elTxt.value.length),
  });
  console.log(drawSrroundRect(gCurrTextX, gCurrTextY, elTxt.value.length));
  elTxt.value = "";
  if (gTxtArray.length === 1) gCurrTextY = gElCanvas.height - 50;
  if (gTxtArray.length === 2) gCurrTextY = 150;
  if (gTxtArray.length === 3) gCurrTextY = gElCanvas.height - 150;
  if (gTxtArray.length === 4) gCurrTextY = parseInt(gElCanvas.height / 2);

  console.log(gTxtArray[0].dimensions);
  renderCanvas();
}

function setFill(val) {
  gFillColor = val;
}

function setStroke(val) {
  gStrokeColor = val;
}

function restoreCanvas() {
  gCtx.restore();
}

function txtUp() {
  if (gSelectedTxtIndex || gSelectedTxtIndex === 0) {
    gTxtArray[gSelectedTxtIndex].y -= 5;
    layImage();
  } else {
    gCurrTextY -= 5;
    renderCanvas();
    renderEditedTxt();
  }
}

function txtDown() {
  if (gSelectedTxtIndex || gSelectedTxtIndex === 0) {
    gTxtArray[gSelectedTxtIndex].y += 5;
    layImage();
  } else {
    gCurrTextY += 5;
    renderCanvas();
    renderEditedTxt();
  }
}

function incFont() {
  gFontSize += 2;
  renderCanvas();
  renderEditedTxt();
}

function decFont() {
  gFontSize -= 2;
  renderCanvas();
  renderEditedTxt();
}

function getTxtStart(txt) {
  return parseInt(gElCanvas.width / 2 - (txt.length * gFontSize) / 5);
}

function setFont(val) {
  gFont = val;
  layImage();
}

// drag functions

function onDrag(ev) {
  const pos = getEvPos(ev);
  for (var i = 0; i < gTxtArray.length; i++) {
    if (
      pos.x >= gTxtArray[i].dimensions.xS &&
      pos.x <= gTxtArray[i].dimensions.xE &&
      pos.y >= gTxtArray[i].dimensions.yS &&
      pos.y <= gTxtArray[i].dimensions.yE
    ) {
      document.body.style.cursor = "grap";
      
      break;
    } else {
      document.body.style.cursor = "arrow"
    }

    if (!gIsPressed) return
    moveTxt(ev)
    renderSelection()
  }
}

function onDown(ev) {
//   ev.preventDefault();

  const pos = getEvPos(ev);
  console.log(pos);
  // layImage()
  for (var i = 0; i < gTxtArray.length; i++) {
    if (
      pos.x >= gTxtArray[i].dimensions.xS &&
      pos.x <= gTxtArray[i].dimensions.xE &&
      pos.y >= gTxtArray[i].dimensions.yS &&
      pos.y <= gTxtArray[i].dimensions.yE
    ) {
      gIsPressed = true;
      gIsSelected = true
      document.body.style.cursor = "grabbing";
      gSelectedID = gTxtArray[i].id;
      gSelectedTxtIndex = i;
      renderSelection();
      console.log("found txt");
      return
    } else {
      gIsPressed = false;
      gSelectedID = null
      gIsSelected = false
      document.body.style.cursor = "arrow";
      gSelectedTxtIndex = "null";
    }
  }
}

function getEvPos(ev) {
  var pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  };
  if (gTouchEvs.includes(ev.type)) {
    ev.preventDefault();
    ev = ev.changedTouches[0];
    pos = {
      x: ev.pageX - ev.target.offsetLeft,
      y: ev.pageY - ev.target.offsetTop,
    };
  }
  return pos;
}

function onUp(ev) {
  gIsPressed = false;
  document.body.style.cursor = "grab";
}

function moveTxt(ev) {
  const pos = getEvPos(ev);
  gTxtArray[gSelectedTxtIndex].x = pos.x;
  gTxtArray[gSelectedTxtIndex].y = pos.y;
  gTxtArray[gSelectedTxtIndex].dimensions = {xS:pos.x- 50, xE:pos.x + 50, yS: pos.y-10, yE:pos.y +10 }

  layImage();
}

function toggleText() {
    gIsToggled = true
  if (gSelectedTxtIndex === null) gSelectedTxtIndex = 0;
  renderCanvas();
  gIsSelected = true;
  console.log(gSelectedTxtIndex);
  if (gTxtArray.length === 0) return;
  if (gSelectedTxtIndex === gTxtArray.length - 1) gSelectedTxtIndex = 0;
  else gSelectedTxtIndex++;
  renderSelection();
  document.querySelector("#addTxt").value = gTxtArray[gSelectedTxtIndex].txt
}

function unselect() {
  return;
  gIsSelected = false;
  console.log("unselect");
}

function backToGallery() {
  const elGalley = document.querySelector(".entry-gallery");
  elGalley.style.display = "flex";
  const elEditor = document.querySelector(".editor-main");
  elEditor.style.display = "none";
  const elGal = document.querySelector(".meme-gallery-present");
  elGal.style.display = "none";
  const elBtn = document.querySelector(".meme-gallery");
  elBtn.style.display = "block";
  const elBack = document.querySelector(".back-gallery");
  elBack.style.display = "none";
  gTxtArray = [];
}

function showMemes() {
  const elGalley = document.querySelector(".entry-gallery");
  elGalley.style.display = "none";
  const elGal = document.querySelector(".meme-gallery-present");
  elGal.style.display = "grid";
  const elEditor = document.querySelector(".editor-main");
  elEditor.style.display = "none";
  const elBtn = document.querySelector(".meme-gallery");
  elBtn.style.display = "none";
  const elBack = document.querySelector(".back-gallery");
  elBack.style.display = "block";
  presentMemes();
}

function downloadMeme(elLink) {
  const data = gElCanvas.toDataURL();
  elLink.href = data;
  console.log("download");
}

function saveMeme() {
  var memeArr = loadFromStorage(memeKey);
  if (!memeArr) memeArr = [];
  memeArr.push(gElCanvas.toDataURL());
  saveToStorage(memeKey, memeArr);
}

function presentMemes() {
  const memeArr = loadFromStorage(memeKey);
  let i = 0;

  let galleryHTML = memeArr.map(
    (img, ide) => `
    <div class="meme-card">
    <img  class="meme-item" src="${img}" alt="">
    <div class="meme-ui">
        <button onclick="editMeme(${ide})">edit</button>
        <button onclick="deleteMemeFromStorage(${ide})">Delete</button>
    </div>
</div>`
  );
  const elMemeGal = document.querySelector(".meme-gallery-present");
  elMemeGal.innerHTML = galleryHTML.join("");
}

function deleteMemeFromStorage(index) {
    let memes = loadFromStorage(memeKey)
    memes.splice(index, 1)
    saveToStorage(memeKey, memes)
    presentMemes()
}


function editMeme(index) {
    let memes = loadFromStorage(memeKey)
    let meme = memes[index]
    const elGalley = document.querySelector(".entry-gallery");
    elGalley.style.display = "none";
    const elGal = document.querySelector('.meme-gallery-present')
    elGal.style.display = 'none'
    const elEditor = document.querySelector(".editor-main");
    elEditor.style.display = "flex";
    gElCanvas = document.querySelector("#canvas");
    gCtx = gElCanvas.getContext("2d");
    gElCanvas = meme

    window.addEventListener("resize", resizeCanvas);

    // add listeners

    gElCanvas.addEventListener("mousemove", onDrag);
    gElCanvas.addEventListener("mousedown", onDown);
    gElCanvas.addEventListener("mouseup", onUp);

    gElCanvas.addEventListener("touchmove", onDrag);
    gElCanvas.addEventListener("touchstart", onDown);
    gElCanvas.addEventListener("touchend", onUp);

    gCurrTextX = parseInt(gElCanvas.width / 2);
    layImage();

}

function checkKey(ev) {
    if (ev.key === 'Enter') setText()
}
