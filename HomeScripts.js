var selection = 0;
var max = 3333;

function adjustIframeBox() {
    const iframe = document.getElementById('iframe');
    const iframeBox = document.getElementById('iframe-box');
    const maxHeight = window.innerHeight * 0.6;

    iframeBox.style.width = `${maxHeight}px`;
    iframeBox.style.height = `${maxHeight}px`;

    if (iframe.localName == "img") {
        iframe.style.width = `${maxHeight}px`;
        iframe.style.height = `${maxHeight}px`;
    }

    add()
}

document.getElementById('image-number').onblur = (event) => {
    document.getElementById('image-number').value = "";
}


document.onkeydown = (event) => {
    let a = document.getElementById('image-number');
    if (document.activeElement === a) {
        return;
    }
    if (event.key == "ArrowLeft") { previousContent() }
    if (event.key == "ArrowRight") { nextContent() }
};

function add() {

    let iframeDrop = document.getElementById('iframe').contentDocument;
    if (iframeDrop != undefined) {
        iframeDrop.addEventListener("dragleave", dragleave);
        iframeDrop.addEventListener("dragover", dragover);

        iframeDrop.onkeydown = (event) => {
            console.log(event)
            if (event.key == "ArrowLeft") { previousContent() }
            if (event.key == "ArrowRight") { nextContent() }
        };

        return;
    }
    iframeDrop = document.getElementById('iframe');
    if (iframeDrop != undefined) {
        iframeDrop.addEventListener("dragleave", dragleave);
        iframeDrop.addEventListener("dragover", dragover);

        return;
    }

}

function previousContent() {
    if (selection <= 0) {
        return;
    }
    selection--;
    
    document.getElementById("iframe-box").innerHTML = `<iframe id="iframe" src="scripts/${selection}.html" onload="adjustIframeBox()"></iframe>`
    add()
    document.getElementById("iframe-number").textContent = selection;
    adjustIframeBox()
}

function nextContent() {
    if (selection + 1 > max) {
        return;
    }
    selection++;
    
    document.getElementById("iframe-box").innerHTML = `<iframe id="iframe" src="scripts/${selection}.html" onload="adjustIframeBox()"></iframe>`
    add()
    document.getElementById("iframe-number").textContent = selection;
    adjustIframeBox()
}

window.addEventListener('resize', adjustIframeBox);

window.addEventListener("load", () => {
    
    document.getElementById("iframe-box").innerHTML = `<iframe id="iframe" src="scripts/${selection}.html" onload="adjustIframeBox()"></iframe>`
    add()
    document.getElementById("iframe-number").textContent = selection;
    adjustIframeBox()
})

function dragover(event) {
    event.preventDefault();
    console.log('File is inside the drag area');
};

function dragleave(event) {
    event.preventDefault();

    console.log('File left the drag area');

};

function goToImage() {

    let input = document.getElementById('image-number').value;
    let parsedInput = parseInt(input);
    if (!isNaN(parsedInput) && parsedInput >= 0 && parsedInput <= max) {
        selection = parsedInput;
    
        document.getElementById("iframe-box").innerHTML = `<iframe id="iframe" src="scripts/${selection}.html" onload="adjustIframeBox()"></iframe>`
        add()
        document.getElementById("iframe-number").textContent = selection;
        adjustIframeBox()
    }

}