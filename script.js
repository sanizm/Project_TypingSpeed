const RANDOM_QUOTE_API_URL =
  "https://api.quotable.io/random?minLength=150&maxLength=800";

const QuoteDisplay = document.querySelector(".quote-display");
const keyboardLayout = document.querySelector(".keyboard-layout");
const keyArray = keyboardLayout.querySelectorAll(".key");
let mistakes = 0;
const specialKey = [
  "Shift",
  "CapsLock",
  "Control",
  "Alt",
  "Tab",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
];
let quoteArray;
const shiftLeftIndex = 41;
const shiftRightIndex = 52;
const keyValues = [];
let previous = 0;
const shiftRightArray = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "A",
  "S",
  "D",
  "F",
  "G",
  "Z",
  "X",
  "C",
  "V",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "B",
];
const shiftLeftArray = [
  "Y",
  "U",
  "I",
  "O",
  "P",
  "{",
  "}",
  "H",
  "J",
  "K",
  "L",
  "+",
  "_",
  "|",
  '"',
  ":",

  "N",
  "M",
  ")",
  "(",
  "*",
  "&",
];
let index = 0;
let valueIndex = 0;

window.onkeydown = function (e) {
  return !(e.keyCode == 32);
};
for (let i = 0; i < keyArray.length; i++) keyValues.push(keyArray[i]);

function getValueIndex(key) {
  for (let i = 0; i < keyValues.length; i++) {
    if (key === '"') key = "''";
    if (key === "") key = "space";
    if (key === "’") key = "'";
    if (keyValues[i].classList.contains(key)) return i;
  }
  return -1;
}

function ManipulateKey(index) {
  if (getValueIndex(quoteArray[index].innerHTML) !== -1) {
    keyArray[getValueIndex(quoteArray[index].innerHTML)].classList.add(
      "correct-key"
    );
    previous = getValueIndex(quoteArray[index].innerHTML);
  } else keyArray[getValueIndex("")].classList.add("correct-key");
  if (shiftLeftArray.includes(quoteArray[index].innerHTML))
    keyArray[shiftLeftIndex].classList.add("correct-key");
  if (shiftRightArray.includes(quoteArray[index].innerHTML))
    keyArray[shiftRightIndex].classList.add("correct-key");
}

function removeKey() {
  keyArray[previous].classList.remove("correct-key");
  keyArray[shiftLeftIndex].classList.remove("correct-key");
  keyArray[shiftRightIndex].classList.remove("correct-key");
  keyArray[getValueIndex("")].classList.remove("correct-key");
}

document.addEventListener("keydown", function (e) {
  quoteArray = QuoteDisplay.querySelectorAll(".character");
  console.log(e.key);
  valueIndex = getValueIndex(e.key);
  const NoOfWords = document.querySelectorAll(".words").length;
  let key = e.key;
  if (key === " ") key = "";
  if (key === "-") key = "—";
  if (
    index < quoteArray.length &&
    key === "'" &&
    quoteArray[index].innerHTML === "’"
  )
    key = "’";

  if (index < quoteArray.length && key === quoteArray[index].innerText) {
    quoteArray[index].classList.remove("is-active");
    quoteArray[index].classList.remove("incorrect");
    quoteArray[index].classList.add("correct");
    removeKey();
    index += 1;
    if (index < quoteArray.length) {
      quoteArray[index].classList.add("is-active");
      ManipulateKey(index);
    }
  } else if (index >= 0 && key === "Backspace") {
    if (index === quoteArray.length) index--;
    quoteArray[index].classList.remove("is-active");
    quoteArray[index].classList.remove("correct");
    quoteArray[index].classList.remove("incorrect");
    removeKey();
    if (index != 0) index -= 1;
    quoteArray[index].classList.add("is-active");
    ManipulateKey(index);
  } else if (index < quoteArray.length && !specialKey.includes(key)) {
    console.log(e.key);
    quoteArray[index].classList.remove("is-active");
    quoteArray[index].classList.remove("correct");
    quoteArray[index].classList.add("incorrect");
    mistakes++;
    keyArray[getValueIndex(key)].classList.add("incorrect-key");
    setTimeout(() => {
      keyArray[getValueIndex(key)].classList.remove("incorrect-key");
    }, 250);
    if (index > 0 && quoteArray[index - 1].classList.contains("incorrect")) {
      setTimeout(() => {
        quoteArray[index].classList.add("is-active");
        ManipulateKey(index);
      }, 500);
    } else {
      index += 1;
      quoteArray[index].classList.add("is-active");
      removeKey();
      ManipulateKey(index);
    }
  }
  if (index === quoteArray.length) {
    let diff = Math.abs(new Date().getTime() - t1);
    diff = diff / 60 / 1000;
    document.querySelector(".wpm").innerHTML = `${Math.round(
      NoOfWords / diff
    )}wpm`;
    document.querySelector(".mistakes").innerHTML = mistakes;
    if (mistakes < quoteArray.length)
      document.querySelector(".acc").innerHTML = `${(
        ((quoteArray.length - mistakes) / quoteArray.length) *
        100
      ).toFixed(2)}%`;
    else document.querySelector(".acc").innerHTML = `0%`;
    document.querySelector(".model").classList.remove("hidden");
    document.querySelector(".overlay").classList.remove("hidden");
  }
});

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}

let t1;

async function renderNewQuote() {
  let quote = await getRandomQuote();
  let q = "" + quote;
  let word = document.createElement("div");
  let firstLetter = true;
  word.classList.add("words");
  t1 = new Date().getTime();
  q.split("").forEach((character) => {
    const letter = document.createElement("div");
    letter.innerText = character;
    letter.classList.add("character");
    if (firstLetter) {
      letter.classList.add("is-active");
      keyArray[getValueIndex(character)].classList.add("correct-key");

      previous = getValueIndex(character);
      if (shiftLeftArray.includes(character))
        keyArray[shiftLeftIndex].classList.add("correct-key");

      if (shiftRightArray.includes(character))
        keyArray[shiftRightIndex].classList.add("correct-key");

      firstLetter = false;
    }
    word.appendChild(letter);
    if (character === " ") {
      QuoteDisplay.append(word);
      word = document.createElement("div");
      word.classList.add("words");
    }
  });
}
renderNewQuote();

function restart() {
  while (QuoteDisplay.firstChild)
    QuoteDisplay.removeChild(QuoteDisplay.firstChild);
  renderNewQuote();
  index = 0;
  document.getElementById("dis").removeAttribute("disabled");
  document.querySelector(".model").classList.add("hidden");
  document.querySelector(".overlay").classList.add("hidden");
}

document.querySelector(".tryAgain").addEventListener("click", () => {
  restart();
});

document.querySelector(".close-model").addEventListener("click", () => {
  document.querySelector(".warning").classList.remove("hidden");
  document.querySelector(".model").style.opacity = "0.2";
  document.getElementById("dis").setAttribute("disabled", "disabled");
});

document.querySelector(".again").addEventListener("click", () => {
  document.querySelector(".warning").classList.add("hidden");
  restart();
});

document.querySelector(".quit").addEventListener("click", () => {
  window.close();
});
