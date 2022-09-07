// nav & app HTML elements
const navContainer = document.querySelector("#nav-container"),
      navOpen = document.querySelector("#nav-open"),
      appContainer = document.querySelector("#app-container");

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

// APPS SCHEMA
var currentRunningApp = 'home';
const appsAvailable = ['home', 'scanner', 'issue', 'counter'];

const displayApp = function(appToRun='home') {
    //guarantee hide navigation and show app when displaying app
    //show app
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
    navItemHtmlObject = document.querySelector(`#nav-${navItem}`);
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
            track = stream.getTracks()[0];
            cameraView.srcObject = stream; //<video> html obj w/srcObject attribute
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}

cameraOutput.ontransitionstart = () => {
    cameraSnapshot.innerHTML="";
};

const getImageCounts = (yolov5FetchedData) => {
    // pretend this returns dict s.t. {key = item_name, value=count}
    return yolov5FetchedData.getImageCounts(); 
}

const getItemName = (yolov5FetchedData) => {
    // returns the name of the first item on list recognized 
    // returns string
    return yolov5FetchedData.getItemName();
}

async function postData(url, data) {
    // Default options are marked with *
    // console.log(JSON.stringify(data))
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

cameraTrigger.addEventListener("click", function() {
    cameraOutput.classList.remove("hidden");
    cameraOutput.classList.remove("taken");
    cameraSnapshot.innerHTML="";
    const sensorCanvas = document.createElement("canvas");
    const yolov5APIUrl = "http://127.0.0.1:5000/postfile"
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
    // only using the base64 encoded as param
    let image64_encoded = imageVariable.split(',')[1]
    // console.log(imageVariable);
    data = {'image' : image64_encoded}
    console.log(postData(yolov5APIUrl, data))
    // console.log(yolov5FetchedData)
    // const yolov5Frame = yolov5FetchedData.getFrame();
    const yolov5Frame = imageVariable;
    // 4. Place camera output as a small box on the upper right corner
    cameraOutput.src = yolov5Frame;
    cameraOutput.classList.add("taken");
    // 5. get image the name of item recognized and display
    // it to the user; follow figma design.
    // const itemFound = getItemName(yolov5FetchedData);
    // display itemFound
});

document.onkeyup = function(event) {
    if (event.key === "Enter") {
        if (currentRunningApp === 'scanner') {
            cameraTrigger.click();
        }
    }
    if (event.key === " ") {
        //space key is menu
        toggleNav();
    }
}

// COUNTER APP
// icon interactivity schema
let recording = false;
const videoRecordButton = document.querySelector("#video--record--trigger");
const innerIcon0 = document.querySelector('#inner-record-icon-0');
const outerRecord0 = document.querySelector('#outer-record-0');
let currentIcon
videoRecordButton.addEventListener("mouseover", () => {
    outerRecord0.classList.add('outer-record-circle-onhover');
    outerRecord0.classList.remove('outer-record-circle');
    if (recording) return;
    innerIcon0.classList.add('inner-record-icon-circle-onhover');
    innerIcon0.classList.remove('inner-record-icon-circle');
}, false);
videoRecordButton.addEventListener("mouseout", () => {
    outerRecord0.classList.add('outer-record-circle');
    outerRecord0.classList.remove('outer-record-circle-onhover');
    if (recording) return;
    innerIcon0.classList.add('inner-record-icon-circle');
    innerIcon0.classList.remove('inner-record-icon-circle-onhover');
}, false);
videoRecordButton.addEventListener("click", () => {
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
});

// INITIALIZING APP
const init = function() {
    toggleAppContainer(false);
    cameraStart();
}

window.addEventListener("load", init, false);