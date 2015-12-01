/**
 * Created by huisu on 10/18/15.
 */

var tweetmap = tweetmap || {}
tweetmap.utils = tweetmap.utils || {}

tweetmap.utils.notice = function (type, msg) {
    //TODO
//    alert(msg);
}

tweetmap.utils.callUrlDirectly = function (url, params, method, dataType, callBack) {
    $.ajaxSettings.async = false;
    var restAction = $.ajax({
        async: false,
        url: url,
        type: method,
        data: params,
        dataType: dataType
    });
    restAction.done(callBack);
    restAction.fail(
        function (jqXHR, textStatus) {
            throw new Error('data error');
        }
    );
}
tweetmap.utils.callUrl = function (url, params, method, dataType, callBack) {
    //inf functions
    tweetmap.utils.callUrlDirectly(
        url,
        params,
        method,
        dataType,
        function (data) {
            tweetmap.utils.checkWSRetObj(data, callBack)
        }
    );
}
tweetmap.utils.checkWSRetObj = function (data, callBack) {
    var isSuccess = function (result) {
        if (result.success) {
            return true;
        }
        return true;
    }
    if (isSuccess(data) && data) {
        callBack(data);
    } else {
        tweetmap.utils.notice('err', data.message);
    }
}

tweetmap.utils.constructDom = function (label, id) {
    var elem = $('<' + label + '></' + label + '>');
    if (id) {
        elem.attr('id', id);
    }
    return elem;
}

tweetmap.utils.urlParamsPatten = /\?[^#\/\0]*/g;

tweetmap.utils.getUrlParams = function () {
    var url = window.location.href;
    var getLastPattenMatchStr = function (patten, str) {
        return tweetmap.utils.getLastArrMember(str.match(patten));
    }
    var getUrlParamsStr = function () {
        return getLastPattenMatchStr(tweetmap.utils.urlParamsPatten, url);
    }
    var paramsStr = undefined
    if (paramsStr = getUrlParamsStr()) {
        return $.parseQuery(paramsStr);
    } else {
        return {};
    }
}

tweetmap.utils.getLastArrMember = function (arr) {
    return arr instanceof Array ? arr[arr.length - 1] : null;
}

tweetmap.utils.ngWebService = function (httpMethod, url, params, ngHttp, callBack, errorCallBack) {
    var successCallback = function (data, status, headers, config) {
        tweetmap.utils.checkWSRetObj(data, callBack);
    }
    var errorCallback = function (data, status, headers, config) {
        errorCallBack('data error');
    }
    var defaultErrorCallBack = function (data, status, headers, config) {
        tweetmap.utils.notice('err', 'data error');
    }
    ngHttp({
        method: httpMethod,
        url: url,
        params: params
    }).
        success(successCallback).
        error(errorCallBack ? errorCallback : defaultErrorCallBack);
}

tweetmap.utils.ngWebServiceSrc = function (httpMethod, url, params, ngHttp, callBack, errorCallBack) {
    var successCallback = function (data, status, headers, config) {
        callBack(data);
    }
    var errorCallback = function (data, status, headers, config) {
        errorCallBack('data error');
    }
    var defaultErrorCallBack = function (data, status, headers, config) {
        tweetmap.utils.notice('err', 'data error');
    }
    ngHttp({
        method: httpMethod,
        url: url,
        params: params
    }).
        success(successCallback).
        error(errorCallBack ? errorCallback : defaultErrorCallBack);
}

tweetmap.utils.appendUrlParams = function (urlStr, paramsObj) {
    var getParamsStr = function () {
        var paramsStr = '';
        for (var oneParamKey in paramsObj) {
            paramsStr += ('&' + oneParamKey + '=' + paramsObj[oneParamKey]);
        }
        return paramsStr;
    }
    if (urlStr.indexOf('?') > -1) {
        return urlStr + getParamsStr();
    } else {
        return urlStr + '?' + getParamsStr().slice(1);
    }
}
tweetmap.utils.replaceUrlParams = function (urlStr, paramsObj) {
    urlStr = urlStr.replace(tweetmap.utils.urlParamsPatten, '');
    return tweetmap.utils.appendUrlParams(urlStr, paramsObj);
}
tweetmap.utils.redirectTo = function (url) {
    window.location.href = url;
}