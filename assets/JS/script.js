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

var body = document.querySelector("body");

// bluebutton.addEventListener("click", () => {
//   body.style.backgroundImage = " url(./backgrounds/Rainy.gif)";
// });
// gamecubebutton.addEventListener("click", () => {
//   body.style.backgroundImage = "url(./backgrounds/gamegube.gif)";
// });
oceanbutton.addEventListener("click",() => {
  body.style.backgroundImage= url("../Images/Ocean.gif")
})