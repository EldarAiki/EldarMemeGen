'use strict'

var gElCanvas
var gCtx
var gFillColor = 'white'
var gStrokeColor
var gTxtArray = []
var gSelcetedImg 
var gCurrTextY = 70
var gCurrTextX
var gFontSize = 60
var gFont = 'Impact'
var gIsPressed = false
var gIsSelected = false
var gSelectedTxtIndex = null
var gSelectedID = null
var gID = 101
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
const memeKey = 'memes'


function init() {

    renderImages()
    renderTags() 
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth 
    gElCanvas.height = elContainer.offsetHeight 
    renderCanvas()
}

function setCanvas(img) {

    gSelcetedImg = img
    gElCanvas = document.querySelector('#canvas');
    gCtx = gElCanvas.getContext('2d');

    window.addEventListener('resize', resizeCanvas)

    // add listeners

    gElCanvas.addEventListener('mousemove', onDrag)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)

    gElCanvas.addEventListener('touchmove', onDrag)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)

    gCurrTextX = parseInt(gElCanvas.width / 2)
    layImage()

}

function layImage() {
    var img = new Image()
    img.src = gSelcetedImg
    img.onload = DrawImgSize
    function DrawImgSize() {
        gElCanvas.height = this.naturalHeight
        gElCanvas.width = this.naturalWidth
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        renderEditedTxt()
        renderTxtArray()
        renderSelection()
    }

}

function onInputChange(ev) {

    layImage()

    const elTxt = document.querySelector('#addTxt');

    let txt = elTxt.value

    if (gTxtArray.length > 4) return
    renderCanvas()
}

function setText() {

    const elTxt = document.querySelector('#addTxt');
    if (!elTxt.value) return
    if (gTxtArray.length > 4) return
    gTxtArray.push({
        txt: elTxt.value,
        x: gCurrTextX,
        y: gCurrTextY,
        id:gID++,
        dimensions: drawSrroundRect(gCurrTextX,gCurrTextY,elTxt.value.length )
    })
    console.log(drawSrroundRect(gCurrTextX,gCurrTextY,elTxt.value.length ));
    elTxt.value = ''
    if (gTxtArray.length === 1) gCurrTextY = gElCanvas.height - 50
    if (gTxtArray.length === 2) gCurrTextY = 150
    if (gTxtArray.length === 3) gCurrTextY = gElCanvas.height - 150
    if (gTxtArray.length === 4) gCurrTextY = parseInt(gElCanvas.height / 2)

    console.log(gTxtArray[0].dimensions);
    renderCanvas()

}

function setFill(val) {
    gFillColor = val
}

function setStroke(val) {
    gStrokeColor = val
}

function restoreCanvas() {
    gCtx.restore()
}

function txtUp() {

    if (gSelectedTxtIndex || gSelectedTxtIndex === 0) {
        gTxtArray[gSelectedTxtIndex].y -=5
        layImage()

    }else{


        gCurrTextY -= 5
        renderCanvas()
        renderEditedTxt()
    }
}

function txtDown() {

    if (gSelectedTxtIndex || gSelectedTxtIndex === 0) {
        gTxtArray[gSelectedTxtIndex].y +=5
        layImage()

    }else{

        gCurrTextY += 5
        renderCanvas()
        renderEditedTxt()
    }
}

function incFont() {
    gFontSize += 2
    renderCanvas()
    renderEditedTxt()
}

function decFont() {
    gFontSize -= 2
    renderCanvas()
    renderEditedTxt()
}

function getTxtStart(txt) {
    return parseInt((gElCanvas.width / 2 - txt.length * gFontSize / 5))

}

function setFont(val) {
    gFont = val
    layImage()
}

// drag functions 

function onDrag(ev) {

    if (!gIsPressed) return
    moveTxt(ev)
}

function onDown(ev) {

    ev.preventDefault()

    const pos = getEvPos(ev)
    layImage()
    for (var i = 0; i < gTxtArray.length; i++) {
        if (pos.x >= gTxtArray[i].dimensions.xS && pos.x <= gTxtArray[i].dimensions.xE &&
            pos.y >= gTxtArray[i].dimensions.yS && pos.y <= gTxtArray[i].dimensions.yE) 
            {
                gIsPressed = true
                document.body.style.cursor = 'grabbing'
                gSelectedID = gTxtArray[i].id
                renderSelection()
                console.log('found txt');
                break
                
            }else {
                gIsPressed = false
                document.body.style.cursor = 'arrow'
                console.log('no txt');
            }

    } 

}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

function onUp(ev) {
    gIsPressed = false
    document.body.style.cursor = 'grab'
}

function moveTxt(ev) {
    return
}

function toggleText() {
    if (gSelectedTxtIndex === null) gSelectedTxtIndex = 0
    renderCanvas()
    gIsSelected = true
    console.log(gSelectedTxtIndex);
    if (gTxtArray.length === 0) return
    if (gSelectedTxtIndex === gTxtArray.length-1) gSelectedTxtIndex = 0
    else gSelectedTxtIndex++
    renderSelection()
}

function unselect() {
    return
    gIsSelected = false
    console.log('unselect');
}

function backToGallery() {

    const elGalley = document.querySelector('.entry-gallery')
    elGalley.style.display = 'flex'
    const elEditor = document.querySelector('.editor-main')
    elEditor.style.display = 'none'
    const elGal = document.querySelector('.meme-gallery-present')
    elGal.style.display = 'none'
    const elBtn = document.querySelector(".meme-gallery");
    elBtn.style.display = "block";
    const elBack = document.querySelector(".back-gallery");
    elBack.style.display = "none";
    gTxtArray = []
}

function showMemes() {
    const elGalley = document.querySelector(".entry-gallery");
    elGalley.style.display = "none";
    const elGal = document.querySelector('.meme-gallery-present')
    elGal.style.display = 'grid'
    const elEditor = document.querySelector(".editor-main");
    elEditor.style.display = "none";
    const elBtn = document.querySelector(".meme-gallery");
    elBtn.style.display = "none";
    const elBack = document.querySelector(".back-gallery");
    elBack.style.display = "block";
    presentMemes()

}

function downloadMeme(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
    console.log('download');
}

function saveMeme() {
    var memeArr = loadFromStorage(memeKey)
    if (!memeArr) memeArr = []
    memeArr.push(gElCanvas.toDataURL())
    saveToStorage(memeKey, memeArr)

}

function presentMemes() {

    const memeArr = loadFromStorage(memeKey)
    let i = 0

     let galleryHTML = memeArr.map((img) => 
        
        `<img  class="meme-item" src="${img}" alt="">`)
    const elMemeGal = document.querySelector('.meme-gallery-present')
    elMemeGal.innerHTML = galleryHTML.join('')

}

