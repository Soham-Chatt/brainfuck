// script.js
let values = new Array(1).fill(0);
let pointerIndex = 0;
let blocksContainer = document.querySelector(".block-row");

// Initial block
window.onload = init;

function init() {
    document.getElementById("code").value = "";
    values.fill(0);
    pointerIndex=0;
    addBlock();
    updateBlocks();
}

function removeBlocks() {
    element = document.getElementById("")
}

function updateBlocks() {
    let blocks = document.querySelectorAll(".block");
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].textContent = blocks[pointerIndex].textContent ;
    }
}

function addBlock() {
    let newBlock = document.createElement("div");
    newBlock.classList.add("block");
    newBlock.textContent = "0";
    blocksContainer.appendChild(newBlock);
}

function handleCodeInput(code) {
    values.fill(0);
    let astack = []; // Array to keep track of open brackets
    let ipointer = -1; // Instruction pointer
    let end = false; // Flag to signal the end of the program

    while (!end && ipointer < code.length) {
        ipointer++; // Move to next instruction
        switch (code[ipointer]) {
            case ">":
                pointerIndex++;
                if (pointerIndex >= values.length) {
                    values.push(0);
                    addBlock();
                    updateBlocks(); // Update blocks after adding a new block
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
                updateBlocks();
                break;
            case "-":
                values[pointerIndex]--;
                updateBlocks();
                break;
            case ".":
                // todo
                break;
            case ",":
                // todo
                break;
            case "[":
                if (values[pointerIndex] === 0) { // If zero
                    // Skip to matching right bracket
                    let count = 0;
                    while (true) {
                        ipointer++;
                        if (!code[ipointer]) break;
                        if (code[ipointer] === "[") count++;
                        else if (code[ipointer] === "]") {
                            if (count) count--;
                            else break;
                        }
                    }
                } else { // If non-zero
                    astack.push(ipointer);
                }
                break;
            case "]":
                if (values[pointerIndex] === 0) { // If zero
                    astack.pop(); // Remove last open bracket from array
                } else { // If non-zero
                    ipointer = astack[astack.length - 1] - 1; // Move back to matching open bracket
                }
                break;
            case undefined: // We have reached the end of the program
                end = true;
                break;
            default: // We ignore any character that is not part of regular Brainfuck syntax
                break;
        }
    }
}


document.getElementById("code").addEventListener("input", function() {
    let value = this.value;
    handleCodeInput(value);
    console.log(value);
    console.log(values[pointerIndex]);
});