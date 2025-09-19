
"use client";

import { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, UserRole } from '@/lib/auth';

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: UserRole[]
): ComponentType<P> => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const user = getCurrentUser();
      
      if (!user || !allowedRoles.includes(user.role)) {
        router.replace('/login');
      } else {
        setIsAuthorized(true);
      }
    }, [router]);

    if (!isAuthorized) {
      // You can render a loading spinner here
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
