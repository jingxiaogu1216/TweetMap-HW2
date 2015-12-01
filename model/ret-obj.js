var generateReturnObject = function(success, message, data) {
    return {
        success: success,
        message: message,
        data: data
    }
}
exports.getOrdinaryReturnObject = function(
    success,
    message
    ){
    return generateReturnObject(success, message, undefined);
}
exports.getReturnObject = function(
    success,
    message,
    data
    ){
    return generateReturnObject(success, message, data);
}