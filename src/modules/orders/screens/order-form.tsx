import React, { JSX, useEffect, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { useMutation } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { queryClient } from '@/lib/react-query';
import { FormStepItem } from '../components/form-step-item';
import { FormStepOrder } from '../components/form-step-order';
import { FormStepRecipient } from '../components/form-step-recipient';
import { FormStepShipment } from '../components/form-step-shipment';
import { FormStepSummary } from '../components/form-step-summary';
import { orderKeys } from '../constants/keys';
import { useOrderForm } from '../context/order-form-context';
import { createOrder } from '../services/order';
import { useOrderDetailsQuery } from '../services/order/repository';
import { OrderFormValues } from '../utils/order-form-schema';
import {
  mapToOrderFormValues,
  mapToOrderPayload,
} from '../utils/order-helpers';

const TabBar = withUniwind(RNTabBar);
const MappedLinearGradient = withUniwind(LinearGradient);

type RouteKey = 'order' | 'recipient' | 'item' | 'shipment' | 'summary';
type TabRoute = Route & {
  key: RouteKey;
  title: string;
};

type Params = {
  id: string;
};

export default function OrderFormScreen(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<Params>();
  const [spacingLg] = useCSSVariable(['--spacing-lg']) as number[];
  const layout = useWindowDimensions();
  const [accentColor, mutedColor, backgroundColor] = useCSSVariable([
    '--color-accent',
    '--color-muted-foreground',
    '--color-background',
  ]) as string[];

  const [activeIndex, setActiveIndex] = useState(0);
  const confirmationSheetRef = useRef<BottomSheetModal>(null);
  const saveDraftSheetRef = useRef<BottomSheetModal>(null);
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
    useOrderForm();

  const { data: details } = useOrderDetailsQuery(
    { select: (data) => data.order, enabled: Boolean(id) },
    id,
  );

  const createOrderMutation = useMutation({
    mutationKey: orderKeys.create,
    mutationFn: createOrder,
    onSuccess: () => {
      snackbar.success(t('order_form.message.success'));
      router.back();
      queryClient.invalidateQueries({ queryKey: orderKeys.list() });
    },
    onSettled: () => confirmationSheetRef.current?.close(),
  });

  const saveDraftMutation = useMutation({
    mutationKey: [...orderKeys.create, 'draft'],
    mutationFn: createOrder,
    onSuccess: () => {
      snackbar.success(t('order_form.draft_confirmation.success'));
      router.back();
      queryClient.invalidateQueries({ queryKey: orderKeys.list() });
    },
    onSettled: () => saveDraftSheetRef.current?.close(),
  });

  useEffect(() => {
    if (details) {
      const resetValues = mapToOrderFormValues(details);

      form.reset(resetValues);
    }
  }, [details]);

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

  function confirmSaveDraft(_: OrderFormValues): void {
    saveDraftSheetRef.current?.present();
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

  function handleSaveDraft(): void {
    const values = form.getValues();
    const payload = mapToOrderPayload(values);

    saveDraftMutation.mutate({
      ...payload,
      is_draft: true,
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
      snackbar.error(
        t('order_form.message.form_error') + ' ' + errorKeys.join(', '),
      );
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
        className="android:font-map-medium font-medium"
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
      <Header
        title={id ? t('order_form.draft_title') : t('order_form.title')}
        className="border-b-0"
        onPressSuffix={form.handleSubmit(confirmSaveDraft, handleFormError)}
        suffixIcon={
          <Icon name="saveDraft" size="xl" className="text-foreground" />
        }
      />
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
        showCloseButton
        submitButtonProps={{
          loading: createOrderMutation.isPending,
          text: t('order_form.confirmation.submit'),
        }}
        closeButtonProps={{
          text: t('order_form.confirmation.cancel'),
        }}
      />
      <BottomSheet.Confirm
        ref={saveDraftSheetRef}
        variant="info"
        title={t('order_form.draft_confirmation.title')}
        description={t('order_form.draft_confirmation.description')}
        dismissable={!saveDraftMutation.isPending}
        handleSubmit={handleSaveDraft}
        showCloseButton
        submitButtonProps={{
          loading: saveDraftMutation.isPending,
          text: t('order_form.draft_confirmation.submit'),
        }}
        closeButtonProps={{
          text: t('order_form.draft_confirmation.cancel'),
        }}
      />
    </Container>
  );
}
