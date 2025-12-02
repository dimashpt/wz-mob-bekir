import type { Product } from '@/services/products/types';

import { forwardRef, useRef, useState } from 'react';
import { FlatList } from 'react-native';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const form = useFormContext<OrderFormValues>();
  const removeConfirmRef = useRef<BottomSheetModal>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [productsToRemove, setProductsToRemove] = useState<Product[]>([]);

  const { data: products } = ProductRepo.useProductsInfiniteQuery(
    { enabled: Boolean(locationId) },
    { location_id: Number(locationId) },
  );

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
    const existingProducts = form.getValues('step_item.products') || [];

    // Find products that were previously selected but now deselected
    const removedProducts = existingProducts.filter(
      (existing) =>
        !selectedProducts.some(
          (selected) => selected.product_id === existing.product_id,
        ),
    );

    // If there are products to remove, show confirmation first
    if (removedProducts.length > 0) {
      setProductsToRemove(removedProducts);
      removeConfirmRef.current?.present();
      return;
    }

    // Otherwise, just apply changes directly
    applyProductChanges();
  }

  function applyProductChanges(): void {
    const existingProducts = form.getValues('step_item.products') || [];

    // Find NEW products to add
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

    // Keep only products that are still selected (preserving their quantities)
    const remainingProducts = existingProducts.filter((existing) =>
      selectedProducts.some(
        (selected) => selected.product_id === existing.product_id,
      ),
    );

    form.setValue(
      'step_item.products',
      [...remainingProducts, ...mappedNewProducts],
      { shouldValidate: true },
    );
    handleCloseAndReset();
  }

  function handleConfirmRemove(): void {
    applyProductChanges();
    removeConfirmRef.current?.dismiss();
    setProductsToRemove([]);
  }

  function handleCancelRemove(): void {
    // Restore the selection to include the products user tried to remove
    setSelectedProducts([...selectedProducts, ...productsToRemove]);
    removeConfirmRef.current?.dismiss();
    setProductsToRemove([]);
  }

  function handleCloseAndReset(): void {
    (ref as React.RefObject<BottomSheetModal | null>).current?.dismiss();
  }

  const flattenedProducts =
    products?.pages.flatMap((page) => page?.products ?? []) ?? [];

  function getRemoveConfirmationMessage(): string {
    if (productsToRemove.length === 1) {
      return `${t('order_form.delete_product_confirmation')} "${productsToRemove[0]?.name}"?`;
    }
    const productNames = productsToRemove.map((p) => p.name).join(', ');
    return `${t('order_form.delete_products_confirmation')} ${productNames}?`;
  }

  return (
    <>
      <BottomSheet.Confirm
        ref={ref as React.RefObject<BottomSheetModal | null>}
        handleClose={handleCloseAndReset}
        title={t('order_form.add_item')}
        contentContainerClassName="max-h-96"
        submitButtonProps={{ text: t('general.done') }}
        handleSubmit={handleUpdateSelectedProducts}
        onOpen={() => setSelectedProducts(initialSelectedProducts ?? [])}
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
      <BottomSheet.Confirm
        ref={removeConfirmRef}
        title={t('general.confirm')}
        description={getRemoveConfirmationMessage()}
        handleClose={handleCancelRemove}
        closeButtonProps={{ text: t('general.cancel') }}
        submitButtonProps={{ text: t('general.delete') }}
        handleSubmit={handleConfirmRemove}
        variant="error"
      />
    </>
  );
});

ProductSelectSheet.displayName = 'ProductSelectSheet';
