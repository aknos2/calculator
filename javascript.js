"user strict"

const screen = document.querySelector(".screen-text");
const buttons = document.querySelectorAll(".button");
/*const c = document.querySelector("#buttonC")
const ce = document.querySelector("#button-CE")        
const percentage = document.querySelector("#button-percentage")
const divide = document.querySelector("#button-divide")
const seven = document.querySelector("#button7")
const eight = document.querySelector("#button8")
const nine = document.querySelector("#button9")
const times = document.querySelector("#button-multiply")
const four = document.querySelector("#button4")
const five = document.querySelector("#button5")
const six = document.querySelector("#button6")
const minus = document.querySelector("#button-minus")
const one = document.querySelector("#button1")
const two = document.querySelector("#button2")
const three = document.querySelector("#button3")
const plus = document.querySelector("#button-plus")
const zero = document.querySelector("#button0")
const dot = document.querySelector("#button-dot")
const equal = document.querySelector("#button-equal")*/


let operator = "";
let currentNumber = "";
let previousNumber = "";

buttons.forEach(button => {
    button.addEventListener("click", event => {
        const value = event.target.textContent;

        if (value === "C") {
            operator = "";
            currentNumber = "";
            previousNumber = "";
            screen.textContent = "0";
        } else if (value === "CE") {
            currentNumber = "";
            screen.textContent = "0"
        } else if (value === "%") {
            currentNumber = (parseFloat(currentNumber) / 100).toString();
            display();
        } else if (["+", "-", "÷", "x"].includes(value)) {
            previousNumber = currentNumber;
            currentNumber = "";
            operator = value;
        } else if (value === "=") {
            if (operator && currentNumber) {
                currentNumber = operate(previousNumber, currentNumber, operator);
                display();
                operator = "";
                previousNumber = "";
            }
        } else if (value === ".") {
                if (!currentNumber.includes(".")) {
                    currentNumber += ".";
                    display();
                } 
        } else {
            currentNumber += value;
            display();
        }
    
    });
});

function operate(a, b, operation) {
    num1 = parseFloat(a);
    num2 = parseFloat(b);

    switch(operation) {
        case "+":
            return (num1 + num2).toString();
        case "-":
            return (num1 - num2).toString();
        case "÷":
            return (num1 / num2).toString();
        case "x":
            return (num1 * num2).toString();
        default:
            return "";
    }         
} 

function display() {
    screen.textContent = currentNumber;
}