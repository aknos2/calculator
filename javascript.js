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

const maxDigits = 7; 
let operator = "";
let currentNumber = "";
let previousNumber = "";
let errorState = false;
let lastResult = null;
let lastOperator = "";

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
            lastResult = null;

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
                    lastResult = previousNumber;
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
                        lastResult = currentNumber;
                        lastOperator = operator; // Saves last used operator
                        operator = "";
                    }
                } 
            } else if (lastResult !== null && lastOperator) {
                // Continue the last operation with the last result and previous number
                currentNumber = operate(lastResult, previousNumber, lastOperator);
                display();
                lastResult = currentNumber;
            }

        } else if (value === ".") {
                if (!currentNumber.includes(".")) {
                    currentNumber += ".";
                    display();
                } 

        } else { //prevents number from starting with multiple zeros and dots
             if (currentNumber.length < maxDigits) {
                if (currentNumber === "0" && value !== ".") {
                    currentNumber = value;
                } else if (currentNumber !== "00") {
                    currentNumber += value
                }
                display();
            }
        }

    });
});


function operate(a, b, operation) {
    let num1 = parseFloat(a.replace(/,/g, ''));
    let num2 = parseFloat(b.replace(/,/g, ''));

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
    if (currentNumber.length > maxDigits) {
        const scientificNotation = parseFloat(currentNumber).toExponential(2);
        screen.textContent = scientificNotation;
    } else {
        const formattedNumber = formatNumberWithCommas(currentNumber);
        screen.textContent = formattedNumber;
    }
}

function formatNumberWithCommas(number) {
    let [integerPart, decimalPart] = number.split(".");
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
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
