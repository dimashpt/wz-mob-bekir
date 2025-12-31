import React, { useEffect } from 'react';
import { View } from 'react-native';

import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { Avatar, Checkbox, Chip, Icon, Text } from '@/components';
import { AnimatedComponent } from '@/components/animated-component';
import { Container } from '@/components/container';
import { Swipeable } from '@/components/swipeable';
import { formatDisplayDate } from '@/utils/date';
import { Conversation } from '../services/conversation/types';

export default function ChatListItem({
  item,
  index,
  isSelectionMode = false,
  isSelected = false,
  onPress,
  onLongPress,
}: {
  item: Conversation;
  index: number;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}): React.JSX.Element {
  const router = useRouter();

  const priorityClassName = {
    low: 'text-success',
    medium: 'text-warning',
    high: 'text-danger',
    urgent: 'text-danger',
    none: 'text-muted-foreground',
  };

  function handlePress(): void {
    if (onPress) {
      onPress();
    } else {
      router.push(`/chat-room?conversation_id=${item.id}`);
    }
  }

  function handleLongPress(): void {
    if (onLongPress) {
      onLongPress();
    }
  }

  const checkboxWidth = useSharedValue(0);
  const checkboxOpacity = useSharedValue(0);

  useEffect(() => {
    if (isSelectionMode) {
      checkboxWidth.value = withTiming(32, { duration: 200 });
      checkboxOpacity.value = withTiming(1, { duration: 200 });
    } else {
      checkboxWidth.value = withTiming(0, { duration: 200 });
      checkboxOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isSelectionMode, checkboxWidth, checkboxOpacity]);

  const checkboxAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: checkboxWidth.value,
      opacity: checkboxOpacity.value,
    };
  });

  return (
    <AnimatedComponent index={index % 10}>
      <Swipeable
        spacing={35}
        rightElement={<Icon name="trash" size="2xl" className="text-white" />}
        handlePress={handlePress}
        handleLongPress={handleLongPress}
        isSwipeEnabled={!isSelectionMode}
        triggerOverswipeOnFlick
      >
        <Container.Card
          className={twMerge(
            'gap-sm flex-row border',
            isSelected ? 'border-accent bg-accent-soft' : 'border-transparent',
          )}
        >
          {/* Create avatar from sender initials */}
          <View
            className={twMerge(
              'flex-row items-center self-start',
              isSelectionMode ? 'gap-sm' : '',
            )}
          >
            <Animated.View
              style={checkboxAnimatedStyle}
              className="items-center justify-center overflow-hidden"
            >
              <Checkbox isSelected={isSelected} size="medium" />
            </Animated.View>
            <Avatar name={item.meta.sender.name} textClassName="text-lg" />
          </View>
          <View className="flex-1">
            <View className="gap-xs flex-row items-start justify-between">
              <View className="gap-xs flex-row items-center">
                <Text variant="labelM" className="pr-xxs capitalize">
                  {item.meta.sender.name}
                </Text>
                <Text variant="bodyS" color="muted">
                  #{item.id}
                </Text>
              </View>
              <View className="gap-xs flex-row items-center">
                <Text variant="bodyXS" color="muted">
                  {formatDisplayDate(dayjs(item.timestamp * 1000), false)}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="gap-xs flex-row items-center">
                {item.last_non_activity_message.sender.type === 'user' && (
                  <Icon
                    name="tick"
                    size="sm"
                    className="text-muted-foreground"
                  />
                )}
                <Text variant="bodyXS" color="muted">
                  {item.last_non_activity_message.content}
                </Text>
              </View>
              <View className="gap-sm flex-row items-center">
                {item.priority && (
                  <Icon
                    name="signal"
                    className={priorityClassName[item.priority]}
                  />
                )}
                {item.meta.assignee && (
                  <Avatar name={item.meta.assignee.name} className="size-5" />
                )}
              </View>
            </View>
            {item.labels.length ? (
              <View className="mt-xs gap-xs flex-row flex-wrap items-center">
                {item.labels.map((label) => (
                  <Chip key={label} label={label} variant="blue" />
                ))}
              </View>
            ) : null}
          </View>
        </Container.Card>
      </Swipeable>
    </AnimatedComponent>
  );
}
