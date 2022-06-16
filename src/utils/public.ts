export const resetObj = function (obj) {
    for (let i in obj) {
        obj[i] = ""
    }
}
export const px2rem = function (val: any, px = "px") {
    let style: any = document.getElementsByTagName('html')[0].getAttribute('style');
    style = style?.split(":")[1];
    val = parseFloat(val);
    if (val < 0) {
        val = 0;
    }
    let rem = parseFloat(style);
    if (px) {
        return `${(val * rem * 10) / 1920 + px}`
    } else {
        return `${(val * rem * 10) / 1920}`
    }
}