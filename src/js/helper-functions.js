export function id(id) {
    return document.getElementById(id);
}

export function classs(className) {
    return document.getElementsByClassName(className);
}

export function elmnts(tagName) {
    return document.getElementsByTagName(tagName);
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}