const dd = console.log;
const $ = (selector) => document.querySelector(selector);
const LS = localStorage;
const API_KEY = "a8cd6efe2e7dd00dedc5524bd2901f6d";

const trans0 = (date) => (date >= 10 ? date : "0" + date);

const clock = () => {
  const date = new Date();

  const hour = trans0(date.getHours());
  const minute = trans0(date.getMinutes());
  const ymd = `${hour}:${minute}`;
  $(".clock > p").innerHTML = ymd;
};

const image = (randomNum) => {
  $(".background").style.backgroundImage = `url('images/${randomNum}.jpg')`;
};

const todo = () => {
  $(".list .todo").style.opacity = "1";
  $(".list .todo").style.top = "100%";
};

const delTodo = () => {
  $(".list .todo").style.top = "50%";
  $(".list .todo").style.opacity = "0";
};

const todoDel = function (e) {
  if (e.target && e.target.className === "del") {
    const data = JSON.parse(LS.todo).filter((el) => el.id !== +this.dataset.id);
    //
    LS.todo = JSON.stringify(data);
    refresh();
  }
};

const refresh = () => {
  LS.todo = LS.todo || "[]";
  if (LS.todo) {
    let html = "";
    JSON.parse(LS.todo).forEach((el) => {
      html += `
        
          <li data-id=${el.id}>
          <div class="del">❌</div>
          <div>${el.value}<div>
          </li>
        
        `;
    });
    $(".todo_list ul ").innerHTML = html;
    document
      .querySelectorAll(".todo_list ul li")
      .forEach((el) => (el.onclick = todoDel));
  }
  if (LS.user) $(".user").innerHTML = `<p>${LS.user} 님</p>`;
};

const save = (e) => {
  const {
    target: { value },
  } = e;

  LS.user = value;
  refresh();
};

const add = (e) => {
  const {
    target: { value },
  } = e;

  const data = JSON.parse(LS.todo);

  data.push({ id: Date.now(), value: value });

  LS.todo = JSON.stringify(data);

  refresh();
  e.target.value = "";
};

const getWeather = (data) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&appid=${API_KEY}&units=metric`
  )
    .then((res) => res.json())
    .then((res2) => {
      dd(res2);
      const {
        main: { temp, temp_max, temp_min },
        sys: { country },
        name,
        weather: [icon],
      } = res2;
      $(".weather").innerHTML = `
        <span>${country}, ${name}<span>
        <ul>
          <li>온도: ${temp}℃</li>
          <li>최고온도: ${temp_max}℃</li>
          <li>최소온도: ${temp_min}℃</li>
      `;
    });
};

const success = (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const obj = {
    latitude,
    longitude,
  };

  LS.weather = JSON.stringify(obj);

  if (LS.weather) getWeather(obj);
};

const error = (err) => dd(err.message);

const weather = () => {
  navigator.geolocation.getCurrentPosition(success, error);
};

const handle = () => {
  if ($(".user input")) $(".user input").onchange = save;
  $(".list > p").onclick = todo;
  $(".list .exit").onclick = delTodo;
  $(".list .todo input").onchange = add;
};

const init = () => {
  const num = Math.ceil(Math.random() * 4);
  refresh();
  setInterval(clock, 1000);
  image(num);
  handle();
  LS.weather ? getWeather(JSON.parse(LS.weather)) : weather();
};

window.onload = init;
