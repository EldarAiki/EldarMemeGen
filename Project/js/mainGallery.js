"use strict";

const gImgArray = [
  {
    src: "meme-imgs (various aspect ratios)/2.jpg",
    tags: ["woman"],
  },
  {
    src: "meme-imgs (various aspect ratios)/003.jpg",
    tags: ["man", "funny", 'awkward'],
  },
  {
    src: "meme-imgs (various aspect ratios)/004.jpg",
    tags: ["cute", "animal"],
  },
  {
    src: "meme-imgs (various aspect ratios)/005.jpg",
    tags: ["cute", "animal"],
  },
  {
    src: "meme-imgs (various aspect ratios)/5.jpg",
    tags: ["funny", "cute"],
  },
  {
    src: "meme-imgs (various aspect ratios)/006.jpg",
    tags: ["cute", "animal"],
  },
  {
    src: "meme-imgs (various aspect ratios)/8.jpg",
    tags: ["funny"],
  },
  {
    src: "meme-imgs (various aspect ratios)/9.jpg",
    tags: ["cute", "funny"],
  },
  {
    src: "meme-imgs (various aspect ratios)/12.jpg",
    tags: ["man"],
  },
];

const gTags = [
  { tag: "cute", inc: 0 },
  { tag: "funny", inc: 0 },
  { tag: "awkward", inc: 0 },
  { tag: "man", inc: 0 },
  { tag: "woman", inc: 0 },
];

function renderImages(imgArr = gImgArray) {
  const elGalley = document.querySelector(".pic-gallery");
  var gallery = imgArr.map(
    (img) =>
      `<img class="img-box" src="${img.src}" alt="" onclick="selectImage('${img.src}')">`
  );
  elGalley.innerHTML = gallery.join("");
}

function selectImage(imgSrc) {
  const elGalley = document.querySelector(".entry-gallery");
  elGalley.style.display = "none";
  const elGal = document.querySelector('.meme-gallery-present')
    elGal.style.display = 'none'
  const elEditor = document.querySelector(".editor-main");
  elEditor.style.display = "flex";
  setCanvas(imgSrc);
}

function incTag(tag) {

  var ind = gTags.findIndex((ta) => ta.tag === tag);
  if (gTags[ind].inc === 0) gTags[ind].inc = 16
  gTags[ind].inc += 2;
  const elTag = document.querySelector(`.${tag}`);
  elTag.style.fontSize = gTags[ind].inc + "px";
}

function renderTags() {
  const elTags = document.querySelector(".tag-list");
  var tags = gTags.map(
    (tag) =>
      `<li class="${tag.tag}" onclick="incTag('${tag.tag}')">${tag.tag}</li>`
  );
  elTags.innerHTML = tags.join("");
}

function filterTags(val) {
    console.log('filtering');
  var filteredImgs = gImgArray.filter((img) => img.tags.includes(val))
  if (filteredImgs.length > 0) renderImages(filteredImgs)
  else renderImages( gImgArray)
}
