
//  得到元素到顶部的距离
function getOffsetTop(elem) {
    var top, clientTop, clientLeft, scrollTop, scrollLeft,
        doc = document.documentElement,
        body = document.body
    if (typeof elem.getBoundingClientRect !== "undefined") {
        top = elem.getBoundingClientRect().top
    } else {
        top = 0
    }
    clientTop = doc.clientTop || body.clientTop || 0
    scrollTop = window.pageYOffset || doc.scrollTop
    return (top + scrollTop - clientTop)
}

//  冒泡排序
function sortArr(arr, key) {
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j][key] > arr[j + 1][key]) {
                var tmp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = tmp
            }
        }
    }
    return arr
}

export {
    getOffsetTop,
    sortArr
}