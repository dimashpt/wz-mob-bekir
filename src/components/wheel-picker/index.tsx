/**
 * Customized component originally from https://github.com/rheng001/react-native-wheel-scrollview-picker
 * Due to the upstream repository being unmaintained and the latest version (2.0.9) containing TypeScript errors,
 * this file contains a customized version of the wheel-scrollview-picker.
 */
import React, {
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import { useCSSVariable } from 'uniwind';

import { Text } from '../text';

function isNumeric(str: string | unknown): boolean {
  if (typeof str === 'number') return true;
  if (typeof str !== 'string') return false;
  return (
    !isNaN(str as unknown as number) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

const deviceWidth = Dimensions.get('window').width;

const isViewStyle = (style: ViewProps['style']): style is ViewStyle => {
  return (
    typeof style === 'object' &&
    style !== null &&
    Object.keys(style).includes('height')
  );
};

export type ScrollPickerProps<ItemT extends string | number> = {
  style?: ViewProps['style'];
  dataSource: Array<ItemT>;
  selectedIndex?: number;
  onValueChange?: (value: ItemT | undefined, index: number) => void;
  renderItem?: (
    data: ItemT,
    index: number,
    isSelected: boolean,
  ) => React.JSX.Element;
  highlightColor?: string;
  highlightBorderWidth?: number;
  itemTextStyle?: object;
  activeItemTextStyle?: object;
  itemHeight?: number;
  wrapperHeight?: number;
  wrapperBackground?: string;
  loop?: boolean; // Enable infinite scrolling
} & ScrollViewProps;

export type ScrollPickerHandle = {
  scrollToTargetIndex: (val: number) => void;
};

const ScrollPicker: {
  <ItemT extends string | number>(
    props: ScrollPickerProps<ItemT> & { ref?: Ref<ScrollPickerHandle> },
  ): ReactNode;
} = React.forwardRef((propsState, ref) => {
  const { itemHeight = 30, style, ...props } = propsState;
  const [initialized, setInitialized] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(
    props.selectedIndex && props.selectedIndex >= 0 ? props.selectedIndex : 0,
  );
  const sView = useRef<ScrollView>(null);
  const pendingValueChangeRef = useRef<{
    value: (typeof props.dataSource)[0] | undefined;
    index: number;
  } | null>(null);
  const repositionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const loop = props.loop ?? false; // Default to false

  // For infinite scroll, we replicate the data multiple times
  const REPLICATIONS = 3; // Number of times to replicate the data (must be odd for centering)
  const dataLength = props.dataSource.length;
  const infiniteData = loop
    ? Array.from(
        { length: dataLength * REPLICATIONS },
        (_, i) => props.dataSource[i % dataLength],
      )
    : props.dataSource;
  const centerOffset = loop ? dataLength * Math.floor(REPLICATIONS / 2) : 0;

  useImperativeHandle(ref, () => ({
    scrollToTargetIndex: (val: number) => {
      if (loop) {
        const normalizedIndex = ((val % dataLength) + dataLength) % dataLength;
        setSelectedIndex(normalizedIndex);
        const scrollIndex = centerOffset + normalizedIndex;
        sView?.current?.scrollTo({ y: scrollIndex * itemHeight });
      } else {
        setSelectedIndex(val);
        sView?.current?.scrollTo({ y: val * itemHeight });
      }
    },
  }));

  const wrapperHeight =
    props.wrapperHeight ||
    (isViewStyle(style) && isNumeric(style.height)
      ? Number(style.height)
      : 0) ||
    itemHeight * 5;

  useEffect(
    function initialize() {
      if (initialized) return;
      setInitialized(true);

      setTimeout(() => {
        // Start at the center replication if loop is enabled
        const y = loop
          ? itemHeight * (centerOffset + selectedIndex)
          : itemHeight * selectedIndex;
        sView?.current?.scrollTo({ y: y });
      }, 0);

      return () => {
        if (repositionTimeoutRef.current) {
          clearTimeout(repositionTimeoutRef.current);
        }
      };
    },
    [initialized, itemHeight, selectedIndex, centerOffset, loop, sView],
  );

  // Call onValueChange after state update to avoid setState during render
  useEffect(() => {
    if (pendingValueChangeRef.current && props.onValueChange) {
      props.onValueChange(
        pendingValueChangeRef.current.value,
        pendingValueChangeRef.current.index,
      );
      pendingValueChangeRef.current = null;
    }
  }, [selectedIndex, props.onValueChange]);

  function renderPlaceHolder(): { header: ReactNode; footer: ReactNode } {
    const h = (wrapperHeight - itemHeight) / 2;
    const header = <View style={{ height: h, flex: 1 }} />;
    const footer = <View style={{ height: h, flex: 1 }} />;
    return { header, footer };
  }

  function renderItem(
    data: (typeof props.dataSource)[0],
    index: number,
  ): ReactNode {
    // Get the actual index in the original data
    const actualIndex = loop ? index % dataLength : index;
    const isSelected = actualIndex === selectedIndex;

    const item = props.renderItem ? (
      props.renderItem(data, actualIndex, isSelected)
    ) : (
      <Text
        variant={isSelected ? 'labelL' : 'bodyM'}
        className={isSelected ? 'text-foreground' : 'text-foreground-muted'}
        style={isSelected ? props.activeItemTextStyle : props.itemTextStyle}
      >
        {data}
      </Text>
    );

    return (
      <View
        className="items-center justify-center"
        style={{ height: itemHeight }}
        key={index}
      >
        {item}
      </View>
    );
  }

  const scrollFix = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      let y = 0;
      const h = itemHeight;
      if (e.nativeEvent.contentOffset) {
        y = e.nativeEvent.contentOffset.y;
      }
      const scrolledIndex = Math.round(y / h);

      if (loop) {
        // Calculate the actual index in the original data
        const actualIndex = scrolledIndex % dataLength;
        const normalizedIndex =
          ((actualIndex % dataLength) + dataLength) % dataLength;

        // Check if we need to "loop" the scroll position
        // If we're in the first or last replication, jump to the center
        if (scrolledIndex < dataLength) {
          // We're in the first replication, jump to center
          const newY = (scrolledIndex + centerOffset) * h;
          sView?.current?.scrollTo({ y: newY, animated: false });

          // Clear any existing timeout
          if (repositionTimeoutRef.current) {
            clearTimeout(repositionTimeoutRef.current);
          }

          // Update selection after repositioning completes
          repositionTimeoutRef.current = setTimeout(() => {
            setSelectedIndex(normalizedIndex);
            if (props.onValueChange) {
              const selectedValue = props.dataSource[normalizedIndex];
              pendingValueChangeRef.current = {
                value: selectedValue,
                index: normalizedIndex,
              };
            }
          }, 100);
          return;
        } else if (scrolledIndex >= dataLength * (REPLICATIONS - 1)) {
          // We're in the last replication, jump to center
          const offset = scrolledIndex - dataLength * (REPLICATIONS - 1);
          const newY = (centerOffset + offset) * h;
          sView?.current?.scrollTo({ y: newY, animated: false });

          // Clear any existing timeout
          if (repositionTimeoutRef.current) {
            clearTimeout(repositionTimeoutRef.current);
          }

          // Update selection after repositioning completes
          repositionTimeoutRef.current = setTimeout(() => {
            setSelectedIndex(normalizedIndex);
            if (props.onValueChange) {
              const selectedValue = props.dataSource[normalizedIndex];
              pendingValueChangeRef.current = {
                value: selectedValue,
                index: normalizedIndex,
              };
            }
          }, 100);
          return;
        }

        if (selectedIndex === normalizedIndex) {
          return;
        }

        // onValueChange
        if (props.onValueChange) {
          const selectedValue = props.dataSource[normalizedIndex];
          setSelectedIndex(normalizedIndex);
          pendingValueChangeRef.current = {
            value: selectedValue,
            index: normalizedIndex,
          };
        }
      } else {
        // Original non-loop behavior
        const _selectedIndex = scrolledIndex;

        if (selectedIndex === _selectedIndex) {
          return;
        }

        // onValueChange
        if (props.onValueChange) {
          const selectedValue = props.dataSource[_selectedIndex];
          setSelectedIndex(_selectedIndex);
          pendingValueChangeRef.current = {
            value: selectedValue,
            index: _selectedIndex,
          };
        }
      }
    },
    [
      itemHeight,
      props,
      selectedIndex,
      dataLength,
      centerOffset,
      loop,
      REPLICATIONS,
    ],
  );

  function onMomentumScrollEnd(
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ): void {
    // After momentum scrolling ends, update the selection
    scrollFix(e);
  }

  const { header, footer } = renderPlaceHolder();
  const highlightWidth = (isViewStyle(style) ? style.width : 0) || deviceWidth;
  const highlightColor = useCSSVariable('--color-accent-soft') as string;
  const highlightBorderWidth = props.highlightBorderWidth ?? 0.5;

  // Calculate snap offsets for each item to center them in the highlight
  const snapOffsets = infiniteData.map((_, index) => index * itemHeight);

  const wrapperStyle: ViewStyle = {
    height: wrapperHeight,
    flex: 1,
    backgroundColor: props.wrapperBackground || '#fafafa',
    overflow: 'hidden',
  };

  const highlightStyle: ViewStyle = {
    position: 'absolute',
    top: (wrapperHeight - itemHeight) / 2,
    height: itemHeight,
    width: highlightWidth,
    borderTopColor: highlightColor,
    borderBottomColor: highlightColor,
    borderTopWidth: highlightBorderWidth,
    borderBottomWidth: highlightBorderWidth,
  };

  return (
    <View style={wrapperStyle}>
      <View style={highlightStyle} />
      <ScrollView
        ref={sView}
        bounces={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        decelerationRate="normal"
        snapToOffsets={snapOffsets}
        snapToAlignment="start"
        onMomentumScrollEnd={onMomentumScrollEnd}
        {...props}
      >
        {header}
        {infiniteData.map(renderItem)}
        {footer}
      </ScrollView>
    </View>
  );
});
export default ScrollPicker;
