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
  // we now use q+question_id to uniquely identify a question. 
  form.option.value = localStorage.getItem('q'+form.question_id.value);
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
      // as localStorage contains a lot of other key value pairs that are with 
      // number as key, we prefix q in front to indicate the question id
      localStorage.setItem('q'+form.question_id.value, radioBtn.value);
      break;
    }
  }
});

/**
 * Form submission event handler
 */
async function submitAnswers() {
  var answers = {};
  // reset clock to make sure clock stops counting.
  window.clearInterval(interval);

  localStorage.setItem(num_of_questions, form.option.value);

  // before sumbit, look into question list to find answers
  for (let i = 0; i < Number(num_of_questions) ; i++) {
    localStorage.getItem('q'+questions_list[i]) 
      ? (answers[`${i}`] = localStorage.getItem('q' + questions_list[i]))
      : (answers[`${i}`] = "");
  }

  answers["quiz_id"] = quiz_id;

  // the NS_BINDING_ABORT error with firefox seems to be caused by the async behaviour of fetch API
  // when location is changed to /  response is not yet received and binding is aborted.
  // code change is to change it to synchronous action.  change browser to / after receive response from server.
  const response = await(
    fetch(sendAnswerURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf_token,
      },
      body: JSON.stringify(answers),
    }));

  if (response.ok) {
      const data = await response.json();
      const score = (Number(data.result) / Number(num_of_questions)) * 100;

      if (score >= 50) {
        alert(`Congratulations!!!\n\n\t\tScore: ${score}%`);
      } else {
        alert(`Failed!!!\n\n\t\tScore: ${score}%`);
      }
  } else {
      throw new Error('Request failed: ' + response.statusText);
   }

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
