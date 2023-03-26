// script.js

let values = new Array(2).fill(0);
let pointerIndex = 0;
let blocksContainer = document.querySelector(".block-row");
let oldCode = "";
let output="";

// Initial settings
window.onload = init;

function init() {
    removeBlocks();
    document.getElementById("output").value = "";
    document.getElementById("code").value = "";
    values.length = 2; values.fill(0);
    pointerIndex=0;
    oldCode = "";
    output = "";
    addBlock(); addBlock();
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

function handleCodeInput(code) {
    let diffIndex = 0;
    let loopStack = [];
    let inLoop = false;
    let openIndex;
    let closeIndex;
    // Find the first index at which oldCode and code differ
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
    for (let i = diffIndex; i < code.length; i++) {
        switch (code[i]) {
            case ">":
                if (!inLoop) {
                    pointerIndex++;
                    if (pointerIndex >= values.length) {
                        values.push(0);
                        addBlock();
                    }
                }
                break;
            case "<":
                if (!inLoop) pointerIndex = Math.max(pointerIndex - 1, 0);
                break;
            case "+":
                if (!inLoop) values[pointerIndex]++;
                break;
            case "-":
                if (!inLoop) values[pointerIndex]--;
                break;
            case "[":
                if (values[pointerIndex] === 0) {
                    openIndex = i;
                    let count = 1;
                    for (let j = i + 1; j < code.length; j++) {
                        if (code[j] === "[") {
                            count++;
                        } else if (code[j] === "]") {
                            count--;
                        }
                        if (count === 0) {
                            closeIndex = j;
                            break;
                        }
                    }
                    if (count !== 0) {
                        // No matching ] found
                        throw new Error("Unbalanced brackets");
                    }
                    inLoop = true;
                } else {
                    loopStack.push(i);
                }
                break;
            case "]":
                if (loopStack.length === 0) {
                    throw new Error("Unbalanced brackets");
                }
                if (values[pointerIndex] !== 0) {
                    i = loopStack[loopStack.length - 1];
                } else {
                    loopStack.pop();
                }
                break;
            case ".":
                output += String.fromCharCode(values[pointerIndex]);
                break;
        }
        if (loopStack.length === 0) {
            inLoop = false;
        }
    }
    // Update the display
    updateBlocks();
    // Save the new code
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
    if (this.value === "") {
        init();
    }
    let value = this.value;
    if (value.length < oldCode.length) {
        // The user has deleted a portion of the code
        oldCode="";
        handleCodeInput(value);
    } else {
        // The user has added or modified the code
        handleCodeInput(oldCode);
    }
    handleCodeInput(value);
    // Debugging logs
    console.log(value);
    console.log(values[pointerIndex] + " " + pointerIndex);
});

