// DOM Selectors
const output = document.getElementById("output");
const generate = document.getElementById("generate");
const star = document.getElementById("star");
const list = document.getElementById("list");
let listUl;

generate.addEventListener("click", colorGen);
star.addEventListener("click", starColor);
output.addEventListener("click", copyColor);
list.addEventListener("click", copyColor);

window.onload = () => {
  console.log(getLS());
  if (getLS() !== null) {
    console.log("ls exists");
    list.innerHTML = '<ul id="list-inner"></ul>';
    list.querySelector("#list-inner").innerHTML = getLS();
  }
};
colorGen();

// Event Listeners

// Remove from list on click
list.addEventListener("click", e => {
  //Check if x is clicked an remove
  if (e.target.classList.contains("remove")) {
    e.target.parentElement.remove();

    let listUL = document.getElementById("list-inner");

    if (listUL.querySelectorAll("li").length === 0) {
      listUL.classList.add("no-border");
    }
    updateLS();
  }
});

//Functions

async function colorGen() {
  let num1 = numGen();
  let num2 = numGen();
  let num3 = numGen();
  let color = `rgb(${num1}, ${num2}, ${num3})`;

  let response = await fetch(`https://www.thecolorapi.com/id?rgb=${color}`);
  let data = await response.json();
  let colorName = data.name.value;

  output.parentElement.parentElement.style.background = color;
  output.innerHTML = `<p id="colName">${colorName}</p><p id="rgb"> ${color}</p>`;

  document.getElementById("input").value = color;
}

function numGen() {
  let val = Math.floor(Math.random() * 255);
  return val;
}

function starColor() {
  if (!list.querySelector("#list-inner")) {
    list.innerHTML = '<ul id="list-inner"></ul>';
  }

  let existing = document.querySelectorAll("#list-inner>li");
  let listUl = document.getElementById("list-inner");
  let curCol = document.getElementById("rgb").textContent;
  let curColName = document.getElementById("colName").textContent;
  let el = `<li data-color='${curCol}' style='background:${curCol};position: relative;'><span class='remove'>x</span>${curColName}: ${curCol}</li>`;

  if (
    (existing.length > 0 &&
      existing[existing.length - 1].textContent.includes(curColName)) ||
    existing.length > 9
  ) {
    return;
  } else {
    listUl.innerHTML += el;
    listUl.classList.remove("no-border");
  }
  updateLS();
}

function copyColor(e) {
  if (e.target.nodeName === "LI") {
    document.getElementById("input").value = e.target.dataset.color;
    e.target.style.transition = "none";
    e.target.style.background = "#fff";
    setTimeout(() => {
      e.target.style.transition = "background ease 1500ms";
      e.target.style.background = e.target.dataset.color;
    }, 0);
  }

  document.getElementById("input").select();
  document.execCommand("copy");
}

//To Do - Local Storage save list

// Retrieve items from LS
const getLS = () => {
  let data;

  if (localStorage.getItem("colors") !== null) {
    data = localStorage.getItem("colors");
    return data;
  } else {
    return null;
  }
};

// Add current starred items to LS
const updateLS = () => {
  if (document.getElementById("list-inner").innerHTML !== null) {
    let data = document.getElementById("list-inner").innerHTML;
    localStorage.setItem("colors", data);
  } else {
    localStorage.removeItem("colors");
  }
};
