import sampleJson from './sample.json' assert { type: "json" };;
async function postData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return response.json();
    } catch {
        return {'image-64': 'dummy'}; // parses JSON response into native JavaScript objects
    }
}

export async function getYoloV5Data(data) {
    const yolov5APIUrl = "http://127.0.0.1:5000/postfile";
    return postData(yolov5APIUrl, data);
};
export const fakeYolov5Json = sampleJson;

export function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}