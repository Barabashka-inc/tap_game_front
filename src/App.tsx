import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faHandPointer } from '@fortawesome/free-solid-svg-icons';
import CountUp from 'react-countup';

const App: React.FC = () => {
  const [coins, setCoins] = useState(0);
  const [coinsPerSecond, setCoinsPerSecond] = useState(0);
  const [clickPower, setClickPower] = useState(1);

  const webApp = window.Telegram.WebApp;

  useEffect(() => {
    // Инициализация Telegram WebApp
    webApp.ready();

    // Настройка главной кнопки (необязательно)
    webApp.MainButton.setText('Поделиться счётом');
    webApp.MainButton.onClick(() => {
      webApp.sendData(String(coins));
    });

    // Восстановление прогресса из localStorage (необязательно)
    const savedCoins = localStorage.getItem('coins');
    if (savedCoins) {
      setCoins(parseInt(savedCoins, 10));
    }
  }, []);

  useEffect(() => {
    // Сохранение прогресса в localStorage (необязательно)
    localStorage.setItem('coins', String(coins));
  }, [coins]);

  const handleClick = () => {
    setCoins(coins + clickPower);
  };

  // Обработка покупок улучшений (пример)
  const handleUpgradePurchase = (cost: number, power: number) => {
    if (coins >= cost) {
      setCoins(coins - cost);
      setClickPower(clickPower + power);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center text-4xl font-bold mb-8">
        <CountUp end={coins} duration={0.5} />
        <FontAwesomeIcon icon={faCoins} className="ml-2 text-yellow-500" />
      </div>

      {/* Кликер */}
      <div className="flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-2xl"
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={faHandPointer} className="mr-2" />
          Click!
        </button>
      </div>

      {/* Улучшения (пример) */}
      <div className="mt-8">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
          onClick={() => handleUpgradePurchase(10, 1)}
        >
          Улучшение 1 (10 монет)
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleUpgradePurchase(50, 5)}
        >
          Улучшение 2 (50 монет)
        </button>
      </div>

      {/* Статистика (пример) */}
      <div className="mt-8">
        <p>Монеты в секунду: {coinsPerSecond}</p>
        <p>Сила клика: {clickPower}</p>
      </div>
    </div>
  );
};

export default App;