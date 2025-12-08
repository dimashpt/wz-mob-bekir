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
import { OrderFormValues } from '../utils/order-form-schema';
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
        <InputField
          control={control}
          name="step_item.package.weight"
          label={t('order_form.package.weight')}
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
        />
        <InputField
          control={control}
          name="step_item.package.length"
          label={t('order_form.package.length')}
          placeholder="0"
          keyboardType="numeric"
        />
        <InputField
          control={control}
          name="step_item.package.width"
          label={t('order_form.package.width')}
          keyboardType="numeric"
          placeholder="0"
        />
        <InputField
          control={control}
          name="step_item.package.height"
          label={t('order_form.package.height')}
          keyboardType="numeric"
          placeholder="0"
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
          <InputField
            control={control}
            name="step_item.dropshipper_name"
            label={t('order_form.dropshipper_name')}
            placeholder={t('order_form.enter_dropshipper_name')}
          />

          <InputField
            control={control}
            name="step_item.dropshipper_phone"
            label={t('order_form.dropshipper_phone')}
            placeholder={t('order_form.enter_dropshipper_phone')}
            keyboardType="phone-pad"
          />

          <InputField
            control={control}
            name="step_item.dropshipper_email"
            label={t('order_form.dropshipper_email')}
            placeholder={t('order_form.enter_dropshipper_email')}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            control={control}
            name="step_item.dropshipper_full_address"
            label={t('order_form.dropshipper_full_address')}
            placeholder={t('order_form.enter_dropshipper_address')}
            multiline
            inputClassName="min-h-20"
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
