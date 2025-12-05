import React, { JSX } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import dayjs from 'dayjs';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import { useCSSVariable, withUniwind } from 'uniwind';

import { Chip, Container, Divider, Header, Text, Timeline } from '@/components';
import {
  ORDER_STATUS_CHIP_VARIANTS,
  ORDER_STORE_PLATFORMS,
  ORDER_STORE_PLATFORMS_LOGOS,
} from '@/constants/order';
import {
  useOrderDetailsQuery,
  useOrderHistoriesQuery,
} from '@/services/order/repository';
import { formatCurrency } from '@/utils/formatter';
import { statusToTranslationKey } from './utils/order-helpers';

const Image = withUniwind(ExpoImage);

type Params = {
  id: string;
};

export default function OrderDetailsScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const spacingLg = useCSSVariable('--spacing-lg') as number;
  const { id } = useLocalSearchParams<Params>();
  const { data, isRefetching, refetch, isLoading } = useOrderDetailsQuery(
    { select: (data) => data.order },
    id,
  );
  const { data: historiesData, isLoading: isHistoriesLoading } =
    useOrderHistoriesQuery({ select: (data) => data.histories }, id);

  return (
    <Container className="bg-background flex-1">
      <Header title={t('order_details.title')} />
      <Container.Scroll
        contentContainerClassName="p-lg rounded-md gap-sm"
        contentContainerStyle={{ paddingBottom: insets.bottom || spacingLg }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <Container.Card className="flex-row items-center justify-between">
          <View className="gap-sm flex-row items-center">
            {data?.store_platform && !isLoading && (
              <Image
                source={ORDER_STORE_PLATFORMS_LOGOS?.[data?.store_platform]}
                className="size-8"
                contentFit="contain"
              />
            )}
            <View className="gap-xxs">
              <Text
                variant="labelM"
                loading={isLoading}
                sharedTransitionTag={`store-${data?.store_id}`}
              >
                {data?.store_name}
              </Text>
              <Text variant="bodyXS" color="muted" loading={isLoading}>
                {data?.store_platform &&
                  ORDER_STORE_PLATFORMS?.[data?.store_platform]?.label}
              </Text>
              <Text variant="bodyXS" color="muted" loading={isLoading}>
                {dayjs(data?.created_at).format('DD MMMM YYYY, HH:mm')}
              </Text>
            </View>
          </View>
          {data?.internal_status && !isLoading && (
            <Chip
              label={t(
                `orders.status.${statusToTranslationKey(data.internal_status)}`,
              )}
              variant={
                ORDER_STATUS_CHIP_VARIANTS[data.internal_status].variant ??
                'blue'
              }
            />
          )}
        </Container.Card>
        <Container.Card>
          <Text variant="labelM" loading={isLoading}>
            {t('order_details.customer')}
          </Text>
          <View className="gap-sm flex-row items-center">
            {!isLoading && (
              <View className="bg-background border-border size-8 items-center justify-center rounded-full border">
                <Text variant="headingS" className="leading-none">
                  {data?.buyer_name.substring(0, 1)}
                </Text>
              </View>
            )}
            <Text loading={isLoading}>{data?.buyer_name}</Text>
          </View>
        </Container.Card>
        <Container.Card>
          <Text variant="labelM" loading={isLoading}>
            {t('order_details.order_summary')}
          </Text>
          <View className="gap-sm">
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.origin_warehouse')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {data?.location_name}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.payment_method')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {data?.payment_method}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.payment_type')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {data?.payment_via}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.courier')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {data?.logistic_carrier}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.actual_weight')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {data?.actual_package_weight}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.actual_price')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {formatCurrency(Number(data?.actual_shipping_price))}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.delivery_attempt')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {data?.delivery_attempt ?? 0}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.tracking_number')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {data?.tracking_number ?? '-'}
              </Text>
            </View>
          </View>
        </Container.Card>
        <Container.Card>
          <Text variant="labelM" loading={isLoading}>
            {t('order_details.products')}
          </Text>
          <FlatList
            data={[data?.active_products, data?.cancel_products]
              .flat()
              .filter(Boolean)}
            contentContainerClassName="gap-sm"
            keyExtractor={(item) => item?.order_detail_id?.toString() ?? ''}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View
                className={twMerge(
                  'gap-sm border-border p-sm pb-sm flex-row items-center rounded-md border',
                  item?.is_cancel
                    ? 'bg-danger-soft border-danger'
                    : 'border-border',
                )}
              >
                {item?.is_cancel && (
                  <View className="bg-danger py-xs px-sm absolute top-0 right-0 z-1 rounded-tr-sm rounded-bl-md">
                    <Text variant="labelXS" color="light">
                      {t('order_details.canceled')}
                    </Text>
                  </View>
                )}
                <Image
                  source={{ uri: item?.media_url }}
                  className="bg-muted size-12 rounded-md"
                  contentFit="cover"
                />
                <View className="gap-xs flex-1">
                  <Text variant="labelS" loading={isLoading}>
                    {item?.product_name}
                  </Text>
                  <Text variant="bodyXS" color="muted" loading={isLoading}>
                    {t('order_details.sku')}: {item?.sku}
                  </Text>
                  <View className="gap-md flex-row items-center justify-between">
                    <Text variant="bodyXS" color="muted" loading={isLoading}>
                      {item?.quantity} x {formatCurrency(item?.unit_price ?? 0)}
                    </Text>
                    <Divider
                      className={twMerge(
                        'bg-border h-px flex-1',
                        item?.is_cancel && 'bg-danger',
                      )}
                    />
                    <Text variant="labelXS" loading={isLoading}>
                      {formatCurrency(
                        Number(item?.sub_total_product_price ?? 0),
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        </Container.Card>
        <Container.Card>
          <Text variant="labelM" loading={isLoading}>
            {t('order_details.fees')}
          </Text>
          <View className="gap-sm">
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.subtotal')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {formatCurrency(Number(data?.sub_total_price ?? 0))}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.shipping_fee')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {formatCurrency(Number(data?.shipping_price ?? 0))}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.other_fee')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {formatCurrency(Number(data?.other_price ?? 0))}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.total_discount')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {formatCurrency(Number(data?.total_discount_price ?? 0))}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.cod_fee')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {formatCurrency(Number(data?.cod_price ?? 0))}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.seller_discount')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {formatCurrency(Number(data?.discount_seller ?? 0))}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">
                {t('order_details.shipping_discount')}
              </Text>
              <Text variant="labelS" loading={isLoading}>
                {formatCurrency(Number(data?.discount_shipping ?? 0))}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.packing_fee')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {formatCurrency(Number(data?.packing_price ?? 0))}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.insurance_fee')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {formatCurrency(Number(data?.insurance_price ?? 0))}
              </Text>
            </View>
            <Divider />
            <View className="flex-row items-center justify-between">
              <Text variant="labelS">{t('order_details.grand_total')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {formatCurrency(Number(data?.grand_total_order_price ?? 0))}
              </Text>
            </View>
          </View>
        </Container.Card>
        <Container.Card>
          <Text variant="labelM" loading={isLoading}>
            {t('order_details.shipping_address')}
          </Text>
          <View className="gap-sm">
            <Text variant="bodyS" loading={isLoading}>
              {data?.recipient_name}
            </Text>
            <Text variant="bodyS" loading={isLoading}>
              {data?.recipient_phone}
            </Text>
            <Text variant="bodyS" loading={isLoading}>
              {data?.recipient_email ?? '-'}
            </Text>
            <Text variant="bodyS" loading={isLoading}>
              {data?.recipient_full_address}
            </Text>
          </View>
        </Container.Card>
        <Container.Card>
          <Text variant="labelM" loading={isLoading}>
            {t('order_details.package_information')}
          </Text>
          <View className="gap-sm">
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.height_cm')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {data?.package_height}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.length_cm')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {data?.package_length}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.width_cm')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {data?.package_width}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">{t('order_details.weight_g')}</Text>
              <Text variant="labelS" loading={isLoading}>
                {data?.package_weight}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="bodyS">
                {t('order_details.chargeable_weight_g')}
              </Text>
              <Text variant="labelS" loading={isLoading}>
                {data?.chargeable_weight}
              </Text>
            </View>
          </View>
        </Container.Card>
        <Container.Card>
          <Text variant="labelM" loading={isLoading || isHistoriesLoading}>
            {t('order_details.activity_history')}
          </Text>
          <Timeline
            items={
              historiesData?.map((history) => ({
                status: 'pending',
                title: history.status,
                subtitle: history.activity,
                timestamp: dayjs(history.created_at).format(
                  'DD MMMM YYYY, HH:mm',
                ),
              })) ?? []
            }
          />
        </Container.Card>
      </Container.Scroll>
    </Container>
  );
}
