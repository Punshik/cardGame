const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1
});

class ExtendedSprite extends PIXI.Sprite {
    constructor(index, value,flag) {
        super();
        this.index = index;
        this.value = value;
        this.flag = flag;
    }
}

document.body.appendChild(app.view);

let wrapper = new PIXI.Container();
let currentScore, record, cardBack, buttonSprite, sheet;
let cardsArray= [], checkDuet = [];
let recordScore=0, score = 0, test = false;

const styleScore = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round'
});

const styleRecord = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#fff', '#EA9DC7'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round'
});

const styleTitle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 100,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#fff', '#EA9DC7'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 700,
    lineJoin: 'round'
});



// Добавляем все элементы на экран
function start() {
let row = 0;
let count = 0;

wrapper.x = app.screen.width / 2 - 64*4;
wrapper.y = app.screen.height / 2 - 64*2;
wrapper.visible = false

var background = new PIXI.Graphics();
background.beginFill(0x0039AC);
background.drawRect(0,0,window.innerWidth,window.innerHeight,null, true, true);


let buttonTextureStart = PIXI.Texture.from("button.png")
let buttonTexturePlayAgain = PIXI.Texture.from("button2.png")
buttonSprite = new PIXI.Sprite(buttonTextureStart)
buttonSprite.interactive = true;
buttonSprite.buttonMode = true;
buttonSprite.position.set(app.screen.width / 2 - 160, app.screen.height / 2 + 150)

buttonSprite.click = () => {
    begin()
    buttonSprite.visible = false;
    title.visible = false;
    buttonSprite.texture = buttonTexturePlayAgain;
}

app.stage.addChild(background)
app.stage.addChild(wrapper)
app.stage.addChild(buttonSprite);


for(let i=0; i< 16; i++) {
    count ++;
    let container = new ExtendedSprite(i,null, false);
    container.interactive = false;
    container.buttonMode = true;

    container.click = data => {
       test = !test;
       container.texture = cardsArray[data.target.index]
       Dual(data)
       }

       container.x = count*64;
       container.y = row * 64;
       container.width = 64;
       container.height = 64;
       container.scale = 1.5
    
       if(count === 4) {
        row++;
        count = 0;
    }
       wrapper.addChild(container);
    }


    currentScore = new PIXI.Text(`Ваш счет   ${score}`, styleScore);
    currentScore.x = app.screen.width / 2 - 180;
    currentScore.y = 220;
    currentScore.visible = false;

    record = new PIXI.Text(`Рекорд ${recordScore}`, styleRecord);  
    record.x = app.screen.width / 2 - 155;
    record.y = 50;
    record.visible = false;

    title = new PIXI.Text(`Memory card`, styleTitle);  
    title.x = app.screen.width / 2 - 350;
    title.y = app.screen.height / 2 - 150;
    title.visible = true;
    
    app.stage.addChild(currentScore);
    app.stage.addChild(title);
    app.stage.addChild(record);
    
    PIXI.Loader.shared
    .add("/atlas.json")
    .load(setup)

function setup() {
       sheet = PIXI.Loader.shared.resources["/atlas.json"].spritesheet;
       let subName = ["07","08","09","10","J","Q","K","A","back"];
       let check = 0;

       cardBack = sheet.textures["card_back.png"]
    
       for(let i = 0 ; i < 16 ; i++){
            cardsArray.push(sheet.textures[`card_${subName[check]}.png`])
            check === 7 ? check=0 : check++   
       }    
}

}

// Перемешиваем массив с нашими картами
let shuffle = array => {
    array.sort(() => Math.random() - 0.5);
}

// Функция сравнения двух карт
let Dual = data => {
    let check = true;
    if(!data.target.flag){
    checkDuet.push(data.target)
    }

    if(checkDuet.length === 2){
        if(checkDuet[0].index != checkDuet[1].index){
            if(checkDuet[0].value === checkDuet[1].value ){
                wrapper.children[checkDuet[0].index].flag = true;
                wrapper.children[checkDuet[1].index].flag = true;
                score += 100;
            } else {
                score -= 10
                window.setTimeout(()=>{
                    wrapper.children[checkDuet[0].index].texture = cardBack;
                    wrapper.children[checkDuet[1].index].texture = cardBack;
                },100)
            }
        }
        window.setTimeout(() => {checkDuet.splice(0,checkDuet.length)}, 200)
    }
    currentScore.text = `Ваш счет   ${score}`
    
    for(let i = 0 ; i < 16 ; i++){
        if(!wrapper.children[i].flag){
            check = false
            break;
        }
    }

    if(check){
        recordScore < score ? recordScore=score : recordScore;
        record.text = `Рекорд ${recordScore}`
        score = 0
        buttonSprite.visible = true;
        for(let i=0; i< 16; i++){
            wrapper.children[i].interactive = false;
        }
    }
   }

// Функция старта игры
let begin = () => {
    wrapper.visible = true;
    record.visible = true;
    currentScore.visible = true;
    score = 0;
    currentScore.text = `Ваш счет   ${score}`

    shuffle(cardsArray)

    for(let i = 0 ; i < 16 ; i++){
        wrapper.children[i].flag = false;
    }

    for(let i=0; i< 16; i++){
     wrapper.children[i].texture = cardsArray[i]
     wrapper.children[i].value = cardsArray[i].textureCacheIds;
   }

   window.setTimeout(() => {
    for(let i=0; i< 16; i++){
        wrapper.children[i].texture = cardBack;
        wrapper.children[i].interactive = true;
       
    }
},5000)
}


start()














