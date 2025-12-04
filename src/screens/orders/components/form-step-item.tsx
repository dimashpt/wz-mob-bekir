import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BottomSheet,
  BottomSheetModal,
  Button,
  Container,
  Divider,
  Icon,
  InputField,
  Text,
  ToggleSwitch,
} from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { formatCurrency, formatNumber } from '@/utils/formatter';
import { OrderFormValues } from '../helpers/order-form';
import { ProductItem } from './product-item';
import { ProductSelectSheet } from './product-select-sheet';

export function FormStepItem(): JSX.Element {
  const { t } = useTranslation();
  const productSheetRef = useRef<BottomSheetModal>(null);
  const deleteConfirmRef = useRef<BottomSheetModal>(null);
  const [productToDelete, setProductToDelete] = useState<
    OrderFormValues['step_item']['products'][0] | null
  >(null);
  const { control, ...form } = useFormContext<OrderFormValues>();
  const watchIsDropship = useWatch({
    control,
    name: 'step_item.is_dropship',
  });
  const watchWarehouseId = useWatch({
    control,
    name: 'step_order.warehouse',
  });
  const watchProducts = useWatch({
    control,
    name: 'step_item.products',
  });

  // FIXME: This causes the weight to be recalculated
  useEffect(() => {
    // Update package weight in the form
    form.setValue('step_item.package.weight', handleCalculateWeight());
  }, [watchProducts]);

  const handleCalculateWeight = useCallback(() => {
    const totalWeight = watchProducts?.reduce((total, product) => {
      const productWeight = Number(product.weight) || 0;
      const quantity = product.quantity || 0;
      return total + productWeight * quantity;
    }, 0);

    return totalWeight || 0;
  }, [watchProducts]);

  const handleCalculatePrice = useCallback(() => {
    const totalPrice = watchProducts?.reduce((total, product) => {
      const productPrice = Number(product.published_price) || 0;
      const quantity = product.quantity || 0;
      return total + productPrice * quantity;
    }, 0);

    return totalPrice || 0;
  }, [watchProducts]);

  function onQuantityChange(
    updatedProduct: OrderFormValues['step_item']['products'][0],
    index: number,
  ): void {
    const updatedProducts = [...(watchProducts || [])];

    updatedProducts[index] = updatedProduct;

    form.setValue('step_item.products', updatedProducts);
  }

  function onDeleteProductRequest(
    product: OrderFormValues['step_item']['products'][0],
  ): void {
    setProductToDelete(product);
    deleteConfirmRef.current?.present();
  }

  function handleConfirmDelete(): void {
    if (!productToDelete) return;
    const updatedProducts = (watchProducts || []).filter(
      (p) => p.product_id !== productToDelete.product_id,
    );
    form.setValue('step_item.products', updatedProducts);
    deleteConfirmRef.current?.dismiss();
    setProductToDelete(null);
  }

  return (
    <Container.Scroll
      contentContainerClassName="p-lg gap-md"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Text variant="labelL">{t('order_form.item_order')}</Text>
      <Container.Card className="p-lg gap-md">
        {form.formState.errors.step_item?.products && (
          <Text variant="bodyS" color="danger">
            {form.formState.errors.step_item.products.message}
          </Text>
        )}
        {watchProducts && watchProducts.length > 0
          ? watchProducts.map((product, index) => (
              <ProductItem
                key={index}
                product={product}
                onQuantityChange={(updatedProduct) =>
                  onQuantityChange(updatedProduct, index)
                }
                onDeleteRequest={onDeleteProductRequest}
              />
            ))
          : null}
        <Button
          variant="outlined"
          disabled={!watchWarehouseId?.value}
          prefixIcon="productAdd"
          text={t('order_form.add_item')}
          className="border-muted-foreground rounded-md border border-dashed"
          onPress={() => productSheetRef.current?.present()}
        />
        <View className="gap-sm flex-row items-center">
          <Text variant="labelS" className="text-center">
            {t('order_form.total_weight')}
          </Text>
          <Divider className="h-px flex-1" />
          <Text variant="labelS" className="text-center">
            {formatNumber(handleCalculateWeight())}g
          </Text>
        </View>
        <View className="gap-sm flex-row items-center">
          <Text variant="labelS" className="text-center">
            {t('order_form.total_price')}
          </Text>
          <Divider className="h-px flex-1" />
          <Text variant="labelS" className="text-center">
            {formatCurrency(handleCalculatePrice())}
          </Text>
        </View>
      </Container.Card>

      <Text variant="labelL">{t('order_form.package_information')}</Text>
      <Container.Card className="p-lg gap-md">
        <Controller
          control={control}
          name="step_item.package.weight"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.package.weight')}
              value={value?.toString()}
              onChangeText={onChange}
              placeholder="0"
              mandatory
              keyboardType="numeric"
              right={
                <Icon
                  name="refresh"
                  size="lg"
                  className="text-field-placeholder"
                  transform="scale(-1,1)"
                />
              }
              helpers={[t('order_form.weight_auto_calculated')]}
              onPressRight={() => {}}
              error={!!error?.message}
              errors={[error?.message]}
            />
          )}
        />
        <Controller
          control={control}
          name="step_item.package.length"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.package.length')}
              placeholder="0"
              value={value?.toString()}
              onChangeText={onChange}
              keyboardType="numeric"
              error={!!error?.message}
              errors={[error?.message]}
            />
          )}
        />
        <Controller
          control={control}
          name="step_item.package.width"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.package.width')}
              value={value?.toString()}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder="0"
              error={!!error?.message}
              errors={[error?.message]}
            />
          )}
        />
        <Controller
          control={control}
          name="step_item.package.height"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label={t('order_form.package.height')}
              value={value?.toString()}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder="0"
              error={!!error?.message}
              errors={[error?.message]}
            />
          )}
        />
      </Container.Card>

      <Text variant="labelL">{t('order_form.dropshipping_information')}</Text>
      <Container.Card className="gap-sm flex-row items-center justify-between">
        <Text variant="bodyS" className="font-medium">
          {t('order_form.is_dropship')}
        </Text>
        <Controller
          control={control}
          name="step_item.is_dropship"
          render={({ field: { onChange, value } }) => (
            <ToggleSwitch value={value} size="small" onValueChange={onChange} />
          )}
        />
      </Container.Card>

      {watchIsDropship && (
        <Container.Card className="p-lg gap-md">
          <Controller
            control={control}
            name="step_item.dropshipper_name"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                label={t('order_form.dropshipper_name')}
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('order_form.enter_dropshipper_name')}
              />
            )}
          />

          <Controller
            control={control}
            name="step_item.dropshipper_phone"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                label={t('order_form.dropshipper_phone')}
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('order_form.enter_dropshipper_phone')}
                keyboardType="phone-pad"
              />
            )}
          />

          <Controller
            control={control}
            name="step_item.dropshipper_email"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                label={t('order_form.dropshipper_email')}
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('order_form.enter_dropshipper_email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="step_item.dropshipper_full_address"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                label={t('order_form.dropshipper_full_address')}
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('order_form.enter_dropshipper_address')}
                multiline
                inputClassName="min-h-20"
              />
            )}
          />
        </Container.Card>
      )}
      <ProductSelectSheet
        ref={productSheetRef}
        locationId={watchWarehouseId?.value}
        selectedProducts={watchProducts}
      />
      <BottomSheet.Confirm
        ref={deleteConfirmRef}
        title={t('general.confirm')}
        description={
          productToDelete
            ? `${t('order_form.delete_product_confirmation')} "${productToDelete.name}"?`
            : ''
        }
        showCloseButton
        closeButtonProps={{ text: t('general.cancel') }}
        submitButtonProps={{ text: t('general.delete') }}
        handleSubmit={handleConfirmDelete}
        variant="error"
      />
    </Container.Scroll>
  );
}
