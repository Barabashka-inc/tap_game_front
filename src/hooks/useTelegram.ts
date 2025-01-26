import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user: TelegramUser | null;
  };
  sendData: (data: string) => void;
  close: () => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
  expand: () => void;
  onEvent: (event: string, callback: () => void) => void;
  offEvent: (event: string, callback: () => void) => void;
  ready: () => void;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

const useTelegram = () => {
  const [telegram, setTelegram] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    if (window.Telegram) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      setTelegram(tg);
      setUser(tg.initDataUnsafe?.user || null);

      // События, которые можно отслеживать
      const handleThemeChange = () => {
        console.log('Theme changed');
      };
      tg.onEvent('themeChanged', handleThemeChange);

      return () => {
        tg.offEvent('themeChanged', handleThemeChange);
      };
    } else {
      console.error('Telegram API не найден');
    }
  }, []);

  const closeWebApp = () => {
    try {
      telegram?.close();
    } catch (error) {
      console.error('Ошибка при закрытии приложения:', error);
    }
  };

  const sendData = (data: Record<string, any>) => {
    try {
      if (telegram) {
        telegram.sendData(JSON.stringify(data));
        console.log('Данные отправлены в Telegram:', data);
      } else {
        console.error('Telegram API недоступен');
      }
    } catch (error) {
      console.error('Ошибка отправки данных:', error);
    }
  };

  const showAlert = (message: string) => {
    try {
      telegram?.showAlert(message);
    } catch (error) {
      console.error('Ошибка отображения уведомления:', error);
    }
  };

  const showConfirm = async (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        telegram?.showConfirm(message, resolve);
      } catch (error) {
        console.error('Ошибка отображения подтверждения:', error);
        resolve(false);
      }
    });
  };

  const expandWebApp = () => {
    try {
      telegram?.expand();
    } catch (error) {
      console.error('Ошибка расширения приложения:', error);
    }
  };

  return {
    telegram,
    user,
    closeWebApp,
    sendData,
    showAlert,
    showConfirm,
    expandWebApp,
  };
};

export default useTelegram;
