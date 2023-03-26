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
    values.fill(0);
    pointerIndex=0;
    addBlock();
    updateBlocks();
}

function updateBlocks() {
    let blocks = document.querySelectorAll(".block");
    blocks[pointerIndex].textContent = values[pointerIndex] ;

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
    while (diffIndex < oldCode.length && diffIndex < code.length && oldCode[diffIndex] === code[diffIndex]) {
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
        }
        diffIndex++;
    }
    // Update the display
    updateBlocks();
    // Save the new code for the next update
    oldCode = code;
}



document.getElementById("code").addEventListener("input", function() {
    let value = this.value;
    handleCodeInput(value);
    // Debugging logs
    console.log(value);
    console.log(values[pointerIndex] + " " + pointerIndex);
});