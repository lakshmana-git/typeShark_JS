const words = 'typing games are interactive software applications designed to improve typing skills while making the learning process engaging and entertaining. These games typically present players with various challenges, such as typing words, sentences, or paragraphs within a time limit. The games often include features like accuracy tracking, speed measurement, and progression levels, motivating players to enhance their typing proficiency. By combining the practice of typing with elements of fun and competition, typing games have become a popular way for people of all ages to develop and refine their typing abilities while enjoying the process'.split(' ');

console.log(words);

let wordCount = words.length;


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
        let x = formatWord(words[i]) 
        document.getElementById('words').appendChild(x) 
    }

    addClass(document.querySelector('.word'),'current')
    addClass(document.querySelector('.letter'),'current')
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
     
       console.log({key,expected})

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

newGame();
