import { OSDetect } from '@deriv/shared';
import { TCFDsPlatformType, TMobilePlatforms } from 'Components/props.types';

const platformsText = (platform: TCFDsPlatformType) => {
    switch (platform) {
        case 'ctrader':
            return 'cTrader';
        case 'derivez':
            return 'EZ';
        case 'dxtrade':
            return 'X';
        default:
            return '';
    }
};

const REAL_DXTRADE_URL = 'https://dx.deriv.com';
const DEMO_DXTRADE_URL = 'https://dx-demo.deriv.com';

const CTRADER_DOWNLOAD_LINK = 'https://ctrader.com/download/';

const CTRADER_URL = 'https://ct-uat.deriv.com/info';

const DERIVEZ_URL = 'https://dqwsqxuu0r6t9.cloudfront.net/';

const DXTRADE_IOS_APP_URL = 'https://apps.apple.com/us/app/deriv-x/id1563337503';
const DXTRADE_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.deriv.dx';
const DXTRADE_HUAWEI_APP_URL = 'https://appgallery.huawei.com/app/C104633219';

const CTRADER_IOS_APP_URL = 'https://apps.apple.com/cy/app/ctrader/id767428811';
const CTRADER_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.spotware.ct&hl=en&gl=US';

const getBrokerName = () => 'Deriv Limited';

const getTopUpConfig = () => {
    return {
        minimum_amount: 1000,
        additional_amount: 10000,
    };
};

const getPlatformDXTradeDownloadLink = (platform?: TMobilePlatforms) => {
    switch (platform) {
        case 'ios':
            return DXTRADE_IOS_APP_URL;
        case 'huawei':
            return DXTRADE_HUAWEI_APP_URL;
        default:
            return DXTRADE_ANDROID_APP_URL;
    }
};

const getPlatformCTraderDownloadLink = (platform: TMobilePlatforms) => {
    switch (platform) {
        case 'ios':
            return CTRADER_IOS_APP_URL;
        case 'android':
            return CTRADER_ANDROID_APP_URL;
        case 'huawei':
            return '';
        default:
            return CTRADER_ANDROID_APP_URL;
    }
};

const getPlatformDerivEZDownloadLink = (platform: TMobilePlatforms) => {
    switch (platform) {
        case 'ios':
            return 'a';
        case 'android':
            return 'a';
        case 'huawei':
            return 'a';
        default:
            return '';
    }
};

const getPlatformMt5DownloadLink = (platform: string | undefined = undefined) => {
    switch (platform || OSDetect()) {
        case 'windows':
            return 'https://download.mql5.com/cdn/web/deriv.limited/mt5/derivmt5setup.exe';
        case 'linux':
            return 'https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux';
        case 'ios':
            return 'https://apps.apple.com/us/app/metatrader-5/id413251709';
        case 'macos':
            return 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg';
        case 'huawei':
            return 'https://appgallery.huawei.com/#/app/C102015329';
        case 'android':
            return 'https://download.mql5.com/cdn/mobile/mt5/android?server=Deriv-Demo,Deriv-Server';
        default:
            return getMT5WebTerminalLink({ category: 'real' }); // Web
    }
};

const getDXTradeWebTerminalLink = (category: string, token?: string) => {
    let url = category === 'real' ? REAL_DXTRADE_URL : DEMO_DXTRADE_URL;

    if (token) {
        url += `?token=${token}`;
    }

    return url;
};

const getCTraderWebTerminalLink = (category: string, token?: string) => {
    let url = CTRADER_URL;

    if (token) {
        url += `?token=${token}`;
    }

    return url;
};

const getMT5WebTerminalLink = ({
    category,
    loginid,
    server_name = 'Deriv-Server',
}: {
    category?: string;
    loginid?: string;
    server_name?: string;
}) => {
    const is_demo = category === 'demo';
    const server = is_demo ? 'Deriv-Demo' : server_name;
    const login = loginid ?? '';

    return `https://trade.mql5.com/trade?servers=${server}&trade_server=${server}${login && `&login=${login}`}`;
};

export {
    REAL_DXTRADE_URL,
    DEMO_DXTRADE_URL,
    CTRADER_URL,
    DERIVEZ_URL,
    CTRADER_DOWNLOAD_LINK,
    getBrokerName,
    platformsText,
    getPlatformDXTradeDownloadLink,
    getPlatformCTraderDownloadLink,
    getPlatformDerivEZDownloadLink,
    getPlatformMt5DownloadLink,
    getDXTradeWebTerminalLink,
    getCTraderWebTerminalLink,
    getMT5WebTerminalLink,
    getTopUpConfig,
};
