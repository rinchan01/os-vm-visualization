const algorithm = document.getElementById('select-algorithm');
const numOfFrames = document.getElementById('num-of-frames');
const ref_string = document.getElementById('ref-string');
const submit = document.getElementById('visualization');

const visualPageFrames = document.getElementById('visualize');
// const conclusion = document.getElementById('conclusion');

// const frameInfo = document.getElementById('frame-info');
// const frameSubInfo = document.getElementById('frame-sub-info');

let pageFaults = 0;
let pageFaultsInfo = [];
var referenceBitInfo = [];
function generateString() {
    let string = '';
    for (let i = 0; i < 20; i++) {
        string += Math.floor(Math.random() * 10) + ' ';
    }
    return string;
}

function createPageFrames(refString, frames, algorithm) {

    pageFaultsInfo = [];
    // console.log(refString, frames, algorithm);
    pageFaults = 0;
    let set = new Set();
    // represent current set
    var allSets = [];

    const page = [];
    for (let i = 0; i < refString.length; i++) {
        if (refString[i] === ' ') {
            continue;
        } else {
            page.push(parseInt(refString[i]));
        }
    }

    // first in first out
    if (algorithm == "FIFO") {

        // represent current queue
        var index = [];
        // for visualization
        for (let i = 0; i < page.length; i++) {
            // check if the set is not full
            if (set.size < frames) {
                // if page not in the set then add it to the set
                if (!set.has(page[i])) {
                    set.add(page[i]);
                    index.push(page[i]);
                    pageFaults++;
                    pageFaultsInfo.push(true);
                } else {
                    pageFaultsInfo.push(false);
                }
            } else {
                // if the set is full
                // check if the page is not in the set
                // if the page not in set then remove the first element in the set
                if (!set.has(page[i])) {
                    // remove the first element in the set
                    // and add the new page to the set
                    let val = index.shift();
                    let arr = Array.from(set);
                    let valIndex = arr.indexOf(val);
                    if (valIndex !== -1) {
                        arr[valIndex] = page[i];
                    }
                    set = new Set(arr);
                    index.push(page[i]);
                    pageFaults++;
                    pageFaultsInfo.push(true);
                } else {
                    pageFaultsInfo.push(false);

                }
            }
            allSets.push(Array.from(set));
        }
    }
    // least recently used
    else if (algorithm == "LRU") {
        let indexes = new Map();
        for (let i = 0; i < page.length; i++) {
            if (set.size < frames) {
                // if page not in the set then add it to the set
                if (!set.has(page[i])) {
                    set.add(page[i]);
                    // Store the recently used index of each page
                    indexes.set(page[i], i);
                    pageFaults++;
                    pageFaultsInfo.push(true);
                } else {
                    indexes.set(page[i], i);
                    pageFaultsInfo.push(false);
                }
            } else {
                if (!set.has(page[i])) {
                    // Find the least recently used pages
                    let lru = Number.MAX_VALUE;
                    let val = Number.MIN_VALUE;
                    for (let item of set) {
                        let temp = item;
                        if (indexes.get(item) < lru) {
                            lru = indexes.get(item);
                            val = item;
                        }
                    }

                    // Remove the least recently used page
                    let arr = Array.from(set);
                    let valIndex = arr.indexOf(val);
                    if (valIndex !== -1) {
                        arr[valIndex] = page[i];
                    }
                    set = new Set(arr);
                    indexes.set(page[i], i);
                    pageFaults++;
                    pageFaultsInfo.push(true);
                } else {
                    // Update the index of the recently used page
                    indexes.set(page[i], i);
                    pageFaultsInfo.push(false);
                }
            }
            allSets.push(Array.from(set));
        }
    }
    // most recently used
    else if (algorithm == "MRU") {
        let indexes = new Map();
        for (let i = 0; i < page.length; i++) {
            if (set.size < frames) {
                // if page not in the set then add it to the set
                if (!set.has(page[i])) {
                    set.add(page[i]);
                    // Store the recently used index of each page
                    indexes.set(page[i], i);
                    pageFaults++;
                    pageFaultsInfo.push(true);
                } else {
                    indexes.set(page[i], i);
                    pageFaultsInfo.push(false);
                }
            } else {
                if (!set.has(page[i])) {
                    // Find the most recently used pages
                    let mru = Number.MIN_VALUE;
                    let val;
                    for (let item of set) {
                        if (indexes.get(item) > mru) {
                            mru = indexes.get(item);
                            val = item;
                        }
                    }
                    // Remove the most recently used page
                    let arr = Array.from(set);
                    let valIndex = arr.indexOf(val);
                    if (valIndex !== -1) {
                        arr[valIndex] = page[i];
                    }
                    set = new Set(arr);
                    indexes.set(page[i], i);
                    pageFaults++;
                    pageFaultsInfo.push(true);
                } else {
                    // Update the index of the recently used page
                    indexes.set(page[i], i);
                    pageFaultsInfo.push(false);
                }
            }
            allSets.push(Array.from(set));
        }
    }
    // least frequently used
    else if (algorithm == "LFU") {
        let freq = new Map();
        // check first in first out if tie in frequency
        var index = [];
        for (let i = 0; i < page.length; i++) {
            if (set.size < frames) {
                // if page not in the set then add it to the set
                if (!set.has(page[i])) {
                    set.add(page[i]);
                    index.push(page[i]);
                    // Store the frequency of each page
                    freq.set(page[i], 1);
                    pageFaults++;
                    pageFaultsInfo.push(true);
                } else {
                    // Increase the frequency of the page
                    freq.set(page[i], freq.get(page[i]) + 1);
                    pageFaultsInfo.push(false);
                }
            } else {
                if (!set.has(page[i])) {
                    // Find the least frequently used page
                    let lfu = Number.MAX_VALUE;
                    let val;
                    for (let i = 0; i < set.size; i++) {
                        let item = Array.from(set)[i];
                        if (freq.get(item) < lfu) {
                            lfu = freq.get(item);
                            val = item;
                        } else if (freq.get(item) === lfu) {

                            if (index.indexOf(item) < index.indexOf(val)) {
                                lfu = freq.get(item);
                                val = item;
                            }
                        }
                    }

                    // Remove the least frequently used page
                    let arr = Array.from(set);
                    let valIndex = arr.indexOf(val);
                    if (valIndex !== -1) {
                        arr[valIndex] = page[i];
                    }
                    set = new Set(arr);
                    index.push(page[i]);
                    // frequency check from the start
                    // if (freq.has(page[i])) {
                    //     freq.set(page[i], freq.get(page[i]) + 1);
                    // } else {
                        // frequency set when page is added again
                        freq.set(page[i], 1);
                    // }

                    pageFaults++;
                    pageFaultsInfo.push(true);
                } else {
                    // Increase the frequency of the page
                    freq.set(page[i], freq.get(page[i]) + 1);
                    pageFaultsInfo.push(false);
                }
            }
            allSets.push(Array.from(set));
        }
    }
    // most frequently used
    else if (algorithm == "MFU") {
        let freq = new Map();
        var index = [];
        for (let i = 0; i < page.length; i++) {
            if (set.size < frames) {
                // if page not in the set then add it to the set
                if (!set.has(page[i])) {
                    set.add(page[i]);
                    index.push(page[i]);
                    // Store the frequency of each page
                    freq.set(page[i], 1);
                    pageFaults++;
                    pageFaultsInfo.push(true);
                } else {
                    // Increase the frequency of the page
                    freq.set(page[i], freq.get(page[i]) + 1);
                    pageFaultsInfo.push(false);
                }
            } else {
                if (!set.has(page[i])) {
                    // Find the most frequently used page
                    let mfu = Number.MIN_VALUE;
                    let val;
                    for (let i = 0; i < set.size; i++) {
                        let item = Array.from(set)[i];
                        if (freq.get(item) > mfu) {
                            mfu = freq.get(item);
                            val = item;
                        } else if (freq.get(item) === mfu) {
                            if (index.indexOf(item) < index.indexOf(val)) {
                                mfu = freq.get(item);
                                val = item;
                            }
                        }
                    }
                    // Remove the least frequently used page
                    let arr = Array.from(set);
                    let valIndex = arr.indexOf(val);
                    if (valIndex !== -1) {
                        arr[valIndex] = page[i];
                    }
                    set = new Set(arr);
                    index.push(page[i]);
                    freq.set(page[i], 1);
                    pageFaults++;
                    pageFaultsInfo.push(true);
                } else {
                    // Increase the frequency of the page
                    freq.set(page[i], freq.get(page[i]) + 1);
                    pageFaultsInfo.push(false);
                }
            }
            allSets.push(Array.from(set));
        }
    }
    // second chance
    else {
        let referenceBit = new Map();
        let index = 0;
        for (let i = 0; i < page.length; i++) {
            if (set.size < frames) {
                // if page not in the set then add it to the set
                if (!set.has(page[i])) {
                    set.add(page[i]);
                    pageFaults++;
                    pageFaultsInfo.push(true);
                    referenceBit.set(page[i], 0);
                } else {
                    referenceBit.set(page[i], 1);
                    pageFaultsInfo.push(false);
                }
            } else {
                if (!set.has(page[i])) {
                    // Find the page with reference bit 0
                    while (true) {
                        // Modulus operation to get the index of the page
                        let val = index % frames;
                        if (referenceBit.get(Array.from(set)[val]) === 0) {
                            let arr = Array.from(set);
                            arr[val] = page[i];
                            set = new Set(arr);
                            referenceBit.set(Array.from(set)[val], 0);
                            pageFaults++;
                            pageFaultsInfo.push(true);
                            index++;
                            break;
                        } else {
                            referenceBit.set(Array.from(set)[val], 0);
                            index++;
                        }
                    }
                } else {
                    referenceBit.set(page[i], 1);
                    pageFaultsInfo.push(false);
                }
            }
            allSets.push(Array.from(set));
            // console.log(referenceBitInfo);
            referenceBitInfo.push(Array.from(referenceBit));
        }
    }
    return allSets;
}
function generateTable(refString, allSets, frames) {
    let table = document.createElement('table');
    table.style.border = '1px solid black';
    table.style.width = '100%';
    // Create the header row
    let headerRow = document.createElement('tr');
    let header = document.createElement('th');
    header.style.border = '1px solid black';
    header.textContent = 'Frames';
    headerRow.appendChild(header);
    for (let ref of refString) {
        let headerCell = document.createElement('th');
        headerCell.style.border = '1px solid black';
        headerCell.textContent = ref;
        headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);


    // Create the data rows
    for (let i = 0; i < frames; i++) {
        let row = document.createElement('tr');
        let header = document.createElement('th');
        header.textContent = `Frame ${i + 1}`;
        header.style.border = '1px solid black';
        row.appendChild(header);
        for (let set of allSets) {
            let cell = document.createElement('td');
            cell.style.border = '1px solid black';
            cell.style.textAlign = 'center';
            cell.textContent = set[i] !== undefined ? set[i] : '-';
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    let row = document.createElement('tr');
    let faultsHeader = document.createElement('th');
    faultsHeader.textContent = 'Page Faults';
    row.appendChild(faultsHeader);
    for (let info of pageFaultsInfo) {
        let cell = document.createElement('td');
        cell.style.border = '1px solid black';
        cell.style.textAlign = 'center';
        cell.textContent = info ? 'X' : '';
        row.appendChild(cell);
    }
    table.appendChild(row);
    let container = document.getElementById('visualize');
    container.innerHTML = '';
    container.appendChild(table);
    let conclusion = document.createElement('h6');
    conclusion.textContent = `Total page faults: ${pageFaults}`;
    container.appendChild(conclusion);

    // get max length of reference bit info
    let max = 0;
    for (let set of referenceBitInfo) {
        if (set.length > max) {
            max = set.length;
        }
    }

    if (algorithm.value === '2ND') {
        let referenceBitTable = document.createElement('table');
        referenceBitTable.style.border = '1px solid black';
        referenceBitTable.style.width = '100%';
        // Create the header row
        let referenceBitHeaderRow = document.createElement('tr');
        let referenceBitHeader = document.createElement('th');
        referenceBitHeader.style.border = '1px solid black';
        referenceBitHeader.textContent = 'Reference Bit';
        referenceBitHeaderRow.appendChild(referenceBitHeader);
        for (let ref of refString) {
            let headerCell = document.createElement('th');
            headerCell.style.border = '1px solid black';
            headerCell.textContent = ref;
            referenceBitHeaderRow.appendChild(headerCell);
        }
        referenceBitTable.appendChild(referenceBitHeaderRow);
        for (let i = 0; i < max; i++) {
            let row = document.createElement('tr');
            let header = document.createElement('th');
            header.textContent = ` `;
            header.style.border = '1px solid black';
            row.appendChild(header);
            for (let set of referenceBitInfo) {
                let cell = document.createElement('td');
                cell.style.border = '1px solid black';
                cell.style.textAlign = 'center';
                cell.textContent = set[i] !== undefined ? set[i] : '-';
                row.appendChild(cell);
            }
            referenceBitTable.appendChild(row);
        }
        container.appendChild(referenceBitTable);
    }
}

submit.addEventListener('click', function () {
    console.log(ref_string.value, ref_string.value.length)
    if (ref_string.value.length === 0) {
        ref_string.value = generateString();
    }
    
    // Get the new values
    let frames = parseInt(numOfFrames.value);
    let refStringArray = ref_string.value.split(' ');
    refStringArray = refStringArray.filter((item) => item !== '');
    console.log(refStringArray);
    let algo = algorithm.value;
    // Generate the sets
    let allSets = createPageFrames(refStringArray, frames, algo);
    // console.log(allSets);
    // Update the table
    generateTable(refStringArray, allSets, frames);
    // Update the conclusion
    // conclusion.textContent = `The number of page faults is ${pageFaults}`;
});