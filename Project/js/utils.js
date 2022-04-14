'use strict'

function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell-' + i + '-' + j;
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getRndInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function getEmptyCells(arr) {

    var emptyCells = []
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[0].length; j++) {

          if (arr[i][j] === EMPTY) {
            emptyCells.push({i:i, j:j})
          }
        }
    }
    return emptyCells
}


function buildMatItem(num, item) {
  const SIZE = 10;
  gFoodCount = 0
  var board = [];
  for (var i = 0; i < num; i++) {
      board.push([]);
      for (var j = 0; j < num; j++) {
            board[i][j] = item;
      }
    }
  return board;
}   


function getNighboursPos(pos,item,board = gBoard) {
//returns array of positions of neighboring cells with the item
  var arr = []

  var i = pos.i
  var j = pos.j

  if (isContained( {i:i,j:j+1},item,board)) arr.push( {i:i,j:j+1})
  if (isContained({i:i+1,j:j+1},item,board)) arr.push({i:i+1,j:j+1})
  if (isContained( {i:i-1,j:j+1},item,board)) arr.push( {i:i-1,j:j+1})
  if (isContained({i:i,j:j-1},item,board)) arr.push({i:i,j:j-1})
  if (isContained({i:i+1,j:j-1},item,board)) arr.push({i:i+1,j:j-1})
  if (isContained({i:i-1,j:j-1},item,board)) arr.push({i:i-1,j:j-1})
  if (isContained({i:i+1,j:j},item,board)) arr.push({i:i+1,j:j})
  if (isContained({i:i-1,j:j},item,board)) arr.push({i:i-1,j:j})

  return arr

}

function isEmptyCell(i,j,board = gBoard) {
  return board[i][j] === ''
}


function isContained(pos,item = '',board = gBoard) {
  return board[pos.i][pos.j] === item
}

function makeId(length = 6) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var txt = '';
  for (var i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}

function makeLorem(wordCount = 100) {
  const words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn'];
  var txt = '';
  while (wordCount > 0) {
      wordCount--;
      txt += words[Math.floor(Math.random() * words.length)] + ' ';
  }
  return txt;
}

