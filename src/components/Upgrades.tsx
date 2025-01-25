import React from 'react';

interface Upgrade {
  name: string;
  cost: number;
  power: number;
  purchased: boolean;
  onPurchase: () => void;
  disabled: boolean;
}

const Upgrades: React.FC<{ upgrades: Upgrade[] }> = ({ upgrades }) => {
  return (
    <div className="upgrades">
      <h2>Улучшения:</h2>
      <ul>
        {upgrades.map((upgrade, index) => (
          <li key={index}>
            <button onClick={upgrade.onPurchase} disabled={upgrade.disabled}>
              {upgrade.name} ({upgrade.cost} монет)
            </button>
            {upgrade.purchased && <span> - Куплено</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Upgrades;
