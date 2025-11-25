import React, { JSX, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

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
import { FormStepCustomer, FormStepOrder, FormStepReview } from './components';

const TabBar = withUniwind(RNTabBar);

type TabRoute = Route & {
  key: string;
  title: string;
};

const renderScene = SceneMap({
  customer: FormStepCustomer,
  order: FormStepOrder,
  review: FormStepReview,
});

export default function OrderFormScreen(): JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const spacingLg = useCSSVariable('--spacing-lg') as number;
  const layout = useWindowDimensions();
  const accentColor = useCSSVariable('--color-accent') as string;
  const mutedColor = useCSSVariable('--color-muted') as string;

  const [index, setIndex] = useState(0);
  const [routes] = useState<TabRoute[]>([
    { key: 'customer', title: t('order_form.steps.customer_info') },
    { key: 'order', title: t('order_form.steps.order_details') },
    { key: 'review', title: t('order_form.steps.review') },
  ]);

  function handleNext(): void {
    if (index < routes.length - 1) {
      setIndex(index + 1);
    }
  }

  function handlePrevious(): void {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  function handleSubmit(): void {}

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
      activeColor={accentColor}
      inactiveColor={mutedColor}
      tabStyle={{ width: 'auto' }}
    />
  );

  const isFirstStep = index === 0;
  const isLastStep = index === routes.length - 1;

  return (
    <Container className="bg-background flex-1">
      <Header title={t('order_form.title')} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled
        lazy
      />
      <View
        className="gap-md p-lg border-border flex-row border-t"
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
          onPress={isLastStep ? handleSubmit : handleNext}
          text={
            isLastStep
              ? t('order_form.navigation.submit')
              : t('order_form.navigation.next')
          }
        />
      </View>
    </Container>
  );
}
