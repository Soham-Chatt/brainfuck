// script.js

let values = new Array(1).fill(0);
let pointerIndex = 0;
let blocksContainer = document.querySelector(".block-row");
let oldCode = "";

// Initial settings
window.onload = init;

function init() {
    removeBlocks();
    document.getElementById("code").value = "";
    values.length = 1; values.fill(0);
    pointerIndex=0;
    oldCode = "";
    addBlock();
    updateBlocks();
}

function updateBlocks() {
    let blocks = document.querySelectorAll(".block");
    for (let i = 0; i < blocks.length; i++) {
        if (i === pointerIndex) {
            blocks[i].classList.add("current");
        } else {
            blocks[i].classList.remove("current");
        }
        blocks[i].textContent = values[i];
    }

}

function addBlock() {
    let newBlock = document.createElement("div");
    newBlock.classList.add("block");
    newBlock.textContent = "0";
    blocksContainer.appendChild(newBlock);
}

function removeBlocks() {
    let blocks = document.querySelectorAll(".block");
    for (let i = 0; i < blocks.length; i++) {
      blocksContainer.removeChild(blocks[i]);
    }
}


function handleCodeInput(code) {
    // Find the first index at which oldCode and code differ
    let diffIndex = 0;
    let startIndex = -1;
    let loopStack = [];

    while (diffIndex < oldCode.length && diffIndex < code.length && oldCode[diffIndex] === code[diffIndex]) {
        if (oldCode[diffIndex] === "[") {
            loopStack.push(diffIndex);
        } else if (oldCode[diffIndex] === "]") {
            loopStack.pop();
        }
        diffIndex++;
    }

    // Reset program state if the code has been completely replaced
    if (diffIndex === 0) {
        values.fill(0);
        pointerIndex = 0;
        removeBlocks();
        addBlock();
    }

    // Apply updates to program state
    while (diffIndex < oldCode.length) {
        switch (oldCode[diffIndex]) {
            case ">":
                pointerIndex++;
                if (pointerIndex >= values.length) {
                    values.push(0);
                    addBlock();
                }
                break;
            case "<":
                pointerIndex--;
                if (pointerIndex < 0) {
                    pointerIndex = 0;
                }
                break;
            case "+":
                values[pointerIndex]++;
                break;
            case "-":
                values[pointerIndex]--;
                break;
            case "[":
                if (values[pointerIndex] === 0) {
                    // Jump to matching closing bracket
                    let loopEnd = findLoopEnd(oldCode, diffIndex);
                    diffIndex = loopEnd;
                } else {
                    // Push starting position of loop onto stack
                    loopStack.push(diffIndex);
                }
                break;
            case "]":
                // Pop starting position of loop from stack
                let loopStart = loopStack.pop();
                if (values[pointerIndex] !== 0) {
                    // Jump back to start of loop
                    diffIndex = loopStart - 1;
                }
                break;
        }
        diffIndex++;
    }

    while (diffIndex < code.length) {
        switch (code[diffIndex]) {
            case ">":
                pointerIndex++;
                if (pointerIndex >= values.length) {
                    values.push(0);
                    addBlock();
                }
                break;
            case "<":
                pointerIndex--;
                if (pointerIndex < 0) {
                    pointerIndex = 0;
                }
                break;
            case "+":
                values[pointerIndex]++;
                break;
            case "-":
                values[pointerIndex]--;
                break;
            case "[":
                if (values[pointerIndex] === 0) {
                    // Jump to matching closing bracket
                    let loopEnd = findLoopEnd(code, diffIndex);
                    diffIndex = loopEnd;
                } else {
                    // Push starting position of loop onto stack
                    loopStack.push(diffIndex);
                }
                break;
            case "]":
                // Pop starting position of loop from stack
                let loopStart = loopStack.pop();
                if (values[pointerIndex] !== 0) {
                    // Jump back to start of loop
                    diffIndex = loopStart - 1;
                }
                break;
        }
        diffIndex++;
    }

    // Update the display
    updateBlocks();

    // Save the new code for the
    oldCode = code;
}

document.getElementById("code").addEventListener("keydown", function(event) {
    if (event.key === "Backspace") {
        let currentCode = this.value;
        if (currentCode.length > 0) {
            currentCode = currentCode.slice(0, -1);
        }
        oldCode = "";
        handleCodeInput(currentCode);
    }
});


document.getElementById("code").addEventListener("input", function() {
    let value = this.value;
    handleCodeInput(value);
    // Debugging logs
    console.log(value);
    console.log(values[pointerIndex] + " " + pointerIndex);
});