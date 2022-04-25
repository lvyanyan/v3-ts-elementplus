export const resetObj = function (obj) {
    for (let i in obj) {
        obj[i] = ""
    }
}