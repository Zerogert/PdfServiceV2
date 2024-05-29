const puppeteer = require('puppeteer')

_instance = null;

async function launchBrowser(){
    console.info('Create browser instance.');

    return await puppeteer.launch({
        //works faster in this mode https://pptr.dev/guides/headless-modes
        headless: 'shell',
        dumpio: true}
    );
}

exports.getInstance = async function () {
    if(_instance){
        console.info('Browser instance is exist.');

        if(!_instance.connected){
            console.info('Browser is not connected.');
            _instance = launchBrowser();
        }

        return _instance;
    }

    _instance = await launchBrowser();
    return _instance;
}