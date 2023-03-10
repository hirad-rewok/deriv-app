import React from 'react';
import { Text, Button, Icon, Money, Popover } from '@deriv/components';
import { TPasswordBoxProps, TTradingPlatformAccounts, TCFDDashboardContainer } from '../Components/props.types';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { CFD_PLATFORMS, getCFDAccountDisplay, getCFDPlatformLabel, getCFDAccountKey, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { CFDAccountCopy } from '../Components/cfd-account-copy';
import { QRCode } from 'react-qrcode';
import {
    getDXTradeWebTerminalLink,
    getPlatformDXTradeDownloadLink,
    getPlatformMt5DownloadLink,
} from '../Helpers/constants';

type TAccountsType = 'dxtrade' | 'derivEZ' | 'cTrader';

type TDxTradeModalProps = {
    mt5_trade_account: Required<DetailsOfEachMT5Loginid>;
    is_eu_user: boolean;
    onPasswordManager: (
        arg1: string | undefined,
        arg2: string,
        arg3: string,
        arg4: string,
        arg5: string | undefined
    ) => void;
    toggleModal: () => void;
    dxtrade_tokens: TCFDDashboardContainer['dxtrade_tokens'];
    is_demo: string;
    type: TAccountsType;
};

export type TSpecBoxProps = {
    value: string | undefined;
    is_bold?: boolean;
};

type TDxtradeDesktopDownloadProps = {
    dxtrade_tokens: TCFDDashboardContainer['dxtrade_tokens'];
    is_demo: string;
};

const SpecBox = ({ value, is_bold }: TSpecBoxProps) => (
    <div className='cfd-trade-modal__spec-box'>
        <Text size='xs' weight={is_bold ? 'bold' : ''} className='cfd-trade-modal__spec-text'>
            {value}
        </Text>
        <CFDAccountCopy text={value} className='cfd-trade-modal__spec-copy' />
    </div>
);

const PasswordBox = ({ platform, onClick }: TPasswordBoxProps) => (
    <div className='cfd-trade-modal__password-box'>
        <div className='cfd-trade-modal__password-text'>
            <Popover
                alignment='right'
                message={localize(
                    'Use these credentials to log in to your {{platform}} account on the website and mobile apps.',
                    {
                        platform: getCFDPlatformLabel(platform),
                    }
                )}
                classNameBubble='cfd-trade-modal__password-tooltip'
                zIndex={9999}
            >
                <Text size='xs'>***************</Text>
            </Popover>
        </div>
        <Popover
            className='cfd-trade-modal__password-popover'
            alignment='left'
            message={localize('Change Password')}
            relative_render
            zIndex={9999}
        >
            <Button
                className='cfd-trade-modal__password-action'
                transparent
                onClick={onClick}
                icon={
                    <Icon
                        icon='IcEdit'
                        className='da-article__learn-more-icon'
                        custom_color='var(--text-less-prominent)'
                    />
                }
            />
        </Popover>
    </div>
);

const mobileDownloadLink = (platform: string, type: 'ios' | 'android' | 'huawei') => {
    return platform === CFD_PLATFORMS.MT5 ? getPlatformMt5DownloadLink(type) : getPlatformDXTradeDownloadLink(type);
};

const getTitle = (market_type: string, is_eu_user: boolean) => {
    if (is_eu_user) localize('MT5 CFDs');
    return market_type;
};

const DxtradeDesktopDownload = ({ dxtrade_tokens, is_demo }: TDxtradeDesktopDownloadProps) => {
    return (
        <React.Fragment>
            <a
                className='cfd-trade-modal__dxtrade-button'
                href={getDXTradeWebTerminalLink(
                    is_demo ? 'demo' : 'real',
                    dxtrade_tokens && dxtrade_tokens[is_demo ? 'demo' : 'real']
                )}
                target='_blank'
                rel='noopener noreferrer'
            >
                <Icon className='cfd-trade-modal__dxtrade-button-icon' icon='IcBrandDxtrade' width={32} height={32} />
                <div className='cfd-trade-modal__dxtrade-button-text'>
                    <Text color='colored-background' size='xxs' weight='bold'>
                        <Localize i18n_default_text='Web terminal' />
                    </Text>
                </div>
            </a>
        </React.Fragment>
    );
};

const DerivXTradeModal = ({
    mt5_trade_account,
    is_eu_user,
    onPasswordManager,
    toggleModal,
    dxtrade_tokens,
    is_demo,
    type,
}: TDxTradeModalProps) => {
    const getCompanyShortcode = () => {
        if (
            (mt5_trade_account.account_type === 'demo' &&
                mt5_trade_account.market_type === 'financial' &&
                mt5_trade_account.landing_company_short === 'labuan') ||
            mt5_trade_account.account_type === 'real'
        ) {
            return mt5_trade_account.landing_company_short;
        }
        return undefined;
    };

    const getHeadingTitle = () =>
        getCFDAccountDisplay({
            market_type: mt5_trade_account.market_type,
            sub_account_type: mt5_trade_account.sub_account_type,
            platform: CFD_PLATFORMS.MT5,
            is_eu: is_eu_user,
            shortcode: getCompanyShortcode(),
            is_mt5_trade_modal: true,
        });

    const differentQRCodes = (acc_type: TAccountsType) => {
        if (acc_type === 'dxtrade') {
            return (
                <>
                    <QRCode
                        value={mobileDownloadLink('dxtrade', 'android')}
                        size={5}
                        style={{ height: 'auto', maxWidth: '100%', width: qr_code_mobile }}
                    />
                    <Text align='center' size='xxs'>
                        {localize('Scan the QR code to download Deriv X.')}
                    </Text>
                </>
            );
        } else if (acc_type === 'cTrader') {
            return (
                <>
                    <QRCode
                        value={mobileDownloadLink('dxtrade', 'android')}
                        size={5}
                        style={{ height: 'auto', maxWidth: '100%', width: qr_code_mobile }}
                    />
                    <Text align='center' size='xxs'>
                        {localize('Scan the QR code to download cTrader.')}
                    </Text>
                </>
            );
        } else if (acc_type === 'derivEZ') {
            return (
                <>
                    <QRCode
                        value={mobileDownloadLink('dxtrade', 'android')}
                        size={5}
                        style={{ height: 'auto', maxWidth: '100%', width: qr_code_mobile }}
                    />
                    <Text align='center' size='xxs'>
                        {localize('Scan the QR code to download Deriv EZ.')}
                    </Text>
                </>
            );
        }
        return undefined;
    };

    const mobileLinks = (type_of_acc: TAccountsType) => {
        if (type_of_acc === 'cTrader') {
            return (
                <div className='cfd-trade-modal__download-center-options--mobile-links--apple'>
                    <a href={getPlatformDXTradeDownloadLink('ios')} target='_blank' rel='noopener noreferrer'>
                        <Icon icon='IcInstallationApple' width={isMobile() ? '160' : '130'} height={40} />
                    </a>
                </div>
            );
        } else if (type_of_acc === 'dxtrade') {
            return (
                <a href={getPlatformDXTradeDownloadLink('android')} target='_blank' rel='noopener noreferrer'>
                    <Icon icon='IcInstallationGoogle' width={135} height={40} />
                </a>
            );
        } else if (type_of_acc === 'derivEZ') {
            return (
                <div className='cfd-trade-modal__download-center-options--mobile-links--huawei'>
                    <a href={getPlatformDXTradeDownloadLink('huawei')} target='_blank' rel='noopener noreferrer'>
                        <Icon icon='IcInstallationHuawei' width={135} height={40} />
                    </a>
                </div>
            );
        }
        return undefined;
    };

    const downloadCenterAppOption = (account_type: TAccountsType) => {
        if (account_type === 'dxtrade') {
            return (
                <>
                    <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                        {localize('Run Deriv X on your browser')}
                    </Text>
                    <DxtradeDesktopDownload is_demo={is_demo} dxtrade_tokens={dxtrade_tokens} />
                </>
            );
        } else if (account_type === 'cTrader') {
            return (
                <>
                    <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                        {localize('Run Deriv X on your browser')}
                    </Text>
                    <DxtradeDesktopDownload is_demo={is_demo} dxtrade_tokens={dxtrade_tokens} />
                </>
            );
        } else if (account_type === 'derivEZ') {
            return (
                <>
                    <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                        {localize('Run Deriv X on your browser')}
                    </Text>
                    <DxtradeDesktopDownload is_demo={is_demo} dxtrade_tokens={dxtrade_tokens} />
                </>
            );
        }
        return undefined;
    };

    const qr_code_mobile = isMobile() ? '100%' : '80%';

    return (
        <div className='cfd-trade-modal-container'>
            <div className='cfd-trade-modal'>
                {type === 'dxtrade' && <Icon icon='IcBrandDxtrade' size={24} />}
                {type === 'derivEZ' && <Icon icon='IcBrandDxtrade' size={24} />}
                {type === 'cTrader' && <Icon icon='IcBrandDxtrade' size={24} />}
                <div className='cfd-trade-modal__desc'>
                    <Text size='xs' line_height='l' className='cfd-trade-modal__desc-heading'>
                        {getHeadingTitle()}
                    </Text>
                    {(mt5_trade_account as TTradingPlatformAccounts)?.display_login && (
                        <Text color='less-prominent' size='xxxs' line_height='xxxs'>
                            {(mt5_trade_account as TTradingPlatformAccounts)?.display_login}
                        </Text>
                    )}
                </div>
                {mt5_trade_account?.display_balance && (
                    <Text size='xs' color='profit-success' className='cfd-trade-modal__desc-balance' weight='bold'>
                        <Money
                            amount={mt5_trade_account.display_balance}
                            currency={mt5_trade_account.currency}
                            has_sign={!!mt5_trade_account.balance && mt5_trade_account.balance < 0}
                            show_currency
                        />
                    </Text>
                )}
            </div>
            <div className='cfd-trade-modal__login-specs'>
                <div className='cfd-trade-modal__login-specs-item'>
                    <Text className='cfd-trade-modal--paragraph'>{localize('Username')}</Text>
                    <SpecBox is_bold value={(mt5_trade_account as TTradingPlatformAccounts)?.login} />
                </div>
                {type === 'dxtrade' && (
                    <div className='cfd-trade-modal__login-specs-item'>
                        <Text className='cfd-trade-modal--paragraph'>{localize('Password')}</Text>
                        <div className='cfd-trade-modal--paragraph'>
                            <PasswordBox
                                platform='dxtrade'
                                onClick={() => {
                                    const account_type = getCFDAccountKey({
                                        market_type: mt5_trade_account.market_type,
                                        sub_account_type: mt5_trade_account.sub_account_type,
                                        platform: CFD_PLATFORMS.DMT5,
                                        shortcode: mt5_trade_account.landing_company_short,
                                    });
                                    onPasswordManager(
                                        mt5_trade_account?.login,
                                        getTitle(mt5_trade_account.market_type, is_eu_user),
                                        mt5_trade_account.account_type,
                                        account_type,
                                        (mt5_trade_account as DetailsOfEachMT5Loginid)?.server
                                    );
                                    toggleModal();
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className='cfd-trade-modal__maintenance'>
                    <Icon
                        icon='IcAlertWarning'
                        size={isMobile() ? 28 : 20}
                        className='cfd-trade-modal__maintenance-icon'
                    />
                    <div className='cfd-trade-modal__maintenance-text'>
                        <Localize i18n_default_text='Server maintenance starts at 06:00 GMT every Sunday and may last up to 2 hours. You may experience service disruption during this time.' />
                    </div>
                </div>
            </div>
            <div className='cfd-trade-modal__download-center-app'>
                <div className='cfd-trade-modal__download-center-app--option'>{downloadCenterAppOption(type)}</div>
            </div>
            <div className='cfd-trade-modal__download-center-options'>
                <div className='cfd-trade-modal__download-center-options--mobile-links'>{mobileLinks(type)}</div>
                <div className='cfd-trade-modal__download-center-options--qrcode'>{differentQRCodes(type)}</div>
            </div>
        </div>
    );
};

export default DerivXTradeModal;
