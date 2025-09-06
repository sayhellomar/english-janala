const loadingBar = document.getElementById('loading-bar');
const lessonWrapper = document.getElementById('lesson-wrapper');
const searchWordBtn = document.getElementById('search-word-btn');

const getData = async (url) => {
    const response = await fetch(url);
    const result = await response.json();
    return result;
}

const pronounceWord = word => {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const showLoader = isShow => {
    if(isShow) {
        loadingBar.classList.remove('hidden');
        lessonWrapper.classList.add('hidden');
    } else {
        loadingBar.classList.add('hidden');
        lessonWrapper.classList.remove('hidden');
    }
}

const getLevels = () => {
    getData('https://openapi.programming-hero.com/api/levels/all')
    .then(levels => showLevels(levels.data));
}

const showLevels = levels => {
    const buttonLevel = document.getElementById('button-level');
    levels.map(level => {
        const {level_no: number} = level;
        const li = document.createElement('li');
        li.classList.add('lesson-btn');
        li.id = `lesson-btn-${number}`;
        li.innerHTML = `
            <a onclick="getWords(this, ${number})" class="btn btn-outline btn-primary">
                Lesson - ${number}
            </a>
        `;
        buttonLevel.appendChild(li);
    });
}

const showActive = target => {
    if(target.parentNode.tagName === 'LI') {
        target.parentNode.classList.add('active');
    }
}

const removeActive = () => {
    const lessonButtons = document.querySelectorAll('.lesson-btn');
    lessonButtons.forEach(lessonButton => lessonButton.classList.remove('active'));
}

const getWords =  (target, id) => {
        showLoader(true);
        removeActive();
        showActive(target);
        getData(`https://openapi.programming-hero.com/api/level/${id}`)
        .then(words => showWords(words.data));
}

const showWords = words => {
    lessonWrapper.innerHTML = '';
    if(words.length < 1) {
        lessonWrapper.innerHTML = `
            <div id="no-lesson-found" class="no-lesson-found space-y-4 text-center py-20 px-5 col-span-full">
                <img class="mx-auto" src="./images/alert-error.png" alt="Error">
                <p class="text-sm text-[#79716B] font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="font-bangla text-4xl">নেক্সট Lesson এ যান</h2>
            </div>
        `;
        showLoader(false);
        return;
    }

    words.map(vocabulary => {
        const {id, word, meaning, pronunciation} = vocabulary;

        lessonWrapper.innerHTML +=
        `
            <div class="vocabulary-item space-y-4 text-center bg-white rounded-xl p-14">
                <h3 class="text-4xl font-bold">${word ? word : 'শব্দ খুঁজে পাওয়া যায়নি'}</h3>
                <p class="text-xl font-medium">Meaning /Pronounciation</p>
                <h3 class="font-bangla font-semibold text-3xl">"${meaning ? meaning : 'অর্থ খুঁজে পাওয়া যায়নি'} / ${pronunciation ? pronunciation : 'উচ্চারন খুঁজে পাওয়া যায়নি'}"</h3>
                <div class="buttons flex justify-between mt-16">
                    <button onclick="displayWordDetails(${id})" class="bg-[#1A91FF10] p-3 rounded-lg cursor-pointer"><span class="text-2xl text-[#374957]"><i class="fa-solid fa-circle-info"></i></span></button>
                    <button onclick="pronounceWord('${word ? word : 'Pronounciation not found'}')" class="bg-[#1A91FF10] p-3 rounded-lg cursor-pointer"><span class="text-2xl text-[#374957]"><i class="fa-solid fa-volume-high"></i></span></button>
                </div>
            </div>
        `
    });
    showLoader(false);
}

const displayWordDetails = id => {
    document.getElementById('word_details_show').showModal();
    const modalContainer = document.getElementById('modal-container');
    getData(`https://openapi.programming-hero.com/api/word/${id}`)
    .then(wordDetails => {
        const {word, meaning, pronunciation, sentence, synonyms} = wordDetails.data;
        modalContainer.innerHTML = `
            <h3 class="text-4xl font-medium mb-7">${word ? word : 'শব্দ খুঁজে পাওয়া যায়নি'} (<i class="fa-solid fa-microphone-lines text-3xl"></i>: ${pronunciation ? pronunciation : 'উচ্চারন খুঁজে পাওয়া যায়নি'})</h3>
            <h4 class="text-2xl font-medium">Meaning</h4>
            <p class="text-xl font-bangla">${meaning ? meaning : 'অর্থ খুঁজে পাওয়া যায়নি'}</p>

            <h4 class="pt-5 text-2xl font-medium">Example</h4>
            <p class="text-xl opacity-80">${sentence ? sentence : 'বাক্য খুঁজে পাওয়া যায়নি'}</p>

            <h4 class="pt-5 text-2xl font-medium font-bangla">সমার্থক শব্দ গুলো</h4>
            <div class="synonyms flex gap-3">
                ${showSynonyms(synonyms)}
            </div>
        `
    })
}

const showSynonyms = synonyms => {
    const synonymWord = synonyms.map(synonym => `<p class="text-lg bg-[#EDF7FF] border border-[#D7E4EF] rounded-lg py-2 px-6 text-[#00000080]">${synonym}</p>`);
    return synonymWord.join('');
}

searchWordBtn.addEventListener('click', () => {
    const noWordError = document.getElementById('no-word-error');
    const searchWordInput = document.getElementById('search-word-input');
    const searchWord = searchWordInput.value.toLowerCase().trim();

    if(searchWord !== '' ) {
        noWordError.classList.add('hidden');
        showLoader(true);
        getData('https://openapi.programming-hero.com/api/words/all')
        .then(words => {
            const filteredWord = words.data.filter(word => word.word.toLowerCase().includes(searchWord));
            removeActive();
            showWords(filteredWord);
            showLoader(false);
        });
    } else {
        noWordError.classList.remove('hidden');
    }
});

getLevels();