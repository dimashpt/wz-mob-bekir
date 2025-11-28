import type { Product } from '@/services/products/types';

import { forwardRef, useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { useFormContext } from 'react-hook-form';

import { BottomSheet, BottomSheetModal } from '@/components';
import { ProductRepo } from '@/services';
import { OrderFormValues } from '../helpers/order-form';
import { ProductItem } from './product-item';

interface ProductSelectSheetProps {
  locationId?: string | number;
  selectedProducts?: Product[];
}

export const ProductSelectSheet = forwardRef<
  BottomSheetModal | null,
  ProductSelectSheetProps
>(({ locationId, selectedProducts: initialSelectedProducts }, ref) => {
  const form = useFormContext<OrderFormValues>();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const { data: products } = ProductRepo.useProductsInfiniteQuery(
    { enabled: Boolean(locationId) },
    { location_id: Number(locationId) },
  );

  useEffect(() => {
    if (selectedProducts) {
      setSelectedProducts(initialSelectedProducts ?? []);
    }
  }, [form]);

  function handleSelectProduct(product: Product): void {
    const isSelected = selectedProducts.some(
      (p) => p.product_id === product.product_id,
    );

    let updatedSelectedProducts: Product[] = [];

    if (isSelected) {
      updatedSelectedProducts = selectedProducts.filter(
        (p) => p.product_id !== product.product_id,
      );
    } else {
      updatedSelectedProducts = [...selectedProducts, product];
    }

    setSelectedProducts(updatedSelectedProducts);
  }

  function handleUpdateSelectedProducts(): void {
    const existingProducts = form.getValues('products') || [];

    const newProducts = selectedProducts.filter(
      (selected) =>
        !existingProducts.some(
          (existing) => existing.product_id === selected.product_id,
        ),
    );

    const mappedNewProducts = newProducts.map((product) => ({
      ...product,
      quantity: 1,
    }));

    form.setValue('products', [...existingProducts, ...mappedNewProducts]);
    handleCloseAndReset();
  }

  function handleCloseAndReset(): void {
    (ref as React.RefObject<BottomSheetModal | null>).current?.dismiss();
  }

  const flattenedProducts =
    products?.pages.flatMap((page) => page?.products ?? []) ?? [];

  return (
    <BottomSheet.Confirm
      ref={ref as React.RefObject<BottomSheetModal | null>}
      handleClose={handleCloseAndReset}
      title="Pilih Produk"
      contentContainerClassName="max-h-96"
      submitButtonProps={{ text: 'Done' }}
      handleSubmit={handleUpdateSelectedProducts}
    >
      <FlatList
        data={flattenedProducts}
        keyExtractor={(item, index) => `${item.product_id}-${index}`}
        contentContainerClassName="gap-sm"
        renderItem={({ item }) => {
          const isSelected = selectedProducts.some(
            (p) => p.product_id === item.product_id,
          );

          return (
            <ProductItem
              product={item}
              selected={isSelected}
              onPress={handleSelectProduct}
            />
          );
        }}
      />
    </BottomSheet.Confirm>
  );
});

ProductSelectSheet.displayName = 'ProductSelectSheet';
