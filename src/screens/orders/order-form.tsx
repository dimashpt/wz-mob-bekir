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
  TabView,
} from 'react-native-tab-view';
import { useCSSVariable, withUniwind } from 'uniwind';

import { Button, Container, Header } from '@/components';
import { TAB_BAR_HEIGHT } from '@/constants/ui';
import { FormStepItem } from './components/form-step-item';
import { FormStepOrder } from './components/form-step-order';
import { FormStepRecipient } from './components/form-step-recipient';
import { FormStepShipment } from './components/form-step-shipment';
import { FormStepSummary } from './components/form-step-summary';
import { orderFormSchema, OrderFormValues } from './helpers/order-form';

const TabBar = withUniwind(RNTabBar);
const MappedLinearGradient = withUniwind(LinearGradient);

type TabRoute = Route & {
  key: string;
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

  const [index, setIndex] = useState(0);
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
    if (index < routes.length - 1) {
      const currentStepField = stepFieldNames[index];
      const isValid = await form.trigger(currentStepField);

      if (isValid) {
        setIndex(index + 1);
      }
    }
  }

  function handlePrevious(): void {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  function handleSubmit(): void {
    // TODO: Handle form submission
  }

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
      tabClassName="w-auto"
      activeColor={accentColor}
      inactiveColor={mutedColor}
      onTabPress={({ preventDefault }) => !__DEV__ && preventDefault()}
    />
  );

  const isFirstStep = index === 0;
  const isLastStep = index === routes.length - 1;

  return (
    <FormProvider {...form}>
      <Container className="bg-background flex-1">
        <Header title={t('order_form.title')} />
        <TabView
          navigationState={{ index, routes }}
          renderScene={SceneMap({
            order: FormStepOrder,
            recipient: FormStepRecipient,
            item: FormStepItem,
            shipment: FormStepShipment,
            summary: FormStepSummary,
          })}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
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
