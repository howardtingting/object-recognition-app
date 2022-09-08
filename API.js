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
    const yolov5APIUrl = "https//localhost:5000/postData";
    return postData(yolov5APIUrl, data);
}