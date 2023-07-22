var prevBtn = document.getElementById("prevBtn");
var paginationBtn = document.getElementsByClassName("pagination-btn");
var form = document.getElementById("form");
const clock = document.querySelector("#clock");
let currentTime;

/**
 * Stores clock data in the local storage.
 */
localStorage.hasOwnProperty("django_quiz_timer")
  ? localStorage.getItem("django_quiz_timer")
  : localStorage.setItem("django_quiz_timer", time);

currentTime = Number(localStorage.getItem("django_quiz_timer"));

/**
 * Get Minutes and Seconds digits
 */

let min = Math.floor(currentTime / 60);
let sec = currentTime % 60;

min = min > 9 ? min : `0${min}`;
sec = sec > 9 ? sec : `0${sec}`;

clock.textContent = `${min}:${sec}`;

/**
 * Initialize the form to the previous value selected.
 */

for (let i = 1; i < Number(num_of_questions) + 1; i++) {
  form.option.value = localStorage.getItem(i);
}

/**
 * Pagination button onClick event handler.
 */

for (var i = 0; i < paginationBtn.length; i++) {
  paginationBtn[i].addEventListener("click", function () {
    var url = this.dataset.url;
    var action = this.dataset.action;
    var prevURL = `/quiz_detail/${quiz_id}?page=${Number(url) - 1}`;
    var nextURL = `/quiz_detail/${quiz_id}?page=${Number(url) + 1}`;

    if (action === "prev") {
      window.location = prevURL;
    } else if (action === "next") {
      window.location = nextURL;
    }
  });
}

/**
 * Quiz form onChange event handler to store chosen option.
 */

form.addEventListener("change", (e) => {
  console.log(form);
  for (var radioBtn of form.option) {
    if (radioBtn.checked) {
      localStorage.setItem(form.question_id.value, radioBtn.value);
      break;
    }
  }
});

/**
 * Form submission event handler
 */
function submitAnswers() {
  var answers = {};

  localStorage.setItem(num_of_questions, form.option.value);

  for (let i = 1; i < Number(num_of_questions) + 1; i++) {
    localStorage[`${i}`]
      ? (answers[`${i}`] = localStorage[`${i}`])
      : (answers[`${i}`] = "");
  }

  answers["quiz_id"] = quiz_id;

  fetch(sendAnswerURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrf_token,
    },
    body: JSON.stringify(answers),
  })
    .then((response) => response.json())
    .then((data) => {
      const score = (Number(data.result) / Number(num_of_questions)) * 100;

      if (score >= 50) {
        alert(`Congratulations!!!\n\n\t\tScore: ${score}%`);
      } else {
        alert(`Failed!!!\n\n\t\tScore: ${score}%`);
      }
    })
    .catch((error) => {
      alert(error);
    });

  localStorage.clear();
  window.location = "/";
}

/**
 * Quiz timer counter.
 */
const interval = window.setInterval(() => {
  currentTime--;
  let min = Math.floor(currentTime / 60);
  let sec = currentTime % 60;

  min = min > 9 ? min : `0${min}`;
  sec = sec > 9 ? sec : `0${sec}`;

  localStorage.setItem("django_quiz_timer", currentTime);

  clock.textContent = `${min}:${sec}`;

  /* End Quiz if user's time is up */

  if (currentTime === 0) {
    window.clearInterval(interval);
    submitAnswers();
  }
}, 1000);
