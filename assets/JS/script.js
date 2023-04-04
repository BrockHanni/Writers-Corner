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
    delete() {
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
        if (decimalDigits != mull) {

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
const deleteButton = document.getElementById('data-delete')
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
    calculator.delete()
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