"user strict"

const screen = document.querySelector(".screen-text");
const buttons = document.querySelectorAll(".button");
const divide = document.querySelector("#button-divide");
const plus = document.querySelector("#button-plus");
const minus = document.querySelector("#button-minus");
const multiply = document.querySelector("#button-multiply");
const C = document.querySelector("#buttonC");
const CE = document.querySelector("#button-CE");
const equal = document.querySelector("#button-equal");


let operator = "";
let currentNumber = "";
let previousNumber = "";

buttons.forEach(button => {
    button.addEventListener("click", event => {
        buttonIlluminate();
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
            if (currentNumber) {
                currentNumber = (parseFloat(currentNumber) / 100).toString();
                display();
            }
        } else if (["+", "-", "÷", "x"].includes(value)) {
            if (currentNumber === "" && previousNumber !== "") {
                operator = value;
            } else {
                previousNumber = currentNumber;
                currentNumber = "";
                operator = value;
            }``
        } else if (value === "=") {
            if (operator && currentNumber) {
                currentNumber = operate(previousNumber, currentNumber, operator);
                // Check for NaN or Infinity and reset if it's the case
                if (isNaN(currentNumber) || !isFinite(currentNumber)) {
                    currentNumber = "";
                    previousNumber = "";
                    operator = "";
                    screen.textContent = "0";
                } else {
                    display();
                    operator = "";
                    previousNumber = "";
                }
            }
        } else if (value === ".") {
                if (!currentNumber.includes(".")) {
                    currentNumber += ".";
                    display();
                } 
        } else { //prevents number from starting with multiple zeros and dots
            if (currentNumber === "0" && value !== ".") {
                currentNumber = value;
            } else if (currentNumber !== "00") {
                currentNumber += value
            }
            display();
        }

    });
});


function operate(a, b, operation) {
    num1 = parseFloat(a);
    num2 = parseFloat(b);

    if (operation === "÷" && num2 === 0) {
        return NaN;
    }

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

function buttonIlluminate() {
    const equationButtons = [divide, plus, minus, multiply];
    const resetButtons = [C, CE, equal];
    
    equationButtons.forEach(button => {
        if (button) {
            button.addEventListener("click", event =>{
                equationButtons.forEach(btn => btn.classList.remove("illuminate"));
    
                event.currentTarget.classList.add("illuminate");
            });
        }
    });

    if (resetButtons) {
        resetButtons.forEach(button => {
            equationButtons.forEach(btn => {
                btn.classList.remove("illuminate");
            });
        });
    }
}
