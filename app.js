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

navContainer.addEventListener("click", function() {
    if (showNav) {
        toggleNav();
    } else {
        toggleNav();
    }
});

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
      cameraTrigger = document.querySelector("#camera--trigger");

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

cameraTrigger.onclick = function() {
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
    // 3. Place camera output as a small box on the upper right corner
    cameraOutput.src = sensorCanvas.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
};

// INITIALIZING APP
const init = function() {
    toggleAppContainer(false);
    cameraStart();
}

window.addEventListener("load", init, false);