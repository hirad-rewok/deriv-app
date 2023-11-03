import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, UILoader } from '@deriv/components';
import { MARKET_TYPE } from '../../Helpers/cfd-config';
import JurisdictionModalTitle from './jurisdiction-modal-title';
import { TJurisdictionModalProps } from 'Types/containers.types';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import JurisdictionModalContentWrapper from './jurisdiction-modal-content-wrapper';
import { DynamicLeverageContext } from '../dynamic-leverage/dynamic-leverage-context';
import DynamicLeverageModalContent from '../dynamic-leverage/dynamic-leverage-modal-content';

const JurisdictionModal = observer(({ openPasswordModal }: TJurisdictionModalProps) => {
    const { traders_hub, ui, common, client } = useStore();

    const { show_eu_related_content } = traders_hub;
    const { disableApp, enableApp } = ui;
    const { platform } = common;
    const { is_eu } = client;

    const { account_type, is_jurisdiction_modal_visible, toggleJurisdictionModal } = useCfdStore();

    const [is_dynamic_leverage_visible, setIsDynamicLeverageVisible] = React.useState(false);

    const toggleDynamicLeverage: React.MouseEventHandler<HTMLSpanElement> = event => {
        event.stopPropagation();
        setIsDynamicLeverageVisible(!is_dynamic_leverage_visible);
    };

    const onJurisdictionModalToggle = () => {
        setIsDynamicLeverageVisible(false);
        toggleJurisdictionModal();
    };

    const modal_content = (
        <div
            data-testid='modal_content'
            className={classNames('jurisdiction-modal__wrapper', {
                'jurisdiction-modal__flipped': is_dynamic_leverage_visible,
            })}
        >
            <JurisdictionModalContentWrapper openPasswordModal={openPasswordModal} />
            {account_type.type === MARKET_TYPE.FINANCIAL && !is_eu && <DynamicLeverageModalContent />}
        </div>
    );

    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <DynamicLeverageContext.Provider value={{ is_dynamic_leverage_visible, toggleDynamicLeverage }}>
                    <DesktopWrapper>
                        <Modal
                            className='jurisdiction-modal'
                            disableApp={disableApp}
                            enableApp={enableApp}
                            exit_classname='cfd-modal--custom-exit'
                            is_open={is_jurisdiction_modal_visible}
                            toggleModal={onJurisdictionModalToggle}
                            type='button'
                            width={account_type.type === MARKET_TYPE.FINANCIAL ? '1200px' : '1040px'}
                            has_close_icon={!is_dynamic_leverage_visible}
                            title={
                                <JurisdictionModalTitle
                                    show_eu_related_content={show_eu_related_content}
                                    account_type={account_type.type}
                                    platform={platform}
                                />
                            }
                        >
                            {modal_content}
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='deriv_app'
                            visible={is_jurisdiction_modal_visible}
                            onClose={onJurisdictionModalToggle}
                            has_close_icon={!is_dynamic_leverage_visible}
                            header_classname='jurisdiction-modal__header'
                            title={
                                <JurisdictionModalTitle
                                    show_eu_related_content={show_eu_related_content}
                                    account_type={account_type.type}
                                    platform={platform}
                                />
                            }
                        >
                            {modal_content}
                        </MobileDialog>
                    </MobileWrapper>
                </DynamicLeverageContext.Provider>
            </React.Suspense>
        </div>
    );
});

export default JurisdictionModal;
