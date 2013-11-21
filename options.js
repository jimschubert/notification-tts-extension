"use strict";
var ms,
    alertBlock,
    delayElem,
    inSecondsElem,
    btnSaveDelay,
    btnResetDelay,
    defaultIconDataUri,
    currentIconDataUri,
    uploadedIconDataUri,
    canvasCurrentCtx,
    canvasUploadedCtx,
    btnSaveIcon,
    btnResetIcon,
    iconUploader,
    alertTimeoutId,
    emptyCanvas = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALUlEQVRYR+3QQREAAAABQfqXFsNnFTizzXk99+MAAQIECBAgQIAAAQIECBAgMBo/ACHo7lH9AAAAAElFTkSuQmCC";

function $get(id){
    return document.getElementById(id);
}

function reloadFromBackground() {
    chrome.runtime.getBackgroundPage(function (bg) {
        // set ms to the current setting
        ms = bg.delayMs;
        delayElem.value = ms;
        setInSecondsValue(ms);

        // get the data uri of the default and current icon
        defaultIconDataUri = bg.defaultIcon;
        currentIconDataUri = bg.icon;

        setCanvasImage(canvasCurrentCtx, currentIconDataUri);
    });
}
function init(){
    delayElem = $get("delayMs");
    inSecondsElem = $get("inSeconds");
    btnSaveDelay = $get("btnSaveDelay");
    btnResetDelay = $get("btnResetDelay");
    canvasCurrentCtx = $get("iconBefore").getContext("2d");
    canvasUploadedCtx = $get("iconAfter").getContext("2d");
    btnSaveIcon = $get("btnSaveIcon");
    btnResetIcon = $get("btnResetIcon");
    iconUploader = $get("iconUploader");
    alertBlock = document.querySelector(".alert");

    reloadFromBackground();

    delayElem.addEventListener("change", handleDelayChange, true);
    iconUploader.addEventListener("change", handleUpload, true);

    btnSaveDelay.addEventListener("click", handleDelaySave, true);
    btnResetDelay.addEventListener("click", handleResetDelay, true);

    btnSaveIcon.addEventListener("click", handleIconSave, true);
    btnResetIcon.addEventListener("click", handleResetIcon, true);
}

function setInSecondsValue(ms) {
    inSecondsElem.innerText = parseFloat(ms) / 1000;
}

function handleDelayChange(evt) {
    setInSecondsValue(evt.target.value);
}

function handleUpload() {
    var file = iconUploader.files[0];
    var reader = new FileReader();

    reader.onloadend = function (evt) {
        uploadedIconDataUri = evt.target.result;
        var img = new Image();
        img.onload = function() {
            if(this.width !== this.height) {
                uploadedIconDataUri = "";
                displayAlert("Image must be square, preferably 32x32.");
            } else {
                console.log("Uploaded file dataUri: " + uploadedIconDataUri);
                setCanvasImage(canvasUploadedCtx, uploadedIconDataUri);
            }
        };
        img.src = uploadedIconDataUri;
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        uploadedIconDataUri = "";
    }
}

function handleDelaySave() {
    chrome.runtime.getBackgroundPage(function(bg){
        var value = parseFloat(delayElem.value);
        bg.changeDelay(value);
        displayAlert("Delay set to " + (value/1000) + " seconds");

        reloadFromBackground();
    });
}

function handleIconSave() {
    var uploaded = $get('iconAfter').toDataURL();
    if(uploaded === emptyCanvas) {
        uploadedIconDataUri = "";
        return displayAlert("You must first choose an icon file!");
    }

    // set the cached value to 32x32. Probably not needed, but whatever.
    uploadedIconDataUri = uploaded;

    return chrome.runtime.getBackgroundPage(function(bg){
        bg.changeIcon(uploaded);
        displayAlert("Icon was updated!");

        reloadFromBackground();
    });
}

function handleResetDelay(){
    chrome.runtime.getBackgroundPage(function(bg){
        bg.resetDelay();
        displayAlert("Delay reset to default");

        reloadFromBackground();
    });
}

function handleResetIcon(){
    chrome.runtime.getBackgroundPage(function(bg){
        bg.resetIcon();
        displayAlert("Icon reset to default");

        reloadFromBackground();
    });
}

function displayAlert(msg) {
    clearTimeout(alertTimeoutId);
    alertBlock.innerText = msg;
    toggleClass(alertBlock, "hide", "show");
    alertTimeoutId = setTimeout(function(){
        toggleClass(alertBlock, "show", "hide");
    }, 3500);
}

function toggleClass(elem, from, to) {
    elem.className = elem.className.replace(new RegExp('\\b'+from+'\\b'), to);
}

function setCanvasImage(context, dataUri) {
    context.clearRect(0,0,32,32);
    var img = new Image();
    img.src = dataUri;

    context.drawImage(img, 0, 0, 32, 32);
}

window.addEventListener("DOMContentLoaded", init, true);
