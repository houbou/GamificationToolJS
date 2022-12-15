
var canvas, g;
var wrapper;
var gWidth, gHeight;

var gameCount;

var stage;

var gelCount;
var gelFlag_1, gelFlag_2, gelFlag_3;
var bombFlag;

var clearFlag;

var cyclePase;

var menuPosY;
var menuArrowAlpha;

var menuItemPositionX, propertyPositionX;
var focusItem;
var itemList, previewItemList;
var itemHistory, propertyHistory;

var branchList;
var branchFlag;
var branchFocusItem;
var itemTMP;
var isItemExec;
var branchHistory;

var isLoop;

var focusProperty;
var propertyList;

var menuFrame, menuFrameList;

var leftArrow, rightArrow;
var navigationGel;

var cat;
var gel, gel2, gel3, gel4;
var bomb;
var enemy, enemy2, enemy3, enemy4;

var guide, guide2;
var dummyCat;

const Scenes = {
  Stage1: "Stage1",
  Stage2: "Stage2",
  Stage3: "Stage3",
  Stage4: "Stage4",
  Stage5: "Stage5",
}

class TextBox {
  text = "unlocked";
  strokeColor = "#00EE00";
  strokeWidth = 5;
  fillColor = "#0000EE";
  fontSize = 36;
  fontColor = "#EE0000";
  alpha = 1.0;
  positionX = 0;
  positionY = 0;
  width = 0;
  height = 0;

  constructor(text, strokeColor, strokeWidth, fillColor, fontSize, fontColor, alpha, x, y, w, h) {
    this.text = text;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.fillColor = fillColor;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.alpha = alpha;
    this.positionX = x;
    this.positionY = y;
    this.width = w;
    this.height = h;
  }

  update() {}

  draw(g) {
    myDrawStrokeRectangle(this.positionX, this.positionY, this.width, this.height, 5, myRGBA(this.strokeColor, this.alpha), this.strokeWidth);
    myDrawFillRectangle(this.positionX, this.positionY, this.width, this.height, 5, myRGBA(this.fillColor, this.alpha));

    myDrawText(this.text, this.fontSize, 'center', 'center', -(gWidth/2-(this.positionX+this.width/2)), -(gHeight/2-(this.positionY+this.height/2)), 'bold', 'x12y16pxMaruMonica', myRGBA("#777", this.alpha), myRGBA(this.fontColor, this.alpha), 5, "round");

    // console.log("aaa");
  }
}

// 座標で計算する
class GraphicData {
  image = null;
  positionX = 0;
  positionY = 0;
  isDraw = true;

  constructor(imagePath, x, y) {
    this.image = new Image();
    this.image.src = imagePath;
    this.positionX = x;
    this.positionY = y;
  }

  draw(g) {
    if (this.isDraw) {
      g.drawImage(this.image, this.positionX * 128 + 182, -(this.positionY) * 128 + 295);
    }
  }
  
  drawIMG(g) {
    g.drawImage(this.image, this.positionX, this.positionY);
  }
}

onload = function () {

  // 描画コンテキストの取得
  canvas = document.getElementById("gamecanvas");
  g = canvas.getContext("2d");
  // 初期化
  init();
  // 入力処理の指定
  document.onkeydown = keydown;
  document.onkeyup = keyup;

  // ゲームループの設定 60FPS
  setInterval("gameloop()", 16);
};

