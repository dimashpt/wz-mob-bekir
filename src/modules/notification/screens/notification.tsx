import React, { ReactElement } from 'react';

import { ComingSoon, Container } from '@/components';
import { useNotificationListQuery } from '../services/repository';

function NotificationScreen(): ReactElement {
  useNotificationListQuery();

  return (
    <Container className="pt-safe items-center justify-center">
      <ComingSoon />
    </Container>
  );
}

export default NotificationScreen;
