import React, { JSX, useRef } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';

import {
  BottomSheetModal,
  Button,
  Container,
  Icon,
  InputField,
  Text,
  ToggleSwitch,
} from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { OrderFormValues } from '../helpers/order-form';
import { ProductItem } from './product-item';
import { ProductSelectSheet } from './product-select-sheet';

export function FormStepItem(): JSX.Element {
  const productSheetRef = useRef<BottomSheetModal>(null);
  const { control, ...form } = useFormContext<OrderFormValues>();
  const watchIsDropship = useWatch({
    control,
    name: 'is_dropship',
  });
  const watchWarehouseId = useWatch({
    control,
    name: 'location_id',
  });
  const watchProducts = useWatch({
    control,
    name: 'products',
  });

  function onQuantityChange(
    updatedProduct: OrderFormValues['products'][0],
    index: number,
  ): void {
    const updatedProducts = [...(watchProducts || [])];

    updatedProducts[index] = updatedProduct;

    form.setValue('products', updatedProducts);
  }

  return (
    <Container.Scroll
      contentContainerClassName="p-lg gap-md"
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
    >
      <Text variant="labelL">Item Order</Text>
      <Container.Card className="p-lg gap-md">
        {watchProducts && watchProducts.length > 0
          ? watchProducts.map((product, index) => (
              <ProductItem
                key={index}
                product={product}
                onQuantityChange={(updatedProduct) =>
                  onQuantityChange(updatedProduct, index)
                }
              />
            ))
          : null}
        <Button
          variant="outlined"
          prefixIcon="productAdd"
          text="Tambah Item"
          className="border-muted-foreground rounded-md border border-dashed"
          onPress={() => productSheetRef.current?.present()}
        />
      </Container.Card>

      <Text variant="labelL">Dropshipper Information</Text>
      <Container.Card className="p-lg gap-sm flex-row items-center justify-between">
        <Text variant="bodyM" className="flex-1">
          Pesanan Dropship
        </Text>
        <Controller
          control={control}
          name="is_dropship"
          render={({ field: { onChange, value } }) => (
            <ToggleSwitch value={value} size="small" onValueChange={onChange} />
          )}
        />
      </Container.Card>

      <Text variant="labelL">Package Information</Text>
      <Container.Card className="p-lg gap-md">
        <Controller
          control={control}
          name="package.weight"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Berat (gram)"
              value={value?.toString()}
              onChangeText={onChange}
              placeholder="0"
              keyboardType="numeric"
              right={
                <Icon
                  name="refresh"
                  size="lg"
                  className="text-field-placeholder"
                  transform="scale(-1,1)"
                />
              }
              helpers={[
                'Berat otomatis dihitung dari total produk. Anda dapat mengubahnya secara manual',
              ]}
              onPressRight={() => {}}
            />
          )}
        />
        <Controller
          control={control}
          name="package.length"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Panjang (cm)"
              placeholder="0"
              value={value?.toString()}
              onChangeText={onChange}
              keyboardType="numeric"
            />
          )}
        />
        <Controller
          control={control}
          name="package.width"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Lebar (cm)"
              value={value?.toString()}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder="0"
            />
          )}
        />
        <Controller
          control={control}
          name="package.height"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Tinggi (cm)"
              value={value?.toString()}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder="0"
            />
          )}
        />
      </Container.Card>

      {watchIsDropship && (
        <Container.Card className="p-lg gap-md">
          <Controller
            control={control}
            name="dropshipper_name"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                label="Nama Dropshipper"
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Masukkan nama dropshipper"
              />
            )}
          />

          <Controller
            control={control}
            name="dropshipper_phone"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                label="No. HP Dropshipper"
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Masukkan no. hp dropshipper"
                keyboardType="phone-pad"
              />
            )}
          />

          <Controller
            control={control}
            name="dropshipper_email"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                label="Email Dropshipper"
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Masukkan email dropshipper"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="dropshipper_full_address"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <InputField
                label="Alamat Lengkap Dropshipper"
                value={value}
                error={!!error?.message}
                errors={[error?.message]}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Masukkan alamat lengkap dropshipper"
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
    </Container.Scroll>
  );
}
