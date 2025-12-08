import React, { JSX, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { useMutation } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { FieldErrors, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  NavigationState,
  TabBar as RNTabBar,
  Route,
  SceneMap,
  SceneRendererProps,
  TabDescriptor,
  TabView,
} from 'react-native-tab-view';
import { useCSSVariable, withUniwind } from 'uniwind';

import {
  BottomSheet,
  BottomSheetModal,
  Button,
  Container,
  Header,
  Icon,
  IconNames,
  snackbar,
  Text,
} from '@/components';
import { ORDER_ENDPOINTS } from '@/constants/endpoints';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { queryClient } from '@/lib/react-query';
import { OrderService } from '@/services';
import { FormStepItem } from './components/form-step-item';
import { FormStepOrder } from './components/form-step-order';
import { FormStepRecipient } from './components/form-step-recipient';
import { FormStepShipment } from './components/form-step-shipment';
import { FormStepSummary } from './components/form-step-summary';
import { usePriceCalculations } from './context/price-calculations-context';
import { OrderFormValues } from './utils/order-form-schema';
import { mapToOrderPayload } from './utils/order-helpers';

const TabBar = withUniwind(RNTabBar);
const MappedLinearGradient = withUniwind(LinearGradient);

type RouteKey = 'order' | 'recipient' | 'item' | 'shipment' | 'summary';
type TabRoute = Route & {
  key: RouteKey;
  title: string;
};

export default function OrderFormScreen(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const spacingLg = useCSSVariable('--spacing-lg') as number;
  const layout = useWindowDimensions();
  const accentColor = useCSSVariable('--color-accent') as string;
  const mutedColor = useCSSVariable('--color-muted-foreground') as string;
  const backgroundColor = useCSSVariable('--color-background') as string;

  const [activeIndex, setActiveIndex] = useState(0);
  const confirmationSheetRef = useRef<BottomSheetModal>(null);
  const [routes] = useState<TabRoute[]>([
    { key: 'recipient', title: t('order_form.steps.recipient_info') },
    { key: 'order', title: t('order_form.steps.order_details') },
    { key: 'item', title: t('order_form.steps.item') },
    { key: 'shipment', title: t('order_form.steps.shipment') },
    { key: 'summary', title: t('order_form.steps.summary') },
  ]);

  const stepFieldNames: Record<number, keyof OrderFormValues> = {
    0: 'step_recipient',
    1: 'step_order',
    2: 'step_item',
    3: 'step_shipment',
    4: 'step_summary',
  };

  const form = useFormContext<OrderFormValues>();
  const { subTotal, insuranceFee, codFee, totalDiscount, grandTotal } =
    usePriceCalculations();

  const createOrderMutation = useMutation({
    mutationKey: [ORDER_ENDPOINTS.CREATE_ORDER],
    mutationFn: OrderService.createOrder,
    onSuccess: () => {
      snackbar.success(t('order_form.message.success'));
      router.back();
      queryClient.invalidateQueries({
        queryKey: [ORDER_ENDPOINTS.LIST_ORDERS],
      });
    },
    onSettled: () => confirmationSheetRef.current?.close(),
  });

  async function handleNext(): Promise<void> {
    if (activeIndex < routes.length - 1) {
      const currentStepField = stepFieldNames[activeIndex];
      const isValid = await form.trigger(currentStepField);

      if (isValid) {
        setActiveIndex(activeIndex + 1);
      }
    }
  }

  function handlePrevious(): void {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  }

  function confirmSubmission(_: OrderFormValues): void {
    confirmationSheetRef.current?.present();
  }

  function handleSubmit(values: OrderFormValues): void {
    const payload = mapToOrderPayload(values);

    createOrderMutation.mutate({
      ...payload,
      price: {
        ...payload.price,
        sub_total_price: subTotal,
        total_discount_price: totalDiscount,
        cod_fee: codFee,
        cod_price: grandTotal,
        grand_total_order_price: grandTotal,
        insurance_price: insuranceFee,
      },
    });
  }

  function handleFormError(errors: FieldErrors<OrderFormValues>): void {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      snackbar.error(t('order_form.message.form_error'));
    }
  }

  const tabIconNames: Record<RouteKey, IconNames> = {
    order: 'info',
    recipient: 'user',
    item: 'product',
    shipment: 'truck',
    summary: 'order',
  };

  const renderIcon = (
    tabKey: RouteKey,
    focused: boolean,
    hasErrors: boolean,
  ): JSX.Element => {
    const iconName = tabIconNames[tabKey];

    return (
      <Icon
        name={hasErrors && !focused ? 'warning' : iconName}
        size="sm"
        className={
          hasErrors
            ? 'text-danger'
            : focused
              ? 'text-accent'
              : 'text-muted-foreground'
        }
      />
    );
  };

  const renderLabel = (
    labelText: string,
    focused: boolean,
    hasErrors: boolean,
  ): JSX.Element => {
    return (
      <Text
        variant="labelS"
        color={hasErrors ? 'danger' : focused ? 'accent' : 'muted'}
        className={
          focused
            ? 'android:font-map-semibold font-semibold'
            : 'android:font-map-medium font-medium'
        }
      >
        {labelText}
      </Text>
    );
  };

  const createTabOption = (tabKey: RouteKey): TabDescriptor<Route> => {
    const findTabIndex = Object.values(stepFieldNames).indexOf(
      `step_${tabKey}`,
    );
    const hasErrors = Boolean(
      form.formState.errors[stepFieldNames[findTabIndex]],
    );

    return {
      icon: (props) => renderIcon(tabKey, props.focused, hasErrors),
      label: ({ labelText, focused }) =>
        renderLabel(labelText || '', focused, hasErrors),
    };
  };

  const tabBarOptions = {
    order: createTabOption('order'),
    recipient: createTabOption('recipient'),
    item: createTabOption('item'),
    shipment: createTabOption('shipment'),
    summary: createTabOption('summary'),
  };

  const isCurrentStepHasErrors = Boolean(
    form.formState.errors[stepFieldNames[activeIndex]],
  );

  const renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<TabRoute>;
    },
  ): JSX.Element => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorClassName={isCurrentStepHasErrors ? 'bg-danger' : 'bg-accent'}
      className="bg-surface"
      tabClassName="w-auto px-0 flex-row gap-xs items-center min-h-0"
      contentContainerClassName="px-lg"
      gap={16}
      options={tabBarOptions}
      activeColor={accentColor}
      inactiveColor={mutedColor}
    />
  );

  const isFirstStep = activeIndex === 0;
  const isLastStep = activeIndex === routes.length - 1;

  return (
    <Container className="bg-background flex-1">
      <Header title={t('order_form.title')} className="border-b-0" />
      <TabView
        navigationState={{ index: activeIndex, routes }}
        renderScene={SceneMap({
          order: FormStepOrder,
          recipient: FormStepRecipient,
          item: FormStepItem,
          shipment: FormStepShipment,
          summary: FormStepSummary,
        })}
        renderTabBar={renderTabBar}
        onIndexChange={setActiveIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled
        lazy
      />
      <MappedLinearGradient
        colors={[
          backgroundColor + '00',
          backgroundColor,
          backgroundColor,
          backgroundColor,
        ]}
        className="absolute right-0 bottom-0 left-0 items-center"
        style={{
          paddingBottom: insets.bottom || spacingLg,
          height: TAB_BAR_HEIGHT + 20,
        }}
      >
        <View
          className="gap-md p-lg absolute right-0 bottom-0 left-0 flex-row"
          style={{ paddingBottom: insets.bottom || spacingLg }}
        >
          <Button
            variant="outlined"
            className="flex-1"
            onPress={handlePrevious}
            disabled={isFirstStep}
            text={t('order_form.navigation.previous')}
          />
          <Button
            variant="filled"
            className="flex-1"
            loading={createOrderMutation.isPending}
            onPress={
              isLastStep
                ? form.handleSubmit(confirmSubmission, handleFormError)
                : handleNext
            }
            text={
              isLastStep
                ? t('order_form.navigation.submit')
                : t('order_form.navigation.next')
            }
          />
        </View>
      </MappedLinearGradient>
      <BottomSheet.Confirm
        ref={confirmationSheetRef}
        variant="info"
        title={t('order_form.confirmation.title')}
        description={t('order_form.confirmation.description')}
        dismissable={!createOrderMutation.isPending}
        handleSubmit={form.handleSubmit(handleSubmit)}
        submitButtonProps={{
          loading: createOrderMutation.isPending,
          text: t('order_form.confirmation.submit'),
        }}
        closeButtonProps={{
          text: t('order_form.confirmation.cancel'),
        }}
      />
    </Container>
  );
}