function init() {
  gWidth = canvas.width; // 1200
  gHeight = canvas.height; // 700

  stage = Scenes.Stage1;

  isReturned = false;
  gelFlag_1 = false;
  gelFlag_2 = false;
  gelFlag_3 = false;
  bombFlag = false;
  gelCount = 1;

  gameCount = 0;

  clearFlag = false;

  cyclePase = 0;

  menuPosY = 750;
  menuArrowAlpha = 0;
  menuItemPositionX = 124;
  propertyPositionX = 118;

  menuFrameList = [];
  // menuFrame = new TextBox("", "#EEE", 5, "#404040", 0, "", 1.0, 84, 9999, 1112, 220);
  myDrawStrokeRectangle(84, menuPosY, 1112, 220, 5, myRGBA("#EEE", 1.0), 5); // wide frame
  myDrawFillRectangle(84, menuPosY, 1112, 220, 5, "#404040", 3);

  focusItem = 0;
  itemList = [
    "++",
    "--",
    "= 500",
    "= 270",
    "+= 2",
    "get",
    "return",
  ];
  focusProperty = 0;
  propertyList = [
    "cat.positionX",
    "cat.positionY",
  ];
  itemHistory = [];
  propertyHistory = [];

  branchFlag = false;

  branchList = [];
  var data = new GraphicData("./images/jewel1l-4.png", 613, 470);
  branchList.push(data);
  data = new GraphicData("./images/none.png", 675, 470);
  branchList.push(data);
  data = new GraphicData("./images/bomb2.png", 551, 470);
  branchList.push(data);
  branchFocusItem = 1;
  isItemExec = true;
  branchHistory = [];

  isLoop = false;

  leftArrow = new GraphicData("./images/leftArrow.png", 510, 478);
  rightArrow = new GraphicData("./images/rightArrow.png", 736, 478);
  navigationGel = new GraphicData("./images/jewel1l-4.png", 586, 58);

  guide = new GraphicData("./images/guide.png", 937, 0);
  guide2 = new GraphicData("./images/guide2.png", 937, 0);
  dummyCat = new GraphicData("./images/pipo-charachip010_08.png", 6, 2);

  cat = new GraphicData("./images/pipo-charachip010_08.png", 0, 0);
  gel  = new GraphicData("./images/jewel1l-3.png", 6, 0);
  gel2 = new GraphicData("./images/jewel1l-3.png", 2, 0);
  gel3 = new GraphicData("./images/jewel1l-3.png", 4, 0);
  // gel4 = new GraphicData("./images/jewel1l-3.png", 6, 0);
  bomb = new GraphicData("./images/bomb.png", 4, 0);
  enemy = new GraphicData("./images/enemy.png", 1, 0);
  enemy2 = new GraphicData("./images/enemy.png", 3, 0);
  enemy3 = new GraphicData("./images/enemy.png", 5, 0);
  enemy4 = new GraphicData("./images/enemy.png", 7, 0);

  gel.isDraw = true;
  gel2.isDraw = false;
  gel3.isDraw = false;
  bomb.isDraw = false;

  guide.isDraw = false;
  guide2.isDraw = false;
  dummyCat.isDraw = false;

  // cat.image = new Image();
  // cat.image.src = "./images/pipo-charachip010_08.png";

}


var isKeyDownI = false;
var isMenuUp = false;
var isMenuDown = false;
var isMenuRight = false;
var isMenuLeft = false;
var isReturned = false;
var isPositionDrawing = false;

