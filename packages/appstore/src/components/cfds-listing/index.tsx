import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import './cfds-listing.scss';
import { useStores } from 'Stores/index';
import { observer } from 'mobx-react-lite';
import AddOptionsAccount from 'Components/add-options-account';
import { isMobile, formatMoney } from '@deriv/shared';
import TradingAppCard from 'Components/containers/trading-app-card';
import { AvailableAccount, TDetailsOfEachMT5Loginid } from 'Types';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import GetMoreAccounts from 'Components/get-more-accounts';
import { Actions } from 'Components/containers/trading-app-card-actions';
import { getHasDivider } from 'Constants/utils';

type TDetailedExistingAccount = AvailableAccount &
    TDetailsOfEachMT5Loginid &
    Actions & {
        key: string;
    };

const CFDsListing = () => {
    const {
        client,
        modules: { cfd },
        traders_hub,
        common,
        ui,
    } = useStores();
    const {
        available_dxtrade_accounts,
        combined_cfd_mt5_accounts,
        selected_region,
        has_any_real_account,
        startTrade,
        is_real,
        getExistingAccounts,
        getAccount,
        toggleAccountTypeModalVisibility,
        can_get_more_cfd_mt5_accounts,
        selected_account_type,
        is_eu_user,
        is_demo_low_risk,
        no_MF_account,
        toggleAccountTransferModal,
        is_demo,
    } = traders_hub;

    const { toggleCompareAccountsModal, setAccountType } = cfd;
    const { is_landing_company_loaded } = client;
    const { setAppstorePlatform } = common;
    const { openDerivRealAccountNeededModal } = ui;
    const has_no_real_account = !has_any_real_account;
    const accounts_sub_text =
        !is_eu_user || is_demo_low_risk ? localize('Compare accounts') : localize('Account Information');

    const getMT5AccountAuthStatus = (current_acc_status: string) => {
        if (current_acc_status === 'proof_failed') {
            return 'failed';
        } else if (current_acc_status === 'verification_pending') {
            return 'pending';
        }
        return null;
    };

    const no_real_mf_account_eu_regulator = no_MF_account && is_eu_user && is_real;
    return (
        <ListingContainer
            title={
                !isMobile() && (
                    <div className='cfd-accounts__title'>
                        <Text size='sm' line_height='m' weight='bold'>
                            {localize('CFDs')}
                        </Text>
                        <div className='cfd-accounts__compare-table-title' onClick={toggleCompareAccountsModal}>
                            <Text key={0} color='red' size='xxs' weight='bold' styles={{ marginLeft: '1rem' }}>
                                <Localize i18n_default_text={accounts_sub_text} />
                            </Text>
                        </div>
                    </div>
                )
            }
            description={
                <Text size='xs' line_height='s'>
                    <Localize
                        i18n_default_text={
                            'Trade with leverage and tight spreads for better returns on successful trades. <0>Learn more</0>'
                        }
                        components={[<StaticUrl key={0} className='options' href='/dmt5' />]}
                    />
                </Text>
            }
        >
            {isMobile() && (
                <div className='cfd-accounts__compare-table-title' onClick={toggleCompareAccountsModal}>
                    <Text size='xs' color='red' weight='bold' line_height='s'>
                        <Localize i18n_default_text={accounts_sub_text} />
                    </Text>
                </div>
            )}

            {(is_real && has_no_real_account) ||
                (is_eu_user && no_MF_account && is_real && (
                    <div className='cfd-full-row'>
                        <AddOptionsAccount />
                    </div>
                ))}

            <div className='cfd-full-row' style={{ paddingTop: '2rem' }}>
                <Text size='xs' line_height='m' weight='bold'>
                    {localize('Deriv MT5')}
                </Text>
            </div>
            {is_landing_company_loaded ? (
                <>
                    {combined_cfd_mt5_accounts.map((existing_account: TDetailedExistingAccount, index: number) => {
                        const list_size = combined_cfd_mt5_accounts.length;
                        existing_account.status = 'proof_failed';

                        return (
                            <TradingAppCard
                                icon={existing_account.icon}
                                sub_title={existing_account?.sub_title}
                                name={existing_account?.name}
                                short_code_and_region={existing_account?.short_code_and_region}
                                platform={existing_account.platform}
                                description={existing_account.description}
                                key={existing_account.key}
                                type={existing_account.type}
                                availability={selected_region}
                                has_divider={(!is_eu_user || is_demo) && getHasDivider(index, list_size, 3)}
                                onAction={(e?: React.MouseEvent<HTMLButtonElement>) => {
                                    if (existing_account.type === 'get') {
                                        if ((has_no_real_account && is_real) || no_real_mf_account_eu_regulator) {
                                            openDerivRealAccountNeededModal();
                                        } else {
                                            setAccountType({
                                                category: selected_account_type,
                                                type: existing_account.market_type,
                                            });
                                            setAppstorePlatform(existing_account.platform);
                                            getAccount();
                                        }
                                    } else if (existing_account.type === 'transfer_trade') {
                                        if (e?.currentTarget?.name === 'transfer-btn') {
                                            toggleAccountTransferModal();
                                        } else {
                                            startTrade(existing_account.platform, existing_account);
                                        }
                                    }
                                }}
                                mt5_acc_auth_status={
                                    existing_account.status ? getMT5AccountAuthStatus(existing_account.status) : null
                                }
                            />
                        );
                    })}
                    {can_get_more_cfd_mt5_accounts && (
                        <GetMoreAccounts
                            onClick={toggleAccountTypeModalVisibility}
                            icon='IcAppstoreGetMoreAccounts'
                            title={localize('Get more')}
                            description={localize('Get more Deriv MT5 account with different type and jurisdiction.')}
                        />
                    )}
                </>
            ) : (
                <PlatformLoader />
            )}
            {!is_eu_user && (
                <div className='cfd-full-row'>
                    <hr className='divider' />
                </div>
            )}
            {available_dxtrade_accounts?.length > 0 && (
                <div className='cfd-full-row'>
                    <Text size='xs' line_height='m' weight='bold'>
                        {localize('Other CFDs')}
                    </Text>
                </div>
            )}
            {is_landing_company_loaded ? (
                available_dxtrade_accounts?.map((account: AvailableAccount) => {
                    const existing_accounts = getExistingAccounts(account.platform, account.market_type);
                    const has_existing_accounts = existing_accounts.length > 0;
                    return has_existing_accounts ? (
                        existing_accounts.map((existing_account: TDetailsOfEachMT5Loginid) => (
                            <TradingAppCard
                                icon={account.icon}
                                sub_title={account.name}
                                name={`${formatMoney(
                                    existing_account.currency,
                                    existing_account.display_balance,
                                    true
                                )} ${existing_account.currency}`}
                                description={existing_account.display_login}
                                platform={account.platform}
                                key={`trading_app_card_${existing_account.display_login}`}
                                type='transfer_trade'
                                availability={selected_region}
                                onAction={() => {
                                    startTrade(account.platform, existing_account);
                                }}
                            />
                        ))
                    ) : (
                        <TradingAppCard
                            icon={account.icon}
                            name={account.name}
                            platform={account.platform}
                            description={account.description}
                            onAction={() => {
                                if (has_no_real_account && is_real) {
                                    ui.openDerivRealAccountNeededModal();
                                } else {
                                    setAccountType({
                                        category: selected_account_type,
                                        type: account.market_type,
                                    });
                                    setAppstorePlatform(account.platform);
                                    getAccount();
                                }
                            }}
                            key={`trading_app_card_${account.name}`}
                            type='get'
                            availability={selected_region}
                        />
                    );
                })
            ) : (
                <PlatformLoader />
            )}
        </ListingContainer>
    );
};

export default observer(CFDsListing);
