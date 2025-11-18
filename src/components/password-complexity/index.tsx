import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';
import { useCSSVariable } from 'uniwind';

import { Icon } from '@/components/icon';
import { Text } from '@/components/text';

interface PasswordComplexityProps {
  password: string;
  visible?: boolean;
}

interface ComplexityRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const PasswordComplexity: React.FC<PasswordComplexityProps> = ({
  password,
  visible = true,
}) => {
  const { t } = useTranslation();
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const spacingSm = useCSSVariable('--spacing-sm') as number;

  // Animation values for showing/hiding tooltip
  const opacity = useSharedValue(visible ? 1 : 0);
  const translateY = useSharedValue(visible ? 0 : -8);

  // Update animation when visibility changes
  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });

    translateY.value = withTiming(visible ? 0 : -8, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [visible, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Calculate dynamic top position based on tooltip height
  // Add spacing for gap between tooltip and input
  const dynamicTop = tooltipHeight > 0 ? -(tooltipHeight + spacingSm) : -70;

  interface LayoutEvent {
    nativeEvent: {
      layout: {
        height: number;
      };
    };
  }

  const handleLayout = (event: LayoutEvent): void => {
    setTooltipHeight(event.nativeEvent.layout.height);
  };

  const requirements: ComplexityRequirement[] = [
    {
      id: 'uppercase',
      label: 'password_complexity.uppercase',
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
    {
      id: 'lowercase',
      label: 'password_complexity.lowercase',
      test: (pwd: string) => /[a-z]/.test(pwd),
    },
    {
      id: 'number',
      label: 'password_complexity.number',
      test: (pwd: string) => /[0-9]/.test(pwd),
    },
    {
      id: 'special',
      label: 'password_complexity.special',
      test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  const getRequirementColor = (isMet: boolean): string => {
    return isMet ? 'text-success' : 'text-foreground-secondary';
  };

  return (
    <Animated.View
      className="gap-xs py-sm px-md bg-subtle border-l-primary z-popover absolute right-0 left-0 w-full rounded-md border-l-[3px] shadow-md"
      style={[animatedStyle, { top: dynamicTop }]}
      onLayout={handleLayout}
    >
      {requirements.map((requirement) => {
        const isMet = requirement.test(password);
        const colorClass = getRequirementColor(isMet);

        return (
          <View
            key={requirement.id}
            className="gap-xs flex-row items-center"
            accessibilityRole="text"
            accessibilityLabel={requirement.label}
            accessibilityState={{ checked: isMet }}
          >
            {isMet ? (
              <Icon name="tickCircle" size={20} className={colorClass} />
            ) : (
              <Icon name="closeCircle" size={20} className={colorClass} />
            )}
            <Text
              variant="labelS"
              className={twMerge('flex-1', colorClass)}
              accessibilityLabel={t(requirement.label)}
            >
              {t(requirement.label)}
            </Text>
          </View>
        );
      })}
    </Animated.View>
  );
};
