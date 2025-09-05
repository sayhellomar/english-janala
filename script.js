const loadingBar = document.getElementById('loading-bar');
const lessonWrapper = document.getElementById('lesson-wrapper');

const getData = async (url) => {
    const response = await fetch(url);
    const result = await response.json();
    return result;
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

const getWords =  (target, id) => {
    // const lessonBtn = document.getElementById(`lesson-btn-${id}`);

        showLoader(true);

        showActive(target);
        getData(`https://openapi.programming-hero.com/api/level/${id}`)
        .then(words => showWords(words.data));

}

const showActive = target => {
    const lessonButtons = document.querySelectorAll('.lesson-btn');
    lessonButtons.forEach(lessonButton => lessonButton.classList.remove('active'));
    if(target.parentNode.tagName === 'LI') {
        target.parentNode.classList.add('active');
    }
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
        const {word, meaning, pronunciation} = vocabulary;

        lessonWrapper.innerHTML +=
        `
            <div class="vocabulary-item space-y-4 text-center bg-white rounded-xl p-14">
                <h3 class="text-4xl font-bold">${word ? word : 'শব্দ খুঁজে পাওয়া যায়নি'}</h3>
                <p class="text-xl font-medium">Meaning /Pronounciation</p>
                <h3 class="font-bangla font-semibold text-3xl">"${meaning ? meaning : 'অর্থ খুঁজে পাওয়া যায়নি'} / ${pronunciation ? pronunciation : 'উচ্চারন খুঁজে পাওয়া যায়নি'}"</h3>
                <div class="buttons flex justify-between mt-16">
                    <button class="bg-[#1A91FF10] p-3 rounded-lg cursor-pointer"><span class="text-2xl text-[#374957]"><i class="fa-solid fa-circle-info"></i></span></button>
                    <button class="bg-[#1A91FF10] p-3 rounded-lg cursor-pointer"><span class="text-2xl text-[#374957]"><i class="fa-solid fa-volume-high"></i></span></button>
                </div>
            </div>
        `
    });
    showLoader(false);
}

getLevels();