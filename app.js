import {getYoloV5Data, readTextFile} from './API.js';
// nav & app HTML elements
const navContainer = document.querySelector("#nav-container"),
      navOpen = document.querySelector("#nav-open"),
      appContainer = document.querySelector("#app-container"),
      scanTableContainer = document.querySelector("#scanner-table-container");
// NAVIGATION SCHEMA
const toggleNavOpen = (show=true) => {
    if (!show) {
        navOpen.style.top = "-100vh";
    } else {
        navOpen.style.top = "0";
    }
}
const toggleAppContainer = (showApp=true) => {
    if (!showApp) {
        appContainer.style.right = "-100vw";
    } else {
        appContainer.style.right = "0";
    }
}

let showNav = false,
    showApp = true;
const toggleNav = () => {
    showNav = !showNav;
    showApp = !showApp;
    toggleNavOpen(showNav);
    toggleAppContainer(showApp);
    displayApp(currentRunningApp);
}

// nav menu selection schema
const appsAvailable = ['home', 'scanner', 'issue', 'counter'];
const navItems = appsAvailable.map(navItem => {
    return document.getElementById(`nav-${navItem}`);
});
let selectedItemIndex = 0,
    navIndexLowerBound = 0,
    navIndexUpperBound = navItems.length - 1;
const navigateMenuToIndex = (index) => {
    if (index < navIndexLowerBound) index = navIndexLowerBound;
    if (index > navIndexUpperBound) index = navIndexUpperBound;
    navItems[index].style.color = 'yellow';
    navItems[index].style.fontSize = '6rem';
}
const resetNavMenuItemStyle = (index) => {
    navItems[index].style.color = 'white';
    navItems[index].style.fontSize = '5rem';
}
navigateMenuToIndex(0);

// APPS SCHEMA
var currentRunningApp = 'home';

const displayApp = function(appToRun='home') {
    //guarantee hide navigation and show app when displaying app
    //show app
    if (appToRun !== 'scanner') {
        cameraOutput.classList.add('hidden');
    }
    if (appToRun === 'home') {
        appContainer.style.display = "none";
    } else {
        appContainer.style.display = "block";
        switch (appToRun) {
            case 'scanner':
                //display scanner menu and components
                document.querySelector('#scanner-app').style.display = 'block';
                document.querySelector('#issue-app').style.display = 'none';
                document.querySelector('#counter-app').style.display = 'none';
                break;
            case 'issue':
                //display issue menu and components
                document.querySelector('#scanner-app').style.display = 'none';
                document.querySelector('#issue-app').style.display = 'block';
                document.querySelector('#counter-app').style.display = 'none';
                break;
            case 'counter':
                //display counter menu and components
                document.querySelector('#scanner-app').style.display = 'none';
                document.querySelector('#issue-app').style.display = 'none';
                document.querySelector('#counter-app').style.display = 'block';
                break;
            default:
                console.error("error in display app function; bad argument");
                break;
        }
    }
    currentRunningApp = appToRun;
}

navContainer.addEventListener("click", toggleNav);

appsAvailable.forEach((navItem) => {
    const navItemHtmlObject = document.querySelector(`#nav-${navItem}`);
    navItemHtmlObject.addEventListener("click", function(e) {
        toggleNav();
        displayApp(navItem);
    }, false);
});

// VIDEO SCHEMA

let constraints = {
    video: {
        facingMode: "user"
    },
    audio: false
};

const cameraView = document.querySelector("#camera--view"),
      cameraOutput = document.querySelector("#camera--output"),
      cameraSnapshot = document.querySelector("#camera--snapshot"),
      cameraTrigger = document.getElementById("camera--trigger");

function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            const track = stream.getTracks()[0];
            cameraView.srcObject = stream; //<video> html obj w/srcObject attribute
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}

cameraOutput.ontransitionstart = () => {
    cameraSnapshot.innerHTML="";
};

cameraTrigger.addEventListener("click", async function() {
    cameraOutput.classList.remove("hidden");
    cameraOutput.classList.remove("taken");
    cameraSnapshot.innerHTML="";
    const sensorCanvas = document.createElement("canvas");
    sensorCanvas.setAttribute("id", "camera--sensor");
    
    cameraSnapshot.appendChild(sensorCanvas);
    // canvasing
    // when camera is triggered,
    // 1. draw (frozen picture / cameraView / camera--view) onto canvas
    // 2. spread canvas on top of the video
    sensorCanvas.width = cameraView.videoWidth;
    sensorCanvas.height = cameraView.videoHeight;
    sensorCanvas.getContext("2d").drawImage(cameraView, 0, 0);
    // 3.0. get imageVariable (toDataURL gets png, but can convert png to string image)
    const imageVariable = sensorCanvas.toDataURL("image/webp");
    let image64_encoded = imageVariable.split(',')[1];
    const data = {'image' : image64_encoded}
    // 3.1. pass imageVariable to yolov5 and retrieve yolov5 as image
    const yolov5Data = await getYoloV5Data(data);
    const yolov5ImageText = yolov5Data['image-64'];
    // let yolov5Data = {"image-64": "", "name": {}};
    // cameraOutput.src = `data:image/png;base64,${yolov5ImageText}`;
    cameraOutput.classList.add("taken");
    const tableHTMLElement = createYoloStatsTable(yolov5Data);
    scanTableContainer.innerHTML = "";
    scanTableContainer.appendChild(tableHTMLElement);
    // 5. get image the name of item recognized and display
    // it to the user; follow figma design.
    // const itemFound = getItemName(yolov5FetchedData);
    // display itemFound
});

