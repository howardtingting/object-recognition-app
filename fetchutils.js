export async function postData(url, data) {
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