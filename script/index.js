const wordSynonyms = (words)=>{
    const createElement = words.map(el=> `<span class="btn">${el}</span>`);
   return createElement.join(" ");
}
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; 
  window.speechSynthesis.speak(utterance);
}
const loadDetails=(id)=>{
    const url =`https://openapi.programming-hero.com/api/word/${id}`;
    fetch(url)
    .then(res=>res.json())
    .then(detail=>displayDetails(detail.data))
};

const displayDetails=(details)=>{
   
   const detailsContainer = document.getElementById('details-container');
   detailsContainer.innerHTML = `
    <h2 class="text-2xl font-semibold ">${details.word} (<i class="fa-solid fa-microphone-lines"></i> :${details.pronunciation})</h2>
     <p class="text-xl font-semibold">Meaning</p>
     <p class="text-xl">${details.meaning}</p>
     <p class="text-xl font-semibold">Example</p>
     <p class="text-xl">${details.sentence}</p>
     <p class="text-xl font-semibold">সমার্থক শব্দ গুলো</p>
     <div>
      ${ wordSynonyms(details.synonyms)}
     </div>
   `;
   const detailModal = document.getElementById('detail-modal').showModal();
}

const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(json => displayLesson(json.data))
};

const manageSpinner = (status)=>{
    if(status){
        document.getElementById('spnning').classList.remove('hidden');
       document.getElementById('word-container').classList.add('hidden');
    }else{
         document.getElementById('spnning').classList.add('hidden');
         document.getElementById('word-container').classList.remove('hidden');
    }
}

const loadLevelWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(json => {
            const clickBtn = document.getElementById(`lessonBtn-${id}`);
            const lessonBtn = document.querySelectorAll('.lesson-btn');
            lessonBtn.forEach(btn=>btn.classList.remove('active'));
            clickBtn.classList.add('active');
            displayLevelWord(json.data)
        })
};

const displayLevelWord = (words) => {

    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';

    if (words.length === 0) {
       wordContainer.innerHTML = `
         <div class="text-center col-span-full space-y-3 font-bangla">
        <div class="flex justify-center"><img src="./assets/alert-error.png" alt=""></div>
         <p class="text-gray-500">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</span></p>
         <h1 class="text-2xl text-neutral">নেক্সট Lesson এ যান</h1>
       </div>
        `
        manageSpinner(false);
        return;
    }

    words.forEach(word => {
        const card = document.createElement('div');
        card.innerHTML = `
     <div class="bg-white rounded-xl shadow-sm py-10 px-5 text-center space-y-4">
     <h2 class="font-bold text-2xl ">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
     <p class="font-medium text-sm ">Meaning /Pronounciation</p>
     <div class="font-semibold text-lg text-center">" ${word.meaning ? word.meaning : "meaning পাওয়া যায়নি"} /${word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি"} "</div>
     <div class="flex justify-between items-center">
      <button onclick="loadDetails(${word.id})" class="btn"><i class="fa-solid fa-circle-info"></i></button>
      <button onclick="pronounceWord('${word.word}')" class="btn"><i class="fa-solid fa-volume-high "></i></button>
     </div>
    </div>
     `
        wordContainer.appendChild(card);
    })
    manageSpinner(false);
};

const displayLesson = (lessons) => {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = '';
    for (let lesson of lessons) {
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
     <button id="lessonBtn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
            <i class="fa-solid fa-book-open"></i>Learn - ${lesson.level_no}</button>
    `
        levelContainer.appendChild(btnDiv)
    }
};

loadLessons();

document.getElementById('search-btn').addEventListener('click',()=>{
    const input = document.getElementById('input-search');
    const searchValue = input.value.trim().toLowerCase();
    
    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(res=>res.json())
    .then(data=>{
        const allWords = data.data;
        const filterWords = allWords.filter(word=>word.word.toLowerCase().includes(searchValue));
        displayLevelWord(filterWords);
    })
})