// COUNTER APP
// record icon interactivity schema
let recording = false;
const videoRecordButton = document.querySelector("#video--record--trigger");
const innerIcon0 = document.querySelector('#inner-record-icon-0');
const outerRecord0 = document.querySelector('#outer-record-0');
const hoverRecordBtn = () => {
    outerRecord0.classList.add('outer-record-circle-onhover');
    outerRecord0.classList.remove('outer-record-circle');
    if (recording) return;
    innerIcon0.classList.add('inner-record-icon-circle-onhover');
    innerIcon0.classList.remove('inner-record-icon-circle');
};
const mouseOutRecordBtn = () => {
    outerRecord0.classList.add('outer-record-circle');
    outerRecord0.classList.remove('outer-record-circle-onhover');
    if (recording) return;
    innerIcon0.classList.add('inner-record-icon-circle');
    innerIcon0.classList.remove('inner-record-icon-circle-onhover');
};
const clickRecordBtn = () => {
    hoverRecordBtn();
    recording = !recording;
    if (recording) {
        innerIcon0.classList.add('inner-record-icon-square');
        innerIcon0.classList.remove('inner-record-icon-circle');
        outerRecord0.style.backgroundColor = 'red';
    } else {
        innerIcon0.classList.add('inner-record-icon-circle');
        innerIcon0.classList.remove('inner-record-icon-square');
        outerRecord0.style.backgroundColor = 'rgb(0,0,0,0)';
    }
};
videoRecordButton.addEventListener("mouseover", hoverRecordBtn, false);
videoRecordButton.addEventListener("mouseout", mouseOutRecordBtn, false);
videoRecordButton.addEventListener("click", clickRecordBtn);

// stats table creation
// pass in tableHTMLElement = document.getElementById('stats-table');
function addHeaderToTable(tableHeaderRow, headerTitle, textAlign="end") {
    const th = document.createElement('th');
    th.style.fontSize = '24px';
    th.style.paddingRight = '10px';
    th.style.paddingLeft = '10px';
    th.style.textAlign = textAlign;
    th.textContent = headerTitle;
    th.classList.add('stats-table-text', 'stats-table-header');
    
    tableHeaderRow.appendChild(th);
}
function addRowToTable(tableHTMLElement, name, count) {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    const tdCount = document.createElement('td');
    tdName.style.fontSize = '24px';
    tdCount.style.fontSize = '24px';
    tdName.style.paddingRight = '10px';
    tdCount.style.paddingRight = '10px';
    tdName.style.paddingLeft = '10px';
    tdCount.style.paddingLeft = '10px';
    tdName.textContent = name.toUpperCase();
    tdName.style.textAlign = 'end';
    tdCount.textContent = count;
    [tdName, tdCount].forEach(td => {
        td.classList.add('stats-table-text');
    });
    tr.appendChild(tdName);
    tr.appendChild(tdCount);
    tableHTMLElement.appendChild(tr);
}
function createYoloStatsTable(yolov5Data) {
    if (yolov5Data == null) {
        console.log('null yolov5Data');
        return;
    }
    const tableHTMLElement = document.createElement("table");
    tableHTMLElement.style.width = '100%';
    const tableHeaderRow = document.createElement("tr");
    addHeaderToTable(tableHeaderRow, "Name");
    addHeaderToTable(tableHeaderRow, "Count", "start");
    tableHTMLElement.appendChild(tableHeaderRow);
    const keyList = Object.keys(yolov5Data["name"]);
    const dictOfItems = {}
    keyList.forEach(key => {
        const itemName = yolov5Data["name"][key];
        if (!(itemName in dictOfItems)) {
            dictOfItems[itemName] = 0;
        }
        dictOfItems[itemName] += 1;
    });
    const dictKeys = Object.keys(dictOfItems);
    for (let idx in Object.keys(dictOfItems)) {
        const itemName = dictKeys[idx];
        addRowToTable(tableHTMLElement, itemName, dictOfItems[itemName]);
    }
    return tableHTMLElement;
}

// Nav menu item navigation
const navigateNavMenu = (indexDelta) => {
    resetNavMenuItemStyle(selectedItemIndex);
    selectedItemIndex = selectedItemIndex+indexDelta;
    if (selectedItemIndex < navIndexLowerBound) {
        selectedItemIndex = navIndexUpperBound;
    }
    if (selectedItemIndex > navIndexUpperBound) {
        selectedItemIndex = navIndexLowerBound;
    }
    navigateMenuToIndex(selectedItemIndex);
}
document.onkeyup = function(event) {
    const key = event.key;
    if (showNav === true) {
        // if nav bar open, capture all inputs for nav bar
        switch(key) {
            case "ArrowLeft":
            case "ArrowUp":
                navigateNavMenu(-1);
                break;            
            case "ArrowRight":
            case "ArrowDown":
                navigateNavMenu(1);
                break;
            case "Enter":
                toggleNav();
                displayApp(appsAvailable[selectedItemIndex]);
                break;
            case " ":
                toggleNav();
            default:
                break;
        }
        return;
    }
    if (currentRunningApp === 'scanner') {
        switch (key) {
            case "Enter":
                cameraTrigger.click();
                break;
            case " ":
                toggleNav();
                break;
            default:
                return;
        }
        return;
    }
    if (currentRunningApp === 'counter') {
        switch (key) {
            case "Enter":
                videoRecordButton.click();
                break;
            case " ":
                toggleNav();
                break;
            default:
                return;
        }
        return;
    }
    if (key === " ") {
        //space key is menu
        toggleNav();
    }
}

// INITIALIZING APP
const init = function() {
    toggleAppContainer(false);
    cameraStart();
}

window.addEventListener("load", init, false);