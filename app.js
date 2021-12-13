const appContainer = document.querySelector("#app-container");

const toggleAppContainer = (show=true) => {
    if (!show) {
        appContainer.style.right = "-100vw";
    } else {
        appContainer.style.right = "0";
    }
}

// NAVIGATION SCHEMA
const navContainer = document.querySelector("#nav-container"),
      navOpen = document.querySelector("#nav-open");
const toggleNavOpen = (show=true) => {
    if (!show) {
        navOpen.style.top = "-100vh";
    } else {
        navOpen.style.top = "0";
    }
}
let showNav = false;
const openNav = () => {
    console.log("opening");
    showNav = true;
    toggleAppContainer(!showNav);
    toggleNavOpen(showNav);
}
const closeNav = () => {
    console.log("closing");
    showNav = false;
    toggleAppContainer(!showNav);
    toggleNavOpen(showNav);
}
navContainer.addEventListener("click", function() {
    if (showNav) {
        closeNav();
    } else {
        openNav();
    }
});

const navItems = ["home", "scanner", "issue", "counter"];
navItems.forEach((navItem) => {
    navItemHtmlObject = document.querySelector(`#nav-${navItem}`);
    navItemHtmlObject.addEventListener("click", function() {
        switch (navItem) {
            case "home":
                window.location.href='/#';
                console.log(`clicked ${navItem}`);
                break;
            case "scanner":
                // clear everything in the display area, display scanner app;
                console.log(`clicked ${navItem}`);
                break;
            case "issue":
                console.log(`clicked ${navItem}`);
                break;
            case "counter":
                console.log(`clicked ${navItem}`);
                break;
            default:
                console.log("error");
                break;
        }
    })
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