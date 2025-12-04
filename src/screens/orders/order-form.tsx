import React, { JSX, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { FormProvider, useForm } from 'react-hook-form';
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

import { Button, Container, Header, Icon, IconNames, Text } from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { FormStepItem } from './components/form-step-item';
import { FormStepOrder } from './components/form-step-order';
import { FormStepRecipient } from './components/form-step-recipient';
import { FormStepShipment } from './components/form-step-shipment';
import { FormStepSummary } from './components/form-step-summary';
import { orderFormSchema, OrderFormValues } from './utils/order-form-schema';

const TabBar = withUniwind(RNTabBar);
const MappedLinearGradient = withUniwind(LinearGradient);

type RouteKey = 'order' | 'recipient' | 'item' | 'shipment' | 'summary';
type TabRoute = Route & {
  key: RouteKey;
  title: string;
};

export default function OrderFormScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const spacingLg = useCSSVariable('--spacing-lg') as number;
  const layout = useWindowDimensions();
  const accentColor = useCSSVariable('--color-accent') as string;
  const mutedColor = useCSSVariable('--color-muted-foreground') as string;
  const backgroundColor = useCSSVariable('--color-background') as string;

  const [activeIndex, setActiveIndex] = useState(0);
  const [routes] = useState<TabRoute[]>([
    { key: 'order', title: t('order_form.steps.order_details') },
    { key: 'recipient', title: t('order_form.steps.recipient_info') },
    { key: 'item', title: t('order_form.steps.item') },
    { key: 'shipment', title: t('order_form.steps.shipment') },
    { key: 'summary', title: t('order_form.steps.summary') },
  ]);

  const stepFieldNames: Record<number, keyof OrderFormValues> = {
    0: 'step_order',
    1: 'step_recipient',
    2: 'step_item',
    3: 'step_shipment',
    4: 'step_summary',
  };

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onChange',
    defaultValues: {
      step_recipient: {
        is_same_as_recipient: false,
      },
      step_item: {
        is_dropship: false,
      },
    },
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

  function handleSubmit(): void {
    // TODO: Handle form submission
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
          focused
            ? 'text-accent'
            : hasErrors
              ? 'text-danger'
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
        color={focused ? 'accent' : hasErrors ? 'danger' : 'muted'}
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

  const renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<TabRoute>;
    },
  ): JSX.Element => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorClassName="bg-accent"
      className="bg-surface"
      tabClassName="w-auto px-0 flex-row gap-xs items-center min-h-0"
      contentContainerClassName="px-lg"
      gap={16}
      options={tabBarOptions}
      activeColor={accentColor}
      inactiveColor={mutedColor}
      onTabPress={({ preventDefault }) => !__DEV__ && preventDefault()}
    />
  );

  const isFirstStep = activeIndex === 0;
  const isLastStep = activeIndex === routes.length - 1;

  return (
    <FormProvider {...form}>
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
              onPress={
                isLastStep ? form.handleSubmit(handleSubmit) : handleNext
              }
              text={
                isLastStep
                  ? t('order_form.navigation.submit')
                  : t('order_form.navigation.next')
              }
            />
          </View>
        </MappedLinearGradient>
      </Container>
    </FormProvider>
  );
}
