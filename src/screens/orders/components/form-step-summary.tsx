import React, { JSX } from 'react';
import { View } from 'react-native';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Accordion, Container, Icon, PriceInfo, Text } from '@/components';
import DetailItem from '@/components/detail-item';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { formatCurrency, formatNumber } from '@/utils/formatter';
import { usePriceCalculations } from '../context/price-calculations-context';
import { OrderFormValues } from '../utils/order-form-schema';

export function FormStepSummary(): JSX.Element {
  const { t } = useTranslation();
  const { control } = useFormContext<OrderFormValues>();
  const { subTotal, insuranceFee, codFee, totalDiscount, grandTotal } =
    usePriceCalculations();

  const watchProducts = useWatch({
    control,
    name: 'step_item.products',
  });
  const watchShippingFee = useWatch({
    control,
    name: 'step_shipment.shipping_fee',
  });
  const watchPackingFee = useWatch({
    control,
    name: 'step_shipment.packing_fee',
  });
  const watchRecipient = useWatch({
    control,
    name: 'step_recipient',
  });
  const watchOrder = useWatch({
    control,
    name: 'step_order',
  });
  const watchItem = useWatch({
    control,
    name: 'step_item',
  });
  const watchShipment = useWatch({
    control,
    name: 'step_shipment',
  });

  function getRecipientName(): string {
    if (!watchRecipient) return '-';

    return watchRecipient.is_same_as_customer
      ? watchRecipient.customer.name
      : watchRecipient.name || '-';
  }

  function getRecipientPhone(): string {
    if (!watchRecipient) return '-';

    return watchRecipient.is_same_as_customer
      ? watchRecipient.customer.phone
      : watchRecipient.phone || '-';
  }

  function getRecipientEmail(): string {
    if (!watchRecipient) return '-';

    return watchRecipient.is_same_as_customer
      ? watchRecipient.customer.email
      : watchRecipient.email || '-';
  }

  return (
    <Container.Scroll
      contentContainerClassName="p-lg gap-md"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Text variant="labelL">{t('order_form.order_summary')}</Text>
      <Container.Card className="p-md">
        <Accordion
          defaultExpanded={false}
          renderTitle={() => (
            <View className="gap-sm flex-row items-center">
              <Icon name="user" size="lg" className="text-foreground" />
              <Text variant="labelM">
                {t('order_form.recipient_information')}
              </Text>
            </View>
          )}
        >
          <View className="gap-md">
            <DetailItem
              label={t('order_form.customer.name')}
              value={watchRecipient?.customer?.name || '-'}
            />
            <DetailItem
              label={t('order_form.customer.phone')}
              value={watchRecipient?.customer?.phone || '-'}
            />
            <DetailItem
              label={t('order_form.customer.email')}
              value={watchRecipient?.customer?.email || '-'}
            />
            <DetailItem
              label={t('order_form.customer.full_address')}
              value={watchRecipient?.customer?.full_address || '-'}
            />
            <DetailItem
              label={t('order_form.name')}
              value={getRecipientName()}
            />
            <DetailItem
              label={t('order_form.phone')}
              value={getRecipientPhone()}
            />
            <DetailItem
              label={t('order_form.email')}
              value={getRecipientEmail()}
            />
            <DetailItem
              label={t('order_form.subdistrict')}
              value={watchRecipient?.subdistrict?.label || '-'}
            />
            <DetailItem
              label={t('order_form.country')}
              value={watchRecipient?.country || '-'}
            />
            <DetailItem
              label={t('order_form.province')}
              value={watchRecipient?.province || '-'}
            />
            <DetailItem
              label={t('order_form.city')}
              value={watchRecipient?.city || '-'}
            />
            <DetailItem
              label={t('order_form.district')}
              value={watchRecipient?.district || '-'}
            />
            <DetailItem
              label={t('order_form.postal_code')}
              value={watchRecipient?.postal_code || '-'}
            />
            <DetailItem
              label={t('order_form.full_address')}
              value={
                watchRecipient?.is_same_as_customer
                  ? watchRecipient?.customer?.full_address || '-'
                  : watchRecipient?.full_address || '-'
              }
            />
            <DetailItem
              label={t('order_form.remarks')}
              value={watchRecipient?.remarks || '-'}
            />
          </View>
        </Accordion>

        <Accordion
          defaultExpanded={false}
          renderTitle={() => (
            <View className="gap-sm flex-row items-center">
              <Icon name="info" size="lg" className="text-foreground" />
              <Text variant="labelM">{t('order_form.order_information')}</Text>
            </View>
          )}
        >
          <View className="gap-md">
            <DetailItem
              label={t('order_form.order_code')}
              value={watchOrder?.order_code || '-'}
            />
            <DetailItem
              label={t('order_form.payment_type')}
              value={watchOrder?.payment_type?.label || '-'}
            />
            <DetailItem
              label={t('order_form.payment_via')}
              value={watchOrder?.payment_method?.label || '-'}
            />
            <DetailItem
              label={t('order_form.store')}
              value={watchOrder?.store?.label || '-'}
            />
            <DetailItem
              label={t('order_form.warehouse')}
              value={watchOrder?.warehouse?.label || '-'}
            />
            <DetailItem
              label={t('order_form.checkout_time')}
              value={
                watchOrder?.checkout_time?.format('DD/MM/YYYY HH:mm') || '-'
              }
            />
            {watchOrder?.sales && (
              <DetailItem
                label={t('order_form.sales')}
                value={watchOrder.sales}
              />
            )}
            {watchOrder?.remarks && (
              <DetailItem
                label={t('order_form.remarks')}
                value={watchOrder.remarks}
              />
            )}
          </View>
        </Accordion>

        <Accordion
          defaultExpanded={false}
          renderTitle={() => (
            <View className="gap-sm flex-row items-center">
              <Icon name="product" size="lg" className="text-foreground" />
              <Text variant="labelM">{t('order_form.item_order')}</Text>
            </View>
          )}
        >
          <View className="gap-md">
            {watchItem?.products && watchItem.products.length > 0 ? (
              <>
                {watchItem.products.map((product, index) => (
                  <View
                    key={index}
                    className="gap-xs pb-sm border-border border-b"
                  >
                    <Text variant="labelS">{product.name}</Text>
                    <View className="flex-row justify-between">
                      <Text variant="bodyS" color="muted">
                        {product.sku}
                      </Text>
                      <Text variant="bodyS">
                        {product.quantity}x{' '}
                        {formatCurrency(Number(product.published_price))}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text variant="bodyS" color="muted">
                        {formatNumber(Number(product.weight))}g
                      </Text>
                      <Text variant="labelS">
                        {formatCurrency(
                          Number(product.published_price) *
                            (product.quantity || 0),
                        )}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            ) : null}
            <DetailItem
              label={t('order_form.package.weight')}
              value={`${formatNumber(watchItem?.package?.weight || 0)}g`}
            />
            {watchItem?.package?.length && (
              <DetailItem
                label={t('order_form.package.length')}
                value={`${watchItem.package.length} cm`}
              />
            )}
            {watchItem?.package?.width && (
              <DetailItem
                label={t('order_form.package.width')}
                value={`${watchItem.package.width} cm`}
              />
            )}
            {watchItem?.package?.height && (
              <DetailItem
                label={t('order_form.package.height')}
                value={`${watchItem.package.height} cm`}
              />
            )}
            {watchItem?.is_dropship && (
              <>
                <Text variant="labelS" className="mt-sm">
                  {t('order_form.dropshipping_information')}
                </Text>
                <DetailItem
                  label={t('order_form.dropshipper_name')}
                  value={watchItem.dropshipper_name || '-'}
                />
                <DetailItem
                  label={t('order_form.dropshipper_phone')}
                  value={watchItem.dropshipper_phone || '-'}
                />
                {watchItem.dropshipper_email && (
                  <DetailItem
                    label={t('order_form.dropshipper_email')}
                    value={watchItem.dropshipper_email}
                  />
                )}
                {watchItem.dropshipper_full_address && (
                  <DetailItem
                    label={t('order_form.dropshipper_full_address')}
                    value={watchItem.dropshipper_full_address}
                  />
                )}
              </>
            )}
          </View>
        </Accordion>

        <Accordion
          defaultExpanded={false}
          renderTitle={() => (
            <View className="gap-sm flex-row items-center">
              <Icon name="truck" size="lg" className="text-foreground" />
              <Text variant="labelM">
                {t('order_form.delivery_information')}
              </Text>
            </View>
          )}
        >
          <View className="gap-md">
            <DetailItem
              label={t('order_form.is_self_delivery')}
              value={
                watchShipment?.is_self_delivery
                  ? t('general.yes')
                  : t('general.no')
              }
            />
            <DetailItem
              label={t('order_form.logistic')}
              value={watchShipment?.logistic?.label || '-'}
            />
            {watchShipment?.is_self_delivery &&
              watchShipment?.logistic_name && (
                <DetailItem
                  label={t('order_form.logistic_name')}
                  value={watchShipment.logistic_name}
                />
              )}
            <DetailItem
              label={t('order_form.provider_name')}
              value={watchShipment?.logistic_provider_name || '-'}
            />
            <DetailItem
              label={t('order_form.service_name')}
              value={watchShipment?.logistic_service_name || '-'}
            />
            <DetailItem
              label={t('order_form.logistic_carrier')}
              value={watchShipment?.logistic_carrier || '-'}
            />
            {watchShipment?.tracking_number && (
              <DetailItem
                label={t('order_form.tracking_number')}
                value={watchShipment.tracking_number}
              />
            )}
            <DetailItem
              label={t('order_form.use_insurance')}
              value={
                watchShipment?.is_using_insurance
                  ? t('general.yes')
                  : t('general.no')
              }
            />
          </View>
        </Accordion>

        <PriceInfo
          label={`${t('order_form.subtotal')} (${watchProducts?.length || 0} ${t('order_form.item')})`}
          value={subTotal}
        />
        <PriceInfo
          label={t('order_form.shipping_fee')}
          value={watchShippingFee || 0}
        />
        <PriceInfo label={t('order_form.insurance_fee')} value={insuranceFee} />
        <PriceInfo label={t('order_form.cod_fee')} value={codFee} />
        <PriceInfo
          label={t('order_form.packing_fee_label')}
          value={watchPackingFee || 0}
        />
        <PriceInfo
          label={t('order_form.discount')}
          value={totalDiscount}
          error={totalDiscount > 0}
        />
        <PriceInfo
          label={t('order_form.total')}
          value={grandTotal}
          error={grandTotal < 0}
        />
      </Container.Card>
    </Container.Scroll>
  );
}
