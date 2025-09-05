const createElements = (arr) => {
  const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElements.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpiner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLesson(json.data));
};

const removeActive = () => {
  const lessonButton = document.querySelectorAll(".lesson-btn");
  lessonButton.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  manageSpiner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);

      clickBtn.classList.add("active");
      displayLevel(data.data);
    });
};

// {
//     "word": "Eager",
//     "meaning": "আগ্রহী",
//     "pronunciation": "ইগার",
//     "level": 1,
//     "sentence": "The kids were eager to open their gifts.",
//     "points": 1,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "enthusiastic",
//         "excited",
//         "keen"
//     ],
//     "id": 5
// }

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  console.log(word);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
     <div>
            <h2 class="text-2xl font-bold">${
              word.word
            } (<i class="fa-solid fa-microphone-lines"></i>:${
    word.pronunciation
  })</h2>
          </div>
          <div>
            <h2 class="font-bold">Meaning</h2>
            <p>${word.meaning}</p>
          </div>
          <div>
            <h2 class="font-bold">Example</h2>
            <p>${word.sentence}</p>
          </div>
          <div>
            <h2 class="font-bold">সমার্থক শব্দ গুলো</h2>
            <div>${createElements(word.synonyms)}</div>
          </div>
    `;

  document.getElementById("my_modal_5").showModal();
};

const displayLevel = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
        <div class="text-center col-span-full space-y-4">
            <img class="mx-auto" src="./assets/alert-error.png" alt="">
            <p class="text-gray-400 font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bangla font-semibold text-3xl">নেক্সট Lesson এ যান</h2>
        </div>
        `;
  }

  //     {
  //     "id": 5,
  //     "level": 1,
  //     "word": "Eager",
  //     "meaning": "আগ্রহী",
  //     "pronunciation": "ইগার"
  // }

  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5">
              <h2 class="font-bold text-3xl mb-3">${
                word.word ? word.word : "শব্দ পাওয়া যায়নি"
              }</h2>
              <p class="font-semibold mb-3">Meaning /Pronounciation</p>
              <h2 class="font-bangla text-2xl font-semibold mb-4">${
                word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
              } / ${
      word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি"
    }</h2>

              <div class="flex justify-between">
                <button onclick="loadWordDetail(${
                  word.id
                })" class="btn bg-[#1A91FF1A] h-[30px] w-[30px] hover:bg-blue-400"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick='pronounceWord("${word.word}")' class="btn bg-[#1A91FF1A] h-[30px] w-[30px] hover:bg-blue-400"><i class="fa-solid fa-volume-high"></i></button>

              </div>
            </div>
        `;
    wordContainer.append(card);
  });

  manageSpiner(false);
};

const displayLesson = (lessons) => {
  // 1.get the container & empty
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  // 2get into every lessons
  for (let lesson of lessons) {
    // 3.create Element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
                <i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}
            </button>
        `;
    // 4. append into container
    levelContainer.append(btnDiv);
  }
};

// const loadLevelWord = () =>{

// }

loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
    removeActive()
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);

  fetch("https://openapi.programming-hero.com/api/words/all").then((res) =>
    res.json().then((data) => {
        const allWords = data.data
        console.log(allWords);
        const filterWords = allWords.filter(word=>word.word.toLowerCase().includes(searchValue))
        displayLevel(filterWords)
        
        
    })
  );
});
