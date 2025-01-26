import React, { useState, useEffect } from 'react';
import useTelegram from './hooks/useTelegram';
import './styles/App.css';
import clickerImage from './assets/images/clicker-image.png';

const App: React.FC = () => {
  const {
    user,
    closeWebApp,
    sendData,
    showAlert,
    showConfirm,
    expandWebApp,
  } = useTelegram();

  const [count, setCount] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [upgrades, setUpgrades] = useState([
    { name: 'Улучшение 1', cost: 10, power: 1, purchased: false },
    { name: 'Улучшение 2', cost: 50, power: 5, purchased: false },
  ]);

  // Сохранение прогресса в localStorage
  useEffect(() => {
    localStorage.setItem('count', String(count));
    localStorage.setItem('clickPower', String(clickPower));
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
  }, [count, clickPower, upgrades]);

  // Восстановление прогресса из localStorage
  useEffect(() => {
    const savedCount = localStorage.getItem('count');
    if (savedCount) setCount(parseInt(savedCount, 10));

    const savedClickPower = localStorage.getItem('clickPower');
    if (savedClickPower) setClickPower(parseInt(savedClickPower, 10));

    const savedUpgrades = localStorage.getItem('upgrades');
    if (savedUpgrades) setUpgrades(JSON.parse(savedUpgrades));
  }, []);

  // Обработчик кликов
  const handleClick = () => {
    setCount(count + clickPower);
  };

  // Обработчик покупки улучшений с подтверждением
  const handleUpgradePurchase = async (index: number) => {
    const upgrade = upgrades[index];
    if (count < upgrade.cost || upgrade.purchased) {
      showAlert('Недостаточно монет или улучшение уже куплено!');
      return;
    }

    const confirmed = await showConfirm(
      `Купить ${upgrade.name} за ${upgrade.cost} монет?`
    );
    if (confirmed) {
      setCount(count - upgrade.cost);
      setClickPower(clickPower + upgrade.power);
      setUpgrades(
        upgrades.map((u, i) =>
          i === index ? { ...u, purchased: true } : u
        )
      );
      showAlert('Улучшение куплено!');
    }
  };

  // Отправка данных в Telegram
  const handleSendData = () => {
    sendData({ count, clickPower, upgrades });
    showAlert('Данные отправлены боту!');
  };

  // Расширение приложения
  const handleExpandApp = () => {
    expandWebApp();
    showAlert('Приложение расширено!');
  };

  return (
    <div className="container">
      {/* Блок информации о пользователе */}
      {user && (
        <div className="user-info">
          <p>Привет, {user.first_name}!</p>
          {user.photo_url && (
            <img
              src={user.photo_url}
              alt="User Avatar"
              className="user-avatar"
            />
          )}
        </div>
      )}

      {/* Кликер */}
      <div className="clicker">
        <img
          src={clickerImage}
          alt="Clicker"
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        />
      </div>

      {/* Счетчик */}
      <div className="counter">Монеты: {count}</div>

      {/* Улучшения */}
      <div className="upgrades">
        <h2>Улучшения:</h2>
        <ul>
          {upgrades.map((upgrade, index) => (
            <li key={index}>
              <button
                disabled={count < upgrade.cost || upgrade.purchased}
                onClick={() => handleUpgradePurchase(index)}
              >
                {upgrade.name} ({upgrade.cost} монет)
              </button>
              {upgrade.purchased && <span> - Куплено</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Кнопки взаимодействия с Telegram */}
      <div className="telegram-buttons">
        <button onClick={handleSendData} className="send-data-button">
          Отправить данные боту
        </button>
        <button onClick={closeWebApp} className="close-button">
          Закрыть приложение
        </button>
        <button onClick={handleExpandApp} className="expand-button">
          Расширить приложение
        </button>
      </div>
    </div>
  );
};

export default App;
