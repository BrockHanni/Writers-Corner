// To do list:
var addItemButton = document.querySelector("#add-item-btn");
var todoList = document.querySelector("#todo-list");
var todoNewInput = document.querySelector("#new-item-input");

window.addEventListener("load", function() {
    var savedItems = localStorage.getItem("todoListItems");
    if (savedItems) {
      todoList.innerHTML = savedItems;
    }
});

function updateTime() {
  const currentDate = new Date();
 
  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  const currentTimeString = `${hours}:${minutes}:${seconds} ${amPm}`;

  document.getElementById("currentTime").innerHTML = ` ${currentTimeString}`;
}
setInterval(updateTime, 1000);


addItemButton.addEventListener("click", function() {
    var todoNew = document.createElement("li");
    var deletebtnTodo = document.createElement("button");
    todoNew.classList.add("todoItem")
    deletebtnTodo.textContent = "Delete";
    deletebtnTodo.classList.add("delete-btn");
    todoNew.textContent = todoNewInput.value;
    todoNew.appendChild(deletebtnTodo);
    todoList.appendChild(todoNew);
    todoNewInput.value = "";
    localStorage.setItem("todoListItems", todoList.innerHTML);
});

todoList.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
      event.target.parentElement.remove();
      localStorage.setItem("todoListItems", todoList.innerHTML);
    }
});

// buttons for wallpaper
var bluebutton = document.querySelector("#wallpaper1");
var gamecubebutton = document.querySelector("#wallpaper2")
var oceanbutton = document.querySelector("#wallpaper3")
var rainybutton = document.querySelector("#wallpaper4")
var sunsetbutton = document.querySelector("#wallpaper5")
var treebutton = document.querySelector("#wallpaper6")
var winterbutton = document.querySelector("#wallpaper7")

var body = document.querySelector("body");

bluebutton.addEventListener("click", () => {
  body.style.backgroundImage = 'url("./assets/Images/blue.gif")';
});
gamecubebutton.addEventListener("click", () => {
  body.style.backgroundImage = 'url("./assets/Images/gamecube.gif")';
});
oceanbutton.addEventListener("click",() => {
  body.style.backgroundImage= 'url("./assets/Images/Ocean.gif")'
})
rainybutton.addEventListener("click",() => {
  body.style.backgroundImage= 'url("./assets/Images/Rainy.gif")'
})
sunsetbutton.addEventListener("click",() => {
  body.style.backgroundImage= 'url("./assets/Images/sunset.gif")'
})
treebutton.addEventListener("click",() => {
  body.style.backgroundImage= 'url("./assets/Images/tree.gif")'
})
winterbutton.addEventListener("click",() => {
  body.style.backgroundImage= 'url("./assets/Images/Winter.gif")'
})