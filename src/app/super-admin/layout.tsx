
import { ReactNode } from 'react';
import { SuperAdminLayoutClient } from './_components/super-admin-layout-client';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <SuperAdminLayoutClient>
      {children}
    </SuperAdminLayoutClient>
  );
}
