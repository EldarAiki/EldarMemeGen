
function renderTxt(txt, x = parseInt(gElCanvas.width / 2), y = 50) {

    var locX
    if (!gIsPressed) locX = getTxtStart(txt)
    else locX = x
    gCtx.font = `${gFontSize}px ${gFont}`
    gCtx.fillStyle = gFillColor
    gCtx.lineWidth = 4;
    gCtx.strokeStyle = gStrokeColor
    gCtx.fillText(txt, locX, y)
    gCtx.strokeText(txt, locX, y)

}

function renderEditedTxt() {

    const elTxt = document.querySelector('#addTxt')
    var txt = elTxt.value

    renderTxt(txt, gCurrTextX, gCurrTextY)
    var textWidth = gCtx.measureText(txt).width
    drawSrroundRect(gCurrTextX, gCurrTextY, textWidth)
}

function renderTxtArray() {

    gTxtArray.forEach((txt) => {

        renderTxt(txt.txt, txt.x, txt.y)
    })
}

function renderCanvas() {

    layImage()
    renderTxtArray()
    
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function deleteTxt() {
    const elTxt = document.querySelector('#addTxt');
    elTxt.value = ''
    renderCanvas()
    renderEditedTxt()
}

function drawSrroundRect(x, y, len) {
    if (len === 0) return
    gCtx.beginPath()
    gCtx.setLineDash([4])
    gCtx.moveTo(x, y)

    var xStart = x - len / 2 
    var yStart = y - gFontSize 
    var xEnd = len + 20 + xStart +6
    var yEnd = yStart + gFontSize + 6

    gCtx.strokeRect(x - len / 2 + 6, y - gFontSize + 4, len + 20, gFontSize + 2)
    gCtx.setLineDash([])
    gCtx.closePath()
    return { xS: xStart, xE: xEnd, yS: yStart, yE: yEnd }

}

function renderSelection() {
    if (!gIsSelected) return
    if (gTxtArray.length === 0) return
    var txt
    if (gSelectedID) txt = gTxtArray.find((txt) => txt.id === gSelectedID)
    else txt = gTxtArray[gSelectedTxtIndex]
    var textWidth = gCtx.measureText(txt).width
    drawSrroundRect(txt.x, txt.y, textWidth)
}



