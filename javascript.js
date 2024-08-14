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
let errorState = false;

buttons.forEach(button => {
    button.addEventListener("click", event => {
        buttonIlluminate();
        const value = event.target.textContent;

        if (errorState && value !== "C") {
            // If in error state and button is not "C" or "CE", ignore the click
            return;
        }

        if (value === "C") {
            operator = "";
            currentNumber = "";
            previousNumber = "";
            screen.textContent = "0";
            errorState = false;
            C.classList.remove("error-message");

        } else if (value === "CE") {
            currentNumber = "";
            screen.textContent = "0"

        } else if (value === "%") {
            if (currentNumber) {
                currentNumber = (parseFloat(currentNumber) / 100).toString();
                display();
            }

        } else if (["+", "-", "÷", "x"].includes(value)) {
              if (currentNumber === "" && previousNumber === "") {
                // Ignore if operator is pressed with no numbers entered
                return;
            } else if (currentNumber === "" && previousNumber !== "") {
                // Replace the operator if pressed consecutively
                operator = value;
            } else if (operator && currentNumber === "") {
                operator = value; 
                // Update the operator and wait for the next number
            } else if (operator && currentNumber !== "") {
                    previousNumber = operate(previousNumber, currentNumber, operator);
                    currentNumber = "";
                    operator = value;
                    screen.textContent = previousNumber; // Display the result of the operation
            } else {
                // No operator in play yet
                previousNumber = currentNumber;
                currentNumber = "";
                operator = value;
        }
            
        } else if (value === "=") {
            if (operator && currentNumber) {
                // Check for division by zero
                if (operator === "÷" && parseFloat(currentNumber) === 0) {
                    screen.textContent = "Error"; // Display "Error" for division by zero
                    currentNumber = "";
                    previousNumber = "";
                    operator = "";
                    errorState = true;     
                    C.classList.add("error-message");
                } else {
                    currentNumber = operate(previousNumber, currentNumber, operator);
                    // Check for NaN or Infinity and reset if necessary
                    if (isNaN(currentNumber) || !isFinite(currentNumber)) {
                        currentNumber = "";
                        previousNumber = "";
                        operator = "";
                        screen.textContent = "0"; // Reset to "0" if result is invalid
                    } else {
                        display();
                        operator = "";
                        previousNumber = "";
                    }
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
