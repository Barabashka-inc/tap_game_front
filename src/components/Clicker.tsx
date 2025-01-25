import React, { useState } from 'react';

const Clicker: React.FC = () => {
  const [coins, setCoins] = useState(0);
  const [clickPower, setClickPower] = useState(1);

  const handleClick = () => {
    setCoins(coins + clickPower);
  };

  return (
    <div>
      <div>Монеты: {coins}</div>
      <button onClick={handleClick}>Click me! (+{clickPower})</button>
    </div>
  );
};

export default Clicker;