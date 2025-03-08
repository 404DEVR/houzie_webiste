'use client';

import * as React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
  Bell,
  Crown,
  Moon,
  Sun,
} from 'lucide-react';

type ToastType =
  | 'success'
  | 'error'
  | 'info'
  | 'default'
  | 'destructive'
  | 'warning'
  | 'premium'
  | 'dark'
  | 'light';

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  duration?: number;
  showProgress?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer = () => {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { toasts, removeToast } = context;

  return (
    <div className='fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-md'>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

import { CustomToast } from '@/components/ui/custom-toast';

const ToastItem = ({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) => {
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    if (!toast.showProgress || toast.duration === 0) return;

    const duration = toast.duration || 5000;
    const interval = 10;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - step;
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [toast.duration, toast.showProgress]);

  return (
    <CustomToast
      variant={toast.type === 'default' ? 'default' : toast.type}
      title={toast.title}
      description={toast.description}
      icon={toast.icon}
      image={toast.image}
      onClose={onClose}
      showProgress={toast.showProgress}
      progress={progress}
      className='animate-in slide-in-from-right-full duration-300'
    />
  );
};

export const useCustomToast = () => {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast } = context;

  const getIconForType = (type: ToastType): React.ReactNode => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className='h-6 w-6' />;
      case 'error':
      case 'destructive':
        return <XCircle className='h-6 w-6' />;
      case 'warning':
        return <AlertCircle className='h-6 w-6' />;
      case 'premium':
        return <Crown className='h-6 w-6' />;
      case 'info':
        return <Info className='h-6 w-6' />;
      case 'dark':
      case 'light':
        return <Bell className='h-6 w-6' />;
      default:
        return <Bell className='h-6 w-6' />;
    }
  };

  return {
    toast: (props: {
      title?: string;
      description?: string;
      type?: ToastType;
      icon?: React.ReactNode;
      image?: string;
      duration?: number;
    }) => {
      const { type = 'info', icon, ...rest } = props;
      addToast({
        type,
        icon: icon || getIconForType(type),
        ...rest,
      });
    },
    success: (props: Omit<Toast, 'id' | 'type' | 'icon'>) => {
      addToast({
        type: 'success',
        icon: <CheckCircle2 className='h-6 w-6' />,
        ...props,
      });
    },
    error: (props: Omit<Toast, 'id' | 'type' | 'icon'>) => {
      addToast({
        type: 'error',
        icon: <XCircle className='h-6 w-6' />,
        ...props,
      });
    },
    info: (props: Omit<Toast, 'id' | 'type' | 'icon'>) => {
      addToast({
        type: 'info',
        icon: <Info className='h-6 w-6' />,
        ...props,
      });
    },
    custom: (props: Omit<Toast, 'id'>) => {
      addToast(props);
    },
    destructive: (props: Omit<Toast, 'id' | 'type' | 'icon'>) => {
      addToast({
        type: 'destructive',
        icon: <XCircle className='h-6 w-6' />,
        ...props,
      });
    },
    warning: (props: Omit<Toast, 'id' | 'type' | 'icon'>) => {
      addToast({
        type: 'warning',
        icon: <AlertCircle className='h-6 w-6' />,
        ...props,
      });
    },
    premium: (props: Omit<Toast, 'id' | 'type' | 'icon'>) => {
      addToast({
        type: 'premium',
        icon: <Crown className='h-6 w-6' />,
        ...props,
      });
    },
    dark: (props: Omit<Toast, 'id' | 'type' | 'icon'>) => {
      addToast({
        type: 'dark',
        icon: <Moon className='h-6 w-6' />,
        ...props,
      });
    },
    light: (props: Omit<Toast, 'id' | 'type' | 'icon'>) => {
      addToast({
        type: 'light',
        icon: <Sun className='h-6 w-6' />,
        ...props,
      });
    },
  };
};
