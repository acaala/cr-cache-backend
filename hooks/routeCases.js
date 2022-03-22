
const pageRoute = (req, baseURL) => {
    let url;
    let label;
    switch(req) {
        case '/cr-home':
            url = baseURL;
            label  = 'cr-home';
            break;
        case '/cr-prices':
            url = `${baseURL}/prices`;
            label = 'cr-prices';
            break;
        case '/cr-news':
            url = `${baseURL}/news`;
            label = 'cr-news';
            break;
        case '/cr-nft':
            url = `${baseURL}/nft-calendar`;
            label = 'cr-nft';
            break;
        case '/cr-support':
            url = `${baseURL}/support`;
            label = 'cr-support';
            break;
        case '/cr-market-data':
            url = `${baseURL}/market-data`;
            label = 'cr-market-data';
            break;
        case '/cr-learn':
            url = `${baseURL}/learn`;
            label = 'cr-learn';
            break;
    }
    return { label, url }
}

const clearPageRoute = (req) => {
    let label;
    switch(req) {
        case '/cr-home-clear':
            label  = 'cr-home';
            break;
        case '/cr-prices-clear':
            label = 'cr-prices';
            break;
        case '/cr-news-clear':
            label = 'cr-news';
            break;
        case '/cr-nft-clear':
            label = 'cr-nft';
            break;
        case '/cr-support-clear':
            label = 'cr-support';
            break;
        case '/cr-market-data-clear':
            label = 'cr-market-data';
            break;
        case '/cr-learn-clear':
            label = 'cr-learn';
            break;
    }
    return label
}

const jsRoutes = (req, base, v) => {
    switch(req) {
        case '/js-main':
            label = 'js-main';
            url = `${base}main.js${v}`;
            break;
        case '/js-landing':
            label = 'js-landing';
            url = `${base}landing.js${v}`;
            break;
        case '/js-prices':
            label = 'js-prices';
            url = `${base}prices.js${v}`;
            break;
    }

    return label
}

const clearJsRoute = (req) => {
    switch(req) {
        case '/js-main-clear':
            label = 'js-main';
            break;
        case '/js-landing-clear':
            label = 'js-landing';
            break;
        case '/js-prices-clear':
            label = 'js-prices';
            break;
        case '/js-market-data-clear':
            label = 'js-market-data';
            break;
    }

    return label
}

const jsInfoRoute = (req) => {
    switch(req) {
        case '/js-main-info':
            label = 'js-main';
            break;
        case '/js-landing-info':
            label = 'js-landing';
            break;
        case '/js-prices-info':
            label = 'js-prices';
            break;
        case '/js-market-data-info':
            label = 'js-market-data';
            break;
    }

    return label
}

exports.pageRoute = pageRoute

exports.clearPageRoute = clearPageRoute

exports.jsRoutes = jsRoutes

exports.clearJsRoute = clearJsRoute

exports.jsInfoRoute = jsInfoRoute