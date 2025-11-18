import type { ImagePreviewModal as ImagePreviewModalType } from '@/components/image-preview-modal';

import React, { useRef } from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';

import { Image as ExpoImage, ImageStyle } from 'expo-image';
import { withUniwind } from 'uniwind';

import { Clickable } from '@/components/clickable';
import { Icon } from '@/components/icon';
import { ImagePreviewModal } from '@/components/image-preview-modal';

const Image = withUniwind(ExpoImage);

interface ProfilePictureProps {
  /** Profile picture URI */
  profilePictureUri?: string;
  /** Callback when profile picture is pressed and no image exists */
  onProfilePress?: () => void;
  /** Custom styles for the profile photo container */
  style?: ViewStyle;
  /** Custom styles for the profile photo */
  photoStyle?: ImageStyle;
  /** Enable haptic feedback on press */
  enableHaptic?: boolean;
  /** Custom class name for the profile picture container */
  className?: string;
  /** Custom class name for the profile photo */
  photoClassName?: string;
}

/**
 * ProfilePicture component with zoom preview functionality
 * Displays user profile picture with animated zoom modal when tapped
 */
export function ProfilePicture({
  profilePictureUri,
  onProfilePress,
  style,
  photoStyle,
  enableHaptic = true,
  className,
  photoClassName,
}: ProfilePictureProps): React.JSX.Element {
  const imagePreviewRef = useRef<ImagePreviewModalType>(null);

  const { width: screenWidth } = Dimensions.get('window');
  const profileImageWidth = screenWidth * 0.8; // 70% of screen width for profile pictures

  function handlePress(): void {
    if (profilePictureUri) {
      imagePreviewRef.current?.open(profilePictureUri);
    } else if (onProfilePress) {
      onProfilePress();
    }
  }

  return (
    <>
      <Clickable
        style={style}
        className={className}
        onPress={handlePress}
        enableHaptic={enableHaptic}
      >
        {profilePictureUri ? (
          <Image
            source={{ uri: profilePictureUri }}
            style={photoStyle}
            className={photoClassName}
          />
        ) : (
          <View className="bg-muted h-15 w-15 items-center justify-center rounded-full">
            <Icon name="user" size={20} className="text-foreground-muted" />
          </View>
        )}
      </Clickable>

      <ImagePreviewModal
        ref={imagePreviewRef}
        rounded
        imageWidth={profileImageWidth}
      />
    </>
  );
}
