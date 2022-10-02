import classNames from 'classnames';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { setWebsocket } from '@deriv/shared';
import Routes from 'Components/routes/routes';
import { useStores, initContext } from 'Stores';
import { TRootStore } from 'Types';
import Onboarding from './onboarding';
import { trading_hub_contents } from 'Constants/trading-hub-content';
import './app.scss';

type TAppProps = {
    passthrough: {
        root_store: TRootStore;
        WS: Record<string, any>;
    };
};

const App: React.FC<TAppProps> = ({ passthrough }: TAppProps) => {
    const { root_store, WS } = passthrough;
    initContext(root_store, WS);
    setWebsocket(WS);
    const { ui }: TRootStore = useStores();

    return (
        <main
            className={classNames('dashboard', {
                'theme--light': !ui.is_dark_mode_on,
                'theme--dark': ui.is_dark_mode_on,
            })}
        >
            <div className='dw-dashboard'>
                <Onboarding contents={trading_hub_contents} />
                <Routes />
            </div>
        </main>
    );
};

export default observer(App);
