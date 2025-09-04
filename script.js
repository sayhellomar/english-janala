// const lessonButtons = document.getElementsByClassName('lesson-btn');

const getData = async (url) => {
    const response = await fetch(url);
    const result = await response.json();
    return result;
}

const getLevels = () => {
    getData('https://openapi.programming-hero.com/api/levels/all')
    .then(levels => showLevels(levels.data));
}

const showLevels = (levels) => {
    const buttonLevel = document.getElementById('button-level');
    levels.map(level => {
        const {level_no: number} = level;
        const li = document.createElement('li');
        li.id = `lesson-btn-${number}`;
        li.innerHTML = `
            <a onclick="showWords(${number})" class="btn btn-outline btn-primary lesson-btn">
                <img src="./images/fa-book-open.png" alt="">
                Lesson - ${number}
            </a>
        `;
        buttonLevel.appendChild(li);
    });
}

const showWords =  (id) => {
    const lessonBtn = document.getElementById(`lesson-btn-${id}`);
    const lessonWrapper = document.getElementById('lesson-wrapper');
    lessonBtn.addEventListener('click', function() {
        lessonWrapper.innerHTML = '';

        getData(`https://openapi.programming-hero.com/api/level/${id}`)
        .then(words => {

            if(words.data.length < 1) {
                console.log(words.data.length);
                lessonWrapper.innerHTML = `
                    <div id="no-lesson-found" class="no-lesson-found space-y-4 text-center py-20 px-5 col-span-full">
                        <img class="mx-auto" src="./images/alert-error.png" alt="Error">
                        <p class="text-sm text-[#79716B] font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                        <h2 class="font-bangla text-4xl">নেক্সট Lesson এ যান</h2>
                    </div>
                `;
                return;
            }

            words.data.map(vocabulary => {
                const {word, meaning, pronunciation} = vocabulary;
                lessonWrapper.innerHTML +=
                `
                    <div class="vocabulary-item space-y-4 text-center bg-white rounded-xl p-14">
                        <h3 class="text-4xl font-bold">${word}</h3>
                        <p class="text-xl font-medium">Meaning /Pronounciation</p>
                        <h3 class="font-bangla font-semibold text-3xl">"${meaning} / ${pronunciation}"</h3>
                        <div class="buttons flex justify-between mt-16">
                            <button class="bg-[#1A91FF10] p-3 rounded-lg cursor-pointer"><span class="text-2xl text-[#374957]"><i class="fa-solid fa-circle-info"></i></span></button>
                            <button class="bg-[#1A91FF10] p-3 rounded-lg cursor-pointer"><span class="text-2xl text-[#374957]"><i class="fa-solid fa-volume-high"></i></span></button>
                        </div>
                    </div>
                `
            });
        });
    });
}

getLevels();