import { IMessage } from 'react-native-gifted-chat';

import { Message } from '../chat/services/conversation/types';

export type ChatMessage = IMessage & Message;
