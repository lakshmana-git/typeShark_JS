const words = 'typing games are interactive software applications designed to improve typing skills while making the learning process engaging and entertaining. These games typically present players with various challenges, such as typing words, sentences, or paragraphs within a time limit. The games often include features like accuracy tracking, speed measurement, and progression levels, motivating players to enhance their typing proficiency. By combining the practice of typing with elements of fun and competition, typing games have become a popular way for people of all ages to develop and refine their typing abilities while enjoying the process'.split(' ');



let wordCount = words.length;


const gameTime = 30 * 1000
window.timer = null;


window.gameStart = null

function addClass(element,name){
    element.className += ' '+name
}
function removeClass(element,name){
    element.className = element.className.replace(name,'')
}

function formatWord(word){
    let main = document.createElement("div")
    main.className = "word"
 
    
   
    for(let i=0;i<word.length;i++){
        let letterSpan = document.createElement("span")
        letterSpan.className= 'letter'
        letterSpan.textContent = word[i]
        main.appendChild(letterSpan)
        
    }
   
 
    return main
}



//adding words to screen
function newGame() {
    document.getElementById('words').innerHTML = ''; 
    for (let i = 0; i < words.length; i++) {
        const random = Math.floor(Math.random() * words.length);
        let x = formatWord(words[random]) 
        document.getElementById('words').appendChild(x) 
    }

    addClass(document.querySelector('.word'),'current')
    addClass(document.querySelector('.letter'),'current')
    document.getElementById('info').innerHTML = (gameTime/1000)+""
    window.timer = null;
}
function getWpm(){
    const words = [...document.querySelectorAll('.word')]
    const lastType = document.querySelector('.word.current')
    const lastIndex = words.indexOf(lastType)
    const typeWords = words.slice(0,lastIndex)
    const correctWords = typeWords.filter(word=>{
        const letters = [...word.children]
        const incorrectletters = letters.filter(letter=>letter.className.includes('incorrect'))
        const correctlettters = letters.filter(letter=>letter.className.includes('correct'))
        return incorrectletters.length ===0 && correctlettters.length===letters.length

    })
   
    return correctWords.length / gameTime *60000
}
function gameOver(){
    clearInterval(window.timer)

    addClass(document.getElementById('game'),'over')
    const result = getWpm();
    document.getElementById('info').innerHTML = `WPN ${result}`
}



document.getElementById('game').addEventListener('keyup',(event)=>{
       const key = event.key;
       const currentWord = document.querySelector('.word.current')

       const currentletter = document.querySelector('.letter.current')

       const expected = currentletter?.innerHTML ||' '; 

       const isLetter = key.length ===1 &&key !== ' ';
       const isSpace = key === ' '
       const isBackSpace = key === 'Backspace'
       const isFirstLetter = currentletter ===currentWord.firstChild
       if(document.querySelector('#game.over')){
             return;
       }
       console.log({key,expected})

       if(!window.timer && isLetter){
         window.timer = setInterval(()=>{
                   if(!window.gameStart){
                     window.gameStart = (new Date()).getTime();
                   }
                   const currentTime  = (new Date()).getTime()
                   const msPassed = currentTime - window.gameStart
                   const sPassed = Math.round(msPassed/1000)
                   const secLeft = (gameTime/1000)- sPassed
                   if(secLeft<=0){
                      gameOver();
                      return;
                   }
                   document.getElementById('info').innerHTML = secLeft + ''
         },1000)
         
       }

       if(isLetter){
          if(currentletter){
            
             addClass(currentletter,key===expected?"correct":"incorrect")
             removeClass(currentletter,'current')
             if(currentletter.nextSibling){
                addClass(currentletter.nextSibling,'current')
             }
          }else{
            const incorrectLetter = document.createElement('span')
            incorrectLetter.innerHTML = key
            incorrectLetter.className = 'letter incorrect extra'
            currentWord.appendChild(incorrectLetter)
          }
         
       }

       if(isSpace){
        
           if(expected !== ' '){ 
               const letterToInvalidate  = [...document.querySelectorAll('.word.current .letter:not(.correct)')]
                   
               letterToInvalidate.forEach((letter)=>{
      
                    addClass(letter,'incorrect')
                   

               })

               
           }
           removeClass(currentWord,'current')
           addClass(currentWord.nextSibling,'current')
           if(currentletter){
              removeClass(currentletter,'current')

           }
           addClass(currentWord.nextSibling.firstChild,'current')
       }

       if(isBackSpace){
              if(currentletter && isFirstLetter){
                removeClass(currentWord, 'current');
                addClass(currentWord.previousSibling, 'current');
                removeClass(currentletter, 'current');
                addClass(currentWord.previousSibling.lastChild, 'current');
                removeClass(currentWord.previousSibling.lastChild, 'incorrect');
                removeClass(currentWord.previousSibling.lastChild, 'correct');
                
              }


              if(currentletter &&  !isFirstLetter){
            
                removeClass(currentletter, 'current');
                addClass(currentletter.previousSibling, 'current');
                removeClass(currentletter.previousSibling, 'incorrect');
                removeClass(currentletter.previousSibling, 'correct');
               
              }

              if(!currentletter){
                addClass(currentWord.lastChild,'current')
                removeClass(currentletter.previousSibling,'incorrect')
                removeClass(currentletter.previousSibling,'correct')
                
              }
       }
        //move lines
        if(currentWord.getBoundingClientRect().top>400){

            const words = document.getElementById('words')
            const margin = parseInt(words.style.marginTop || '0px')
            words.style.marginTop = (margin- 35) + 'px'
            alert('game')



        }


       //move cursour

       const nextLetter = document.querySelector('.letter.current')
       const cursor = document.getElementById('cursor')
       const nextWord = document.querySelector('.word.current')
       if (nextLetter) {
        const nextLetterRect = nextLetter.getBoundingClientRect();
    
        // Adjust cursor position using the next letter's coordinates
        cursor.style.top = nextLetterRect.top + 3+ 'px';
        cursor.style.left = nextLetterRect.left +'px'; 
    }else{
        cursor.style.top = nextWord.getBoundingClientRect().top+2+'px'
        cursor.style.left = nextWord.getBoundingClientRect().right+'px'
    }

        
})


document.getElementById('restart').addEventListener('click',()=>{
   
    window.location.reload();
    
})

newGame();
