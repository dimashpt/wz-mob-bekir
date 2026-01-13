import React, { JSX, useRef } from 'react';
import { View } from 'react-native';

import { useMutation } from '@tanstack/react-query';

import {
  MenuItem,
  OptionBottomSheet,
  OptionBottomSheetRef,
} from '@/components';
import { useAuthStore } from '@/store';
import { profileKeys } from '../constants/keys';
import { ChatProfileResponse, updateAvailability } from '../services';

const AVAILABILITY_OPTIONS = [
  { label: 'Available', value: 'online' },
  { label: 'Busy', value: 'busy' },
  { label: 'Offline', value: 'offline' },
];

export function UserPreferencesSection({
  data,
}: {
  data?: ChatProfileResponse;
}): JSX.Element {
  const availabilityBottomSheetRef = useRef<OptionBottomSheetRef>(null);

  const { chatUser } = useAuthStore();

  const currentAccount = data?.accounts?.find(
    (account) => account.id === chatUser?.account_id,
  );

  const changeAvailabilityMutation = useMutation({
    mutationKey: profileKeys.availability,
    mutationFn: updateAvailability,
    onSuccess: (data, _, __, context) => {
      // Cancel any outgoing queries, so they don't overwrite our optimistic update
      context.client.cancelQueries({ queryKey: profileKeys.chatProfile });

      // Update the chat profile data with the new availability
      context.client.setQueryData(profileKeys.chatProfile, () => data);
    },
  });

  return (
    <View className="gap-md">
      <View className="bg-surface px-lg py-md gap-md border-border rounded-md border">
        <MenuItem.Action
          icon="info"
          label="Availability"
          value={currentAccount?.availability}
          loading={changeAvailabilityMutation.isPending}
          onPress={() => availabilityBottomSheetRef.current?.present()}
        />
      </View>
      <OptionBottomSheet
        ref={availabilityBottomSheetRef}
        options={AVAILABILITY_OPTIONS}
        title="Availability"
        onSelect={(option) =>
          changeAvailabilityMutation.mutate({
            profile: {
              account_id: currentAccount!.id,
              availability: option.value,
            },
          })
        }
        selectedValue={AVAILABILITY_OPTIONS.find(
          (option) => option.value === currentAccount?.availability,
        )}
      />
    </View>
  );
}