function keydown(e) {
  if (e.code == 'KeyI'){
    console.log(menuPosY);
    if (menuPosY == 750) {
      isMenuUp = true;
      isKeyDownI = true;
    }
    else if (menuPosY == 500) {
      isMenuDown = true;
      isKeyDownI = true;
    }
    // }
    // else {
    //   isKeyDownI = false;
    // }
  }

  if (menuPosY == 500) {

    if (e.code == 'KeyL') {
      if (branchFlag) {
        if (branchFocusItem < 2) {
          branchFocusItem ++;
        }
      }
      else {
        focusItem ++;
      }
    }
    if (e.code == 'KeyH') {
      if (branchFlag) {
        if (branchFocusItem > 0) {
          branchFocusItem --;
        }
      }
      else {
        focusItem --;
      }
    }
    if (e.code == 'KeyJ') {
      if (focusProperty <= 0){
        focusProperty = propertyList.length -1;
      }
      else {
        focusProperty --;
      }
    }
    if (e.code == 'KeyK') {
      if (focusProperty >= propertyList.length -1){
        focusProperty = 0;
      }
      else {
        focusProperty ++;
      }
    }
    if (e.code == 'KeyX') {
      init();
    }
    if (e.code == 'KeyV') {
      isPositionDrawing = true;
    }
    if (e.code == 'KeyE') {
      itemHistory = [];
    }
    if (e.code == 'KeyR') {
      branchHistory.forEach((e)=> {
        console.log(e);
      });

      itemHistory.forEach((data, i) => {
        update();

        if (branchHistory[i] != -1) {
          switch (branchHistory[i]) {
            case 1:
              if (gelFlag_1 || gelFlag_2 || gelFlag_3) {
                isItemExec = true;
              }
              else {
                isItemExec = false;
              }
              break;

            case 0:
              if (bombFlag) {
                isItemExec = true;
              }
              else {
                isItemExec = false;
              }
              break;

            case 2:
              if (gelFlag_1 || gelFlag_2 || gelFlag_3 || bombFlag) {
                isItemExec = false;
              }
              else {
                isItemExec = true;
              }
              break;

            default:
              isItemExec = true;
              break;

          }
        }
        if (isItemExec) {
          switch (data) {
            case 0:
              if (propertyList[focusProperty] == "cat.positionX") {
                cat.positionX ++;
              }
              else if (propertyList[focusProperty] == "cat.positionY") {
                cat.positionY --;
              }
              break;
  
            case 1:
              if (propertyList[focusProperty] == "cat.positionX") {
                cat.positionX --;
              }
              else if (propertyList[focusProperty] == "cat.positionY") {
                cat.positionY ++;
              }
              break;
  
            case 2:
              if (propertyList[focusProperty] == "cat.positionX") {
                cat.positionX = 500;
              }
              else if (propertyList[focusProperty] == "cat.positionY") {
                cat.positionY = 500;
              }
              break;
  
            case 3:
              if (propertyList[focusProperty] == "cat.positionX") {
                cat.positionX = 270;
              }
              else if (propertyList[focusProperty] == "cat.positionY") {
                cat.positionY = 270;
              }
              break;
  
            case 4:
              if (propertyList[focusProperty] == "cat.positionX") {
                cat.positionX += 2;
              }
              else if (propertyList[focusProperty] == "cat.positionY") {
                cat.positionY += 2;
              }
              break;
  
            case 5:
              if (gelFlag_1 && gel.isDraw) {
                gel.isDraw = false;
                gelCount--;
                console.log(cat.positionX);
                console.log(gel.positionX);
              }
              else if (gelFlag_2 && gel2.isDraw) {
                gel2.isDraw = false;
                gelCount--;
              }
              else if (gelFlag_3 && gel3.isDraw) {
                gel3.isDraw = false;
                gelCount--;
              }
              else if (bombFlag) {
                cat.positionX = 0;
                cat.positionY = 0;
                gel.isDraw = true;
                gel2.isDraw = true;
                gelCount = 2;
              }
              else {
              }
              break;
  
            case 6:
              if (clearFlag) {
                isReturned = true;
              }
              break;
  
            default:
              break;
          }
        }
        else {
          console.log(cat.positionX);
        }
      });
      isItemExec = true;
    }
    if (e.code == 'KeyB') {
      if (branchFlag) {
        branchFlag = false;
      }
      else {
        branchFlag = true;
      }
    }
    if (e.code == 'Enter') {

      console.log(branchFlag);

      if (branchFlag) {
        branchHistory.push(branchFocusItem);
        switch(branchFocusItem) {
          case 1:
            if (gelFlag_1 || gelFlag_2 || gelFlag_3) {
              isItemExec = true;
            }
            else {
              isItemExec = false;
            }
            break;

          case 0:
            if (bombFlag) {
              isItemExec = true;
            }
            else {
              isItemExec = false;
            }
            break;

          case 2:
            if (gelFlag_1 || gelFlag_2 || gelFlag_3 || bombFlag) {
              isItemExec = false;
              console.log("bbb");
            }
            else {
              isItemExec = true;
              console.log("ccc");
            }
            break;
  
          default:
            isItemExec = false;
            break;
        }
      }
      else {
        branchHistory.push(-1);
      }


      let itemIndex;

      if (isItemExec) {

        if (focusItem%itemList.length == 0) { // "++"
          if (propertyList[focusProperty] == "cat.positionX") {
            cat.positionX ++;
          }
          else if (propertyList[focusProperty] == "cat.positionY") {
            cat.positionY --;
          }
  
          itemIndex = 0;
        }
        else if (focusItem%itemList.length == 1 || focusItem%itemList.length == 1 -itemList.length) { // "--"
          if (propertyList[focusProperty] == "cat.positionX") {
            cat.positionX --;
          }
          else if (propertyList[focusProperty] == "cat.positionY") {
            cat.positionY ++;
          }
  
          itemIndex = 1;
        }
        else if (focusItem%itemList.length == 2 || focusItem%itemList.length == 2 -itemList.length) { // "= 500"
          if (propertyList[focusProperty] == "cat.positionX") {
            cat.positionX = 500;
          }
          else if (propertyList[focusProperty] == "cat.positionY") {
            cat.positionY = 500;
          }
  
          itemIndex = 2;
        }
        else if (focusItem%itemList.length == 3 || focusItem%itemList.length == 3 -itemList.length) { // "= 270"
          if (propertyList[focusProperty] == "cat.positionX") {
            cat.positionX = 270;
          }
          else if (propertyList[focusProperty] == "cat.positionY") {
            cat.positionY = 270;
          }
  
          itemIndex = 3;
        }
        else if (focusItem%itemList.length == 4 || focusItem%itemList.length == 4 -itemList.length) { // "+= 2"
          if (propertyList[focusProperty] == "cat.positionX") {
            cat.positionX += 2;
          }
          else if (propertyList[focusProperty] == "cat.positionY") {
            cat.positionY += 2;
          }
  
          itemIndex = 4;
        }
        else if (focusItem%itemList.length == 5 || focusItem%itemList.length == 5 -itemList.length) { // "get"
          if (gelFlag_1 && gel.isDraw) {
            gel.isDraw = false;
            gelCount--;
            console.log(cat.positionX);
            console.log(gel.positionX);
          }
          else if (gelFlag_2 && gel2.isDraw) {
            gel2.isDraw = false;
            gelCount--;
          }
          else if (gelFlag_3 && gel3.isDraw) {
            gel3.isDraw = false;
            gelCount--;
          }
          else if (bombFlag) {
            cat.positionX = 0;
            cat.positionY = 0;
            gel.isDraw = true;
            gel2.isDraw = true;
            gelCount = 2;
          }
  
          itemIndex = 5;
        }
        else if (focusItem%itemList.length == 6 || focusItem%itemList.length == 6 -itemList.length) { // "return"
          if (clearFlag) {
            isReturned = true;
          }
  
          itemIndex = 6;
        }
  
        if (propertyList[focusProperty] == "cat.positionX"){
          if (propertyHistory.length >= 8) {
            propertyHistory.shift();
          }
          propertyHistory.push(0);
        }
        else if (propertyList[focusProperty] == "cat.positionY") {
          if (propertyHistory.length >= 8) {
            propertyHistory.shift();
          }
          propertyHistory.push(1);
        }
        if (itemHistory.length >= 8) {
          itemHistory.shift();
        }
        itemHistory.push(itemIndex);

      }  
      
      isItemExec = true;

    }

  }
}

