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
        handleButtonPress(event.target.textContent);
    });
});

// Handle keyboard input
window.addEventListener("keydown", event => {
    const key = event.key;
    let mappedKey;

    switch (key) {
        case "Enter":
            mappedKey = "=";
            break;
        case "Backspace":
            mappedKey = "CE";
            break;
        case "Escape":
            mappedKey = "C";
            break;
        case "/":
            mappedKey = "÷";
            break;
        case "*":
            mappedKey = "x";
            break;
        case "-":
        case "+":
        case ".":
        case "%":
        case "0": case "1": case "2": case "3": case "4":
        case "5": case "6": case "7": case "8": case "9":
            mappedKey = key;
            break;
        default:
            return; // Ignore any other keys
    }

    handleButtonPress(mappedKey);
});

function handleButtonPress(value) {
    buttonIlluminate();

    if (errorState && value !== "C") {
        // If in error state and button is not "C", ignore the press
        return;
    }

    if (value === "C") {
        operator = "";
        currentNumber = "";
        previousNumber = "";
        screen.textContent = "0";
        errorState = false;
        C.classList.remove("error-message");
        screen.style.fontSize = "85px";
        screen.style.marginTop = "";
        lastResult = null;

    } else if (value === "CE") {
        currentNumber = "";
        screen.textContent = "0";

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
        } else if (operator && currentNumber !== "") {
            previousNumber = operate(previousNumber, currentNumber, operator);
            currentNumber = "";
            operator = value;
            screen.textContent = previousNumber;
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

    } else { // prevents number from starting with multiple zeros and dots
        if (currentNumber === "0" && value !== ".") {
            currentNumber = value;
        } else if (currentNumber !== "00") {
            currentNumber += value
        }
        display();
    }
}

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
        screen.style.fontSize = "60px";
        screen.style.marginTop = "20px";
    } else {
        screen.style.fontSize = "85px";
        screen.style.marginTop = "";
    }

    if (currentNumber.length > 10) {
        const scientificNotation = parseFloat(currentNumber).toExponential(2);
        screen.textContent = scientificNotation;
    } else if (currentNumber.length > 3) {
        const formattedNumber = formatNumberWithCommas(currentNumber);
        screen.textContent = formattedNumber;
    } else {
        screen.textContent = currentNumber;
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
