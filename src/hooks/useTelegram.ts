import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: any;
  }
}

const useTelegram = () => {
  const [telegram, setTelegram] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (window.Telegram) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      setTelegram(tg);
      setUser(tg.initDataUnsafe?.user || null); // Получаем данные пользователя
    }
  }, []);

  const closeWebApp = () => {
    if (telegram) {
      telegram.close();
    }
  };

  const sendData = (data: any) => {
    if (telegram) {
      telegram.sendData(JSON.stringify(data)); // Отправка данных боту
    }
  };

  return {
    telegram,
    user,
    closeWebApp,
    sendData,
  };
};

export default useTelegram;
