import React from 'react';

import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { useCSSVariable } from 'uniwind';

interface MessageMarkdownProps {
  text: string;
  isPrivate: boolean;
  isOutgoing: boolean;
}

export function MessageMarkdown({
  text,
  isPrivate,
  isOutgoing,
}: MessageMarkdownProps): React.JSX.Element {
  const [textForeground, textForegroundInverted, textPrivate, colorMuted] =
    useCSSVariable([
      '--color-foreground',
      '--color-foreground-inverted',
      '--color-yellow-600',
      '--color-field-placeholder',
    ]) as string[];
  const textColor = isPrivate
    ? textPrivate
    : isOutgoing
      ? textForegroundInverted
      : textForeground;

  return (
    <Markdown
      markdownit={MarkdownIt({ typographer: true, linkify: true })}
      mergeStyle
      style={{
        text: {
          fontSize: 14,
          fontFamily: 'PlusJakartaSans_400Regular',
          color: textColor,
        },
        strong: {
          fontFamily: 'PlusJakartaSans_600SemiBold',
          fontWeight: '600',
          color: textColor,
        },
        em: {
          fontStyle: 'italic',
          color: textColor,
        },
        paragraph: {
          marginTop: 0,
          marginBottom: 0,
          fontFamily: 'PlusJakartaSans_400Regular',
          color: textColor,
        },
        bullet_list: {
          minWidth: 200,
          color: textColor,
        },
        ordered_list: {
          minWidth: 200,
          color: textColor,
        },
        list_item: {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          color: textColor,
        },
        bullet_list_icon: {
          marginLeft: 0,
          marginRight: 8,
          fontWeight: '900',
        },
        ordered_list_icon: {
          marginLeft: 0,
          marginRight: 8,
          fontWeight: '900',
        },
        code_inline: {
          backgroundColor: colorMuted,
          color: textColor,
        },
        code_block: {
          backgroundColor: colorMuted,
          color: textColor,
        },
      }}
    >
      {text}
    </Markdown>
  );
}
