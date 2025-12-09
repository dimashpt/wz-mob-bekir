import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { FlatList, FlatListProps, Keyboard, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Clickable } from '@/components/clickable';
import { Dialog, DialogRef } from '@/components/dialog';
import { Divider } from '@/components/divider';
import { Icon } from '@/components/icon';
import { InputField } from '@/components/input-field';
import { Option } from '@/components/option-bottom-sheet';
import { Text } from '@/components/text';

export interface SelectSearchProps<TData = unknown> extends Omit<
  React.ComponentPropsWithoutRef<typeof InputField>,
  'value' | 'onChangeText' | 'editable' | 'right'
> {
  options: Option<TData>[];
  onSelect: (value: Option<TData> | null) => void;
  selected?: Option<TData> | null;
  placeholder?: string;
  title?: string;
  hideTouchable?: boolean;
  flatListProps?: Omit<FlatListProps<Option<TData>>, 'data' | 'renderItem'>;
  renderItem?: (props: {
    item: Option<TData>;
    index: number;
    onSelect: () => void;
  }) => React.ReactElement;
  search?: {
    onSearchChange?: (text: string) => void;
    placeholder?: string;
    isLoading?: boolean;
  };
}

export interface SelectSearchRef {
  open: () => void;
  close: () => void;
}

function SelectSearchInner<TData = unknown>(
  {
    options,
    onSelect,
    selected = null,
    placeholder,
    label,
    mandatory,
    title,
    hideTouchable = false,
    renderItem,
    flatListProps,
    ...props
  }: SelectSearchProps<TData>,
  ref: React.ForwardedRef<SelectSearchRef>,
): React.ReactElement {
  const { t } = useTranslation();
  const dialogRef = useRef<DialogRef>(null);
  const [selectedValue, setSelectedValue] = useState<Option<TData> | null>(
    selected,
  );
  const [searchText, setSearchText] = useState('');
  const defaultPlaceholder = placeholder ?? t('select_input.placeholder');

  function handleSearchChange(text: string): void {
    setSearchText(text);
    props.search?.onSearchChange?.(text);
  }

  function handleSelect(option: Option<TData>): void {
    const newValue = selectedValue === option ? null : option;
    setSelectedValue(newValue);
    onSelect(newValue);
    dialogRef.current?.close();
    setSearchText('');
  }

  function handlePresentDialogPress(): void {
    Keyboard.dismiss();
    setSearchText('');
    dialogRef.current?.open();
  }

  useImperativeHandle(ref, () => ({
    open: handlePresentDialogPress,
    close: () => {
      setSearchText('');
      dialogRef.current?.close();
    },
  }));

  useEffect(() => {
    setSelectedValue(selected);
  }, [selected]);

  return (
    <View className="gap-xs">
      {hideTouchable ? null : (
        <>
          <Text variant="labelS" className="font-medium">
            {label}
            {mandatory ? (
              <Text variant="labelM" color="danger" className="font-medium">
                *
              </Text>
            ) : null}
          </Text>
          <Clickable
            onPress={props.disabled ? undefined : handlePresentDialogPress}
            pointerEvents="box-only"
          >
            <InputField
              mandatory={mandatory}
              value={selectedValue?.label || ''}
              placeholder={defaultPlaceholder}
              editable={false}
              right={
                <Icon
                  name="search"
                  size="base"
                  className="text-field-placeholder"
                />
              }
              {...props}
            />
          </Clickable>
        </>
      )}

      <Dialog
        ref={dialogRef}
        containerClassName="p-0 bg-transparent"
        position="top"
      >
        {title && (
          <Text variant="headingXS" className="mb-sm text-center">
            {title}
          </Text>
        )}
        <View className="z-1">
          <InputField
            placeholder={props.search?.placeholder || t('general.search')}
            className="bg-surface border-border rounded-tl-md rounded-tr-md rounded-br-none rounded-bl-none border-0 border-b"
            inputClassName="py-lg px-lg bg-surface rounded-"
            autoFocus
            value={searchText}
            onChangeText={handleSearchChange}
            loading={props.search?.isLoading ?? false}
            left={
              <Icon
                name="search"
                size={20}
                className="text-field-placeholder"
              />
            }
          />
        </View>

        <FlatList
          {...flatListProps}
          data={options}
          keyExtractor={(item) => item.value}
          ItemSeparatorComponent={() => <Divider />}
          className="bg-surface rounded-b-md"
          ListEmptyComponent={
            <View className="p-lg items-center justify-center">
              <Text variant="bodyS" color="muted">
                {searchText.length === 0
                  ? t('select_input.min_characters')
                  : searchText.length < 3
                    ? t('select_input.min_characters')
                    : t('select_input.no_results', { search: searchText })}
              </Text>
            </View>
          }
          renderItem={({ item, index }) =>
            renderItem ? (
              renderItem({ item, index, onSelect: () => handleSelect(item) })
            ) : (
              <Clickable
                onPress={() => handleSelect(item)}
                className="p-md rounded-md"
              >
                <Text variant="bodyS">{item.label}</Text>
                {item.description ? (
                  <Text variant="bodyXS" color="muted">
                    {item.description}
                  </Text>
                ) : null}
              </Clickable>
            )
          }
        />
      </Dialog>
    </View>
  );
}

export const SelectSearch = forwardRef(SelectSearchInner) as <TData = unknown>(
  props: SelectSearchProps<TData> & {
    ref?: React.ForwardedRef<SelectSearchRef>;
  },
) => React.ReactElement;
