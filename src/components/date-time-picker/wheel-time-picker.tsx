import React, { memo, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import dayjs from 'dayjs';

import ScrollPicker, { ScrollPickerProps } from '@/components/wheel-picker';
import { Text } from '../text';

const WheelPicker = memo(ScrollPicker);

interface WheelTimePickerProps {
  time?: dayjs.Dayjs;
  onTimeChange?: (time: dayjs.Dayjs) => void;
}

export const WheelTimePicker: React.FC<WheelTimePickerProps> = ({
  time,
  onTimeChange,
}) => {
  const currentTime = time || dayjs();
  const [selectedTime, setSelectedTime] = useState(currentTime);
  const pendingTimeChangeRef = useRef<dayjs.Dayjs | null>(null);

  // Values for hours and minutes
  const hours = Array.from({ length: 24 }, (_, i) =>
    i < 10 ? `0${i}` : i.toString(),
  );

  const minutes = Array.from({ length: 60 }, (_, i) =>
    i < 10 ? `0${i}` : i.toString(),
  );

  // Call onTimeChange after state update to avoid setState during render
  useEffect(() => {
    if (pendingTimeChangeRef.current && onTimeChange) {
      onTimeChange(pendingTimeChangeRef.current);
      pendingTimeChangeRef.current = null;
    }
  }, [selectedTime, onTimeChange]);

  // Handlers for changing hours and minutes
  const handleHourChange: NonNullable<
    ScrollPickerProps<string | number>['onValueChange']
  > = (data) => {
    if (data === undefined) return;

    const hour = Number(data.toString());
    setSelectedTime((prev) => {
      const newTime = prev.set('hour', hour);
      pendingTimeChangeRef.current = newTime;
      return newTime;
    });
  };

  const handleMinuteChange: NonNullable<
    ScrollPickerProps<string | number>['onValueChange']
  > = (data) => {
    if (data === undefined) return;

    setSelectedTime((prev) => {
      const newTime = prev.set('minute', Number(data));
      pendingTimeChangeRef.current = newTime;
      return newTime;
    });
  };

  return (
    <View className="gap-sm relative flex-row items-center justify-center">
      <View className="absolute z-0 h-full w-full items-center justify-center">
        <View className="h-5xl bg-accent-soft z-0 w-full rounded-sm" />
      </View>
      {/* Hours Picker */}
      <View className="w-[65%] flex-row items-center">
        <WheelPicker
          dataSource={hours}
          selectedIndex={selectedTime.hour()}
          onValueChange={handleHourChange}
          wrapperBackground="transparent"
          wrapperHeight={152}
          itemHeight={40}
          highlightBorderWidth={0}
          loop
        />
        <Text variant="labelXL">:</Text>
        {/* Minutes Picker */}
        <WheelPicker
          dataSource={minutes}
          selectedIndex={selectedTime.minute()}
          onValueChange={handleMinuteChange}
          wrapperBackground="transparent"
          wrapperHeight={152}
          itemHeight={40}
          highlightBorderWidth={0}
          loop
        />
      </View>
    </View>
  );
};
