// calculator JavaScript //
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement[0]
        this.currentOperandTextElement = currentOperandTextElement[0]
        this.clear()
    }
    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = ''
    }
    deleteDigit() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }
    chooseOperation(operation) {
        if (this.currentOperand === '') return
        if (this.previousOperand !== '') {
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }
    compute() {
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        if (isNaN(prev) || isNaN(current)) return
        switch (this.operation) {
            case '+':
                computation = prev +  current
                break
            case '-':
                computation = prev -  current
                break
            case '*':
                computation = prev *  current
                break
            case '÷':
                computation = prev /  current
                break
            default: 
            return
        }
        this.currentOperand = computation
        this.operation = ''
        this.previousOperand = ''
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const intergerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let intergerDisplay 
        if (isNaN(intergerDigits)){
            intergerDisplay = ''
        } else {
            intergerDisplay = intergerDigits.toLocaleString('en', {
                maximumSignificantDigits: 0 })
        }
        if (decimalDigits != null) {

        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand + '' + this.operation
        this.previousOperandTextElement.innerText = this.previousOperand + '' + this.operation
    }
}  
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelectorAll('[data-previous-operand]')
const currentOperandTextElement = document.querySelectorAll('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()  
        
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()  
        
    })
})

equalsButton.addEventListener('click', () => {
    calculator.compute()
    calculator.updateDisplay()
})

allClearButton.addEventListener('click', () => {
    calculator.clear()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', () => {
    calculator.deleteDigit()
    calculator.updateDisplay()
})

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

// Weather API Card

//api key
var APIKey = "daf6739626e4defe871d6e34398cd5af"
// search button info
var searchInput = document.getElementById("searchvalue");
var searchButton = document.getElementById("searchbtn");
searchButton.addEventListener("click", function(event){
  var city = searchInput.value;
  var weatherurl = ("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial")
  event.preventDefault()

  fetch(weatherurl)
    .then(response => response.json())
    .then(data => {
      console.log(data)
        var cityNameEl= document.getElementById("cityName")
        cityNameEl.innerHTML= (data.name)
        var cityDataCardEl= document.getElementById("cityDataCard")
        cityDataCardEl.innerHTML= ("Weather: " + data.weather[0].description)
        var cityDataCardTemp= document.getElementById("cityDataCardTemp")
        cityDataCardTemp.innerHTML= ("Temp: " + data.main.temp + "°F")
        var cityDataCardHumid= document.getElementById("cityDataCardHumid")
        cityDataCardHumid.innerHTML = ("Humidity: " + data.main.humidity)
        var cityDataCardWind= document.getElementById("cityDataCardWind")
        cityDataCardWind.innerHTML = ("Wind: " + data.wind.speed + "mph")
    })
    .catch(error => {
      console.log(error)
    });

  var weatherInfo = document.getElementById("weatherInfo")
  weatherInfo.classList.remove("hidden")
  var weatherCity = document.getElementById("weatherCity")
  weatherCity.classList.add("hidden")
});