function keyup(e) {}

function gameloop() {
  update();
  draw();
}

function update() {

  if (gelCount <= 0) {
    clearFlag = true;
  }
  else {
    clearFlag = false;
  }

  if (cat.positionX == gel.positionX && cat.positionY == gel.positionY && gel.isDraw) {
    gelFlag_1 = true;
  }
  else {
    gelFlag_1 = false;
  }

  if (cat.positionX == gel2.positionX && cat.positionY == gel2.positionY && gel2.isDraw) {
    gelFlag_2 = true;
  }
  else {
    gelFlag_2 = false;
  }

  if (cat.positionX == gel3.positionX && cat.positionY == gel3.positionY && gel3.isDraw) {
    gelFlag_3 = true;
  }
  else {
    gelFlag_3 = false;
  }

  if (cat.positionX == bomb.positionX && cat.positionY == bomb.positionY && bomb.isDraw) {
    bombFlag = true;
  }
  else {
    bombFlag = false;
  }


  if (isMenuUp) {
    if (menuPosY > 500) {
      menuPosY -= 10;
      menuArrowAlpha += 0.04;
    }
    else {
      menuPosY = 500;
      menuArrowAlpha = 1.0;
      isMenuUp = false;
      isKeyDownI = false;
    }
  }

  if (isMenuDown) {
    if (menuPosY < 750) {
      menuPosY += 10;
      menuArrowAlpha -= 0.04;
    }
    else {
      menuPosY = 750;
      menuArrowAlpha = 0.0;
      isMenuDown = false;
      isKeyDownI = false;
    }
  }

  if (stage == Scenes.Stage4 || stage == Scenes.Stage5){
    if ((cat.positionX == enemy.positionX && cat.positionY == enemy.positionY)
    || (cat.positionX == enemy2.positionX && cat.positionY == enemy2.positionY)
    || (cat.positionX == enemy3.positionX && cat.positionY == enemy3.positionY)
    || (cat.positionX == enemy4.positionX && cat.positionY == enemy4.positionY)
    ){
      cat.positionX = 0;
      cat.positionY = 0;
    }
  }


  if (stage == Scenes.Stage1) {
    if (isReturned && clearFlag) {
      gameCount ++;
      if (gameCount >= 180) {
        init();
        stage = Scenes.Stage2;
        gel.isDraw = true;
        gel2.isDraw = false;
        gel3.isDraw = false;
        bomb.isDraw = false;
        guide.isDraw = false;
        guide2.isDraw = false;
        dummyCat.isDraw = false;
        cat.positionX = 0;
        cat.positionY = 0;
        gel.positionX = 6;
        gel.positionY = 2;
        gelCount = 1;

      }
    }
  }
  else if (stage == Scenes.Stage2) {
    if (isReturned && clearFlag) {
      gameCount ++;
      if (gameCount >= 180) {
        init();
        stage = Scenes.Stage3;
        gel.isDraw = true;
        gel2.isDraw = false;
        gel3.isDraw = false;
        bomb.isDraw = false;
        guide.isDraw = true;
        guide2.isDraw = false;
        dummyCat.isDraw = false;
        cat.positionX = 0;
        cat.positionY = 0;
        gel.positionX = 500;
        gel.positionY = 270;
        gelCount = 1;
      }
    }
  }
  else if (stage == Scenes.Stage3) {
    if (isReturned && clearFlag) {
      gameCount ++;
      if (gameCount >= 180) {
        init();
        stage = Scenes.Stage4;
        gel.isDraw = true;
        gel2.isDraw = true;
        gel3.isDraw = true;
        bomb.isDraw = false;
        guide.isDraw = false;
        guide2.isDraw = false;
        dummyCat.isDraw = false;
        cat.positionX = 0;
        cat.positionY = 0;
        gel.positionX = 6;
        gel.positionY = 0;
        gelCount = 3;
      }
    }
  }
  else if (stage == Scenes.Stage4) {
    if (isReturned && clearFlag) {
      gameCount ++;
      if (gameCount >= 180) {
        init();

        gel.isDraw = true;
        gel2.isDraw = true;
        gel3.isDraw = false;
        bomb.isDraw = true;
        guide.isDraw = false;
        guide2.isDraw = false;
        dummyCat.isDraw = false;
        stage = Scenes.Stage5;

        cat.positionX = 0;
        cat.positionY = 0;
        gel.positionX = 6;
        gel.positionY = 0;
        gelCount = 2;
      }
    }
  }
  else if (stage == Scenes.Stage5) {
    if (isReturned && clearFlag) {
      gameCount ++;
      if (gameCount >= 180) {
        init();
        stage = Scenes.Stage1;
        gel.isDraw = true;
        gel2.isDraw = false;
        gel3.isDraw = false;
        bomb.isDraw = false;
        guide.isDraw = false;
        guide2.isDraw = false;
        dummyCat.isDraw = false;
        cat.positionX = 0;
        cat.positionY = 0;
        gel.positionX = 6;
        gel.positionY = 0;
        gelCount = 1;
      }
    }
  }

  // cyclePase += 0.2;
  // if (cyclePase > 360){
  //   cyclePase = 0;
  // }


  // if (isKeyDownI) {
  //   if (test1 > 500)
  //   test1 -= 10;
  //   if (test1 < 500) {
  //     // test2 ++;
  //     test1 = 500;
  //     isKeyDownI = false;
  //   }
  //   // console.log(test1);
  // }
}

