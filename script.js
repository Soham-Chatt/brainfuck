// script.js

let values = new Array(2).fill(0);
let pointerIndex = 0;
let blocksContainer = document.querySelector(".block-row");
let oldCode = "";
let output="";

// Initial settings
window.onload = init; addBlock();

function init() {
    removeBlocks();
    document.getElementById("output").value = "";
    document.getElementById("code").value = "";
    values.length = 2; values.fill(0);
    pointerIndex=0;
    oldCode = "";
    output = "";
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
    for (let i = 0; i < blocks.length-1; i++) {
      blocksContainer.removeChild(blocks[i]);
    }
}

function handleDiffIndex(oldCode, newCode) {
    let diffIndex = 0;
    while (diffIndex < oldCode.length && diffIndex < newCode.length && oldCode[diffIndex] === newCode[diffIndex]) {
        diffIndex++;
    }
    return diffIndex;
}

function resetStateIfNecessary(diffIndex) {
    if (diffIndex === 0) {
        values.fill(0);
        pointerIndex = 0;
        removeBlocks();
        addBlock();
    }
}

function handleOpenBracket(i, code, loopStack) {
    let new_i = i;
    if (values[pointerIndex] === 0) {
        let count = 1;
        for (let j = i + 1; j < code.length; j++) {
            if (code[j] === "[") count++;
            else if (code[j] === "]") count--;

            if (count === 0) {
                new_i = j;
                break;
            }
        }
    } else {
        loopStack.push(i);
    }
    return new_i;
}

function handleCloseBracket(i, loopStack) {
    if (loopStack.length === 0) {
        throw new Error("Unbalanced brackets");
    }
    let new_i = (values[pointerIndex] !== 0) ? loopStack[loopStack.length - 1] : i;
    if (values[pointerIndex] === 0) {
        loopStack.pop();
    }
    return new_i;
}

function handleSingleCommand(cmd, i, code, loopStack) {
    let new_i = i;
    switch (cmd) {
        case ">":
            pointerIndex++;
            if (pointerIndex >= values.length) {
                values.push(0);
                addBlock();
            }
            break;
        case "<":
            pointerIndex = Math.max(pointerIndex - 1, 0);
            break;
        case "+":
            values[pointerIndex]++;
            break;
        case "-":
            values[pointerIndex]--;
            break;
        case "[":
            new_i = handleOpenBracket(i, code, loopStack);
            break;
        case "]":
            new_i = handleCloseBracket(i, loopStack);
            break;
        case ".":
            output += String.fromCharCode(values[pointerIndex]);
            break;
    }
    return new_i;
}

function handleCodeInput(code) {
    let warningElement = document.getElementById("warning");
    warningElement.textContent = "";  // Clear any existing warning

    let diffIndex = handleDiffIndex(oldCode, code);
    resetStateIfNecessary(diffIndex);
    let iterations = 0;
    const MAX_ITERATIONS = 10000;

    let loopStack = [];
    for (let i = diffIndex; i < code.length; ) {
        i = handleSingleCommand(code[i], i, code, loopStack);
        i++;
        if (iterations++ > MAX_ITERATIONS) {
            warningElement.textContent = "Warning: Too many iterations, possible infinite loop.";
            break;
        }
    }

    updateBlocks();
    oldCode = code;
}


function execute() {
      let outputTextarea = document.getElementById("output");
      outputTextarea.value="";
      outputTextarea.value += output;
}


document.getElementById("code").addEventListener("keydown", function(event) {
    if (event.key === "Backspace") {
        let currentCode = this.value;
        if (currentCode.length > 0) {
            currentCode = currentCode.slice(0, -1);
        }
        removeBlocks();
        values.length = 2; values.fill(0);
        pointerIndex=0;
        oldCode = "";
        output = "";
        handleCodeInput(currentCode);
    }
});


document.getElementById("code").addEventListener("input", function() {
    let value = this.value;

    // If the new code is shorter than the old code, reset and re-run
    if (value.length < oldCode.length) {
        init();
        handleCodeInput(value);
    } else {
        handleCodeInput(value);
    }

    // Debugging logs
    console.log(value);
    console.log(values[pointerIndex] + " " + pointerIndex);
});