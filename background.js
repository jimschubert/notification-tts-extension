"use strict";
var icon,
    delayMs,
    notifications = [],
    noop = function () {},
    defaultDelayMs = 1900,
    defaultIcon = "data:image/png;base64,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";

chrome.storage.local.get(["icon", "delay_timeout"], function (found) {
    if (!found) {
        return;
    }

    icon = found.icon || defaultIcon;
    delayMs = parseInt(found.delay_timeout, 10) || defaultDelayMs;
});

function resetIcon() {
    chrome.storage.local.set({icon: defaultIcon});
    icon = defaultIcon;
}

function changeIcon(dataUri) {
    chrome.storage.local.set({icon: dataUri});
    icon = dataUri;
}

function resetDelay() {
    chrome.storage.local.set({delay_timeout: defaultDelayMs});
    delayMs = defaultDelayMs;
}

function changeDelay(delay) {
    chrome.storage.local.set({delay_timeout: delay});
    delayMs = delay;
}

chrome.ttsEngine.onSpeak.addListener(function (utterance, options, sendTtsEvent) {
    var opt = {
        type: "basic",
        title: "",
        message: utterance,
        iconUrl: icon
    };

    var id = +new Date() + "";
    notifications.unshift(id);
    chrome.notifications.create(id, opt, function () {
        sendTtsEvent({'type': 'start', 'charIndex': 0 });

        setTimeout(function () {
            chrome.notifications.clear(id, function (wasCleared) {
                if (wasCleared) {
                    sendTtsEvent({'type': 'end', 'charIndex': utterance.length});
                }
            });
        }, delayMs);
    });
});

chrome.ttsEngine.onStop.addListener(function () {
    var id = notifications.shift();
    if (id) {
        chrome.notifications.clear(id, noop);
    }

    console.log("Stopped");
});