function draw() {
  // bg
  myDrawFillRectangle(0, 0, gWidth, gHeight, 12, "#333");


  // pickup message
  myDrawText('N A V I G A T I O N', 36, 'left', 'top', 30, 10, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  myDrawText('- H, L : menu scroll', 30, 'left', 'top', 30, 50, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  myDrawText('- J, K : property change', 30, 'left', 'top', 30, 50+35*1, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  myDrawText('- X : reset stage', 30, 'left', 'top', 30, 50+35*2, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  myDrawText('- E : reset history', 30, 'left', 'top', 30, 50+35*3, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  myDrawText('- R : repeat history', 30, 'left', 'top', 30, 50+35*4, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  myDrawText('- B : branch mode', 30, 'left', 'top', 30, 50+35*5, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  // myDrawText('- Z : redo', 30, 'left', 'top', 30, 50+35*6, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");

  myDrawText('H I S T O R Y', 36, 'right', 'top', -30, 10, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");

  myDrawText('M I S S I O N', 36, 'center', 'top', 0, 10, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");

  if (gelCount <= 0) {
    myDrawText('P R E S S   r e t u r n', 24, 'center', 'top', 0, 110, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  }
  else {
    myDrawText('C O L L E C T   G E L', 24, 'center', 'top', 0, 110, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  }
  myDrawText('×'+gelCount, 36, 'center', 'top', 30, 62, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  navigationGel.drawIMG(g);

  // inventory menu (off)
  myDrawText('I : OPEN MENU', 48, 'center', 'center', 0, 300, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");

  // history
  itemHistory.forEach((data, i) => {
    let item;
    switch(data) {
      case 0:
        item = '++';
        break;

      case 1:
        item = '--';
        break;

      case 2:
        item = '= 500';
        break;

      case 3:
        item = '= 270';
        break;

      case 4:
        item = '+= 2';
        break;

      case 5:
        item = 'get';
        break;

      case 6:
        item = 'return';
        break;

      default:
        break;
    }

    if (propertyHistory[i] == 0) {
      myDrawText('X : '+item, 36, 'right', 'top', -30, 50+i*40, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    }
    else if (propertyHistory[i] == 1) {
      myDrawText('Y : '+item, 36, 'right', 'top', -30, 50+i*40, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    }
  });


  // inventory menu(on)
  drawInventoryMenu();

  if (stage == Scenes.Stage1) {
    // stage component
    gel.draw(g);
    cat.draw(g);
    myDrawFillRectangle(182, 429, 917, 5, 3, "#EEE");

    // clear message
    if (isReturned && clearFlag) {
      myDrawText('GOOD JOB!', 60, 'center', 'center', 0, 0, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    }

  }
  else if (stage == Scenes.Stage2) {
    // stage component
    gel.draw(g);
    cat.draw(g);
    myDrawFillRectangle(182, 429, 917, 5, 3, "#EEE");

    // clear message
    if (isReturned && clearFlag) {
      myDrawText('GOOD JOB!', 60, 'center', 'center', 0, 0, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    }

  }
  else if (stage == Scenes.Stage3) {
    // stage component
    gel.draw(g);
    
    if (cat.positionX == 500 && cat.positionY == 270) {
      if (gelCount == 0) {
        guide.isDraw = false;
        guide2.isDraw = true;
        guide2.drawIMG(g);
      }
      else {
        guide.drawIMG(g);
      }

      dummyCat.isDraw = true;
      dummyCat.draw(g);
    }
    else {
      cat.draw(g);
      guide.drawIMG(g);
    }

    myDrawFillRectangle(182, 429, 917, 5, 3, "#EEE");

    // clear message
    if (isReturned && clearFlag) {
      myDrawText('GOOD JOB!', 60, 'center', 'center', 0, 0, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    }

  }
  else if (stage == Scenes.Stage4) {
    // stage component
    gel.draw(g);
    gel2.draw(g);
    gel3.draw(g);
    enemy.draw(g);
    enemy2.draw(g);
    enemy3.draw(g);
    enemy4.draw(g);
    cat.draw(g);
    myDrawFillRectangle(182, 429, 917, 5, 3, "#EEE");

    // clear message
    if (isReturned && clearFlag) {
      myDrawText('GOOD JOB!', 60, 'center', 'center', 0, 0, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    }

  }
  else if (stage == Scenes.Stage5) {
    // stage component
    gel.draw(g);
    bomb.draw(g);
    gel2.draw(g);
    enemy.draw(g);
    enemy2.draw(g);
    enemy3.draw(g);
    enemy4.draw(g);
    cat.draw(g);
    myDrawFillRectangle(182, 429, 917, 5, 3, "#EEE");

    // clear message
    if (isReturned && clearFlag) {
      myDrawText('GOOD JOB!', 60, 'center', 'center', 0, 0, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
    }

  }



}

function drawInventoryMenu() {

  myDrawStrokeRectangle(84, menuPosY, 1112, 220, 5, myRGBA("#EEE", 1.0), 5); // wide frame
  myDrawFillRectangle(84, menuPosY, 1112, 220, 5, "#404040", 3);

  // item list
  let i, counter;
  let i_inv;
  for (i = focusItem-2, counter = 0; i <= focusItem+2; i++, counter++) {
    let diff = (180+33)*counter;
    let itemCenterX = menuItemPositionX+diff+180/2;

    // itemListの範囲を超えたらループ
    if (i < 0) { // 正方向
      i_inv = (itemList.length - 1) + (i+1) % itemList.length;
    }
    else { // 負方向
      i_inv = i % itemList.length;
    }

    if (i == focusItem) {
      myDrawStrokeRectangle(menuItemPositionX+diff-5, menuPosY+20-5, 190, 190, 5, "#CCC", 10); // item frame
      myDrawFillRectangle(menuItemPositionX+diff-5, menuPosY+20-5, 190, 190, 5, "#555", 3);
      myDrawText(itemList[i_inv], 36, 'center', 'top', -(gWidth/2-itemCenterX), menuPosY+92, 'bold', 'x12y16pxMaruMonica', "#777", myRGBA("#EEE", 1.0), 5, "round");
    }
    else {
      myDrawStrokeRectangle(menuItemPositionX+diff, menuPosY+20, 180, 180, 5, myRGBA("#CCC", 0.5), 3); // item frame
      myDrawFillRectangle(menuItemPositionX+diff, menuPosY+20, 180, 180, 5, myRGBA("#555", 0.5), 3);
      myDrawText(itemList[i_inv], 36, 'center', 'top', -(gWidth/2-itemCenterX), menuPosY+92, 'bold', 'x12y16pxMaruMonica', "#777", myRGBA("#EEE", 0.5), 5, "round");
    }

    // myDrawText(itemList[i], 36, 'center', 'top', 135+diff, menuPosY+92, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");
  }

  // property box
  let propertyBox = new TextBox(propertyList[focusProperty], "#CCC", 10, "#555", 36, "#EEE", 1.0, 118, menuPosY-43, 199, 51);
  propertyBox.draw(g);

  // branch menu
  if (branchFlag) {
    myDrawStrokeRectangle(532, 465, 216, 67, 5, myRGBA("#EEE", 1.0), 5); // wide frame
    myDrawFillRectangle(532, 465, 216, 67, 5, "#404040", 3);
    branchList[0].drawIMG(g);
    branchList[1].drawIMG(g);
    branchList[2].drawIMG(g);
    myDrawStrokeRectangle(551+62*branchFocusItem, 470, 55, 55, 5, myRGBA("#EEE", 1.0), 3); // wide frame
    myDrawText('BRANCH MENU', 24, 'center', 'top', 0, 440, 'bold', 'x12y16pxMaruMonica', "#777", "#EEE", 5, "round");

    leftArrow.drawIMG(g);
    rightArrow.drawIMG(g);
  }

  g.strokeStyle = myRGBA("#EEE", menuArrowAlpha);
  g.fillStyle = myRGBA("#CCC", menuArrowAlpha);
  g.lineWidth = 2;

  // left navigation triangle
  g.beginPath();
  g.moveTo(66, 611);
  g.lineTo(95, 595);
  g.lineTo(95, 627);
  g.closePath();
  g.stroke();
  g.fill();

  // right navigation triangle
  g.beginPath();
  g.moveTo(1185, 595);
  g.lineTo(1185, 627);
  g.lineTo(1213, 611);
  g.closePath();
  g.stroke();
  g.fill();

  // myDrawStrokeRectangle(propertyPositionX, 457, 199, 51, 5, myRGBA("#EEE", 1.0), 5);
  // myDrawFillRectangle(propertyPositionX, 457, 199, 51, 5, "#404040", 3);

  // let propertyBoxCenter = propertyPositionX + 199/2;
  // myDrawText("cat.positionX", 36, 'center', 'top', -(gWidth/2-propertyBoxCenter), 457, 'bold', 'x12y16pxMaruMonica', "#777", myRGBA("#EEE", 1.0), 5, "round");


}

function myDrawText(text, fontSize, alignX, alignY, marginX, marginY, fontStyle, fontFamily, strokeColor, fillColor, width, join) {
  myStrokeText(text, fontSize, alignX, alignY, marginX, marginY, fontStyle, fontFamily, strokeColor, width, join);
  myFillText(text, fontSize, alignX, alignY, marginX, marginY, fontStyle, fontFamily, fillColor);
}

function myStrokeText(text, fontSize, alignX, alignY, marginX, marginY, fontStyle, fontFamily, strokeColor, width, join) {
  g.font = (
    fontStyle ? fontStyle : 'normal') + ' ' +
    fontSize + 'px ' +
    (fontFamily ? fontFamily : 'sans-serif');

  g.strokeStyle = strokeColor;

  g.lineWidth = width;
  g.lineJoin = join;

  g.strokeText(
    text,
    alignX === 'center' ?
      (gWidth - g.measureText(text).width) / 2 + marginX:
      alignX === 'right' ?
        gWidth - g.measureText(text).width + marginX:
        alignX && alignX !== 'left' ? alignX : marginX,
    alignY === 'center' ?
      (gHeight + fontSize / 2) / 2 + marginY:
      alignY === 'bottom' ?
          gHeight - fontSize / 4 + marginY:
          alignY && alignY !== 'top' ? alignY : fontSize + marginY
  );
}

function myFillText(text, fontSize, alignX, alignY, marginX, marginY, fontStyle, fontFamily, fillColor) {
  g.font = (
    fontStyle ? fontStyle : 'normal') + ' ' +
    fontSize + 'px ' +
    (fontFamily ? fontFamily : 'sans-serif');

  g.fillStyle = fillColor;

  g.fillText(
    text,
    alignX === 'center' ?
      (gWidth - g.measureText(text).width) / 2 + marginX:
      alignX === 'right' ?
        gWidth - g.measureText(text).width + marginX:
        alignX && alignX !== 'left' ? alignX : marginX,
    alignY === 'center' ?
      (gHeight + fontSize / 2) / 2 + marginY:
      alignY === 'bottom' ?
          gHeight - fontSize / 4 + marginY:
          alignY && alignY !== 'top' ? alignY : fontSize + marginY
  );
}

function myDrawStrokeRectangle(x,y,w,h,r,color,strokeWidth) {
  g.beginPath();
  g.lineWidth = strokeWidth;
  g.strokeStyle = color;
  // g.fillStyle = color;
  g.moveTo(x,y + r);
  g.arc(x+r,y+h-r,r,Math.PI,Math.PI*0.5,true);
  g.arc(x+w-r,y+h-r,r,Math.PI*0.5,0,1);
  g.arc(x+w-r,y+r,r,0,Math.PI*1.5,1);
  g.arc(x+r,y+r,r,Math.PI*1.5,Math.PI,1);
  g.closePath();
  g.stroke();
  // g.fill();
}

function myDrawFillRectangle(x,y,w,h,r,color) {
  g.beginPath();
  g.lineWidth = 1;
  // g.strokeStyle = color;
  g.fillStyle = color;
  g.moveTo(x,y + r);
  g.arc(x+r,y+h-r,r,Math.PI,Math.PI*0.5,true);
  g.arc(x+w-r,y+h-r,r,Math.PI*0.5,0,1);
  g.arc(x+w-r,y+r,r,0,Math.PI*1.5,1);
  g.arc(x+r,y+r,r,Math.PI*1.5,Math.PI,1);
  g.closePath();
  // g.stroke();
  g.fill();
}

// function myDrawFillCircle(){
//   g.beginPath();
//   g.arc(500, 60, 40, 0, Math.PI * 2, true);
//   g.fillStyle = "#EEE";
//   g.fill();
// }

function myRGBA (rgb, a) {
  let r, g, b;

  // #40 → #404040
  if (rgb.length == 3) {
    r = parseInt(rgb.substr(1, 2), 16).toString(10);
    g = parseInt(rgb.substr(1, 2), 16).toString(10);
    b = parseInt(rgb.substr(1, 2), 16).toString(10);
  }
  // #EEE → #EEEEEE
  else if (rgb.length == 4) {
    r = parseInt(rgb.substr(1, 1) + rgb.substr(1, 1), 16).toString(10);
    g = parseInt(rgb.substr(2, 1) + rgb.substr(2, 1), 16).toString(10);
    b = parseInt(rgb.substr(3, 1) + rgb.substr(3, 1), 16).toString(10);
  }

  else {
    r = parseInt(rgb.substr(1, 2), 16).toString(10);
    g = parseInt(rgb.substr(3, 2), 16).toString(10);
    b = parseInt(rgb.substr(5, 2), 16).toString(10);
  }

  return "rgba(" + r + "," + g + "," + b + "," + a.toString(10) + ")";
}
