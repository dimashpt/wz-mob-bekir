import { JSX } from 'react';

import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Header } from '@/components';

export default function GuardLayout(): JSX.Element {
  const { t } = useTranslation();
  const SCREENS: ScreenMap[] = [
    {
      path: 'storybook',
      title: t('storybook.title'),
      headerShown: true,
    },
    {
      path: '(orders)/order-details',
      title: t('order_details.title'),
      headerShown: false,
    },
    {
      path: '(orders)/order-form',
      title: t('order_form.title'),
      headerShown: false,
    },
  ];

  return (
    <Stack>
      {SCREENS.map((screen) => (
        <Stack.Screen
          key={screen.path}
          name={screen.path}
          options={{
            headerShown: screen.headerShown,
            header: (props) => (
              <Header nativeProps={props} title={screen.title} />
            ),
          }}
        />
      ))}
    </Stack>
  );
}
