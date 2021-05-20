import { useEffect, useState } from 'react';
import './styles.css';

export const Leaderboard = ({data = []}) => {
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    const orderByScore = (a, b) => {
      return b.score - a.score;
    }

    if (data.length > 0) {
      const sorted = data.sort(orderByScore);
      setSortedData(sorted);
    }
  }, [data])

  return (
    <div className="leaderboard">
      <div className="row header-row">
        <div className="cell">Aavegotchi</div>
        <div className="cell">Score</div>
      </div>
      {sortedData.map((item, i) => {
        return (
          <div className="row" key={i}>
            <div className="cell">{i + 1}. {item.name} [{item.tokenId}]</div>
            <div className="cell">{item.score}</div>
          </div>
        )
      })}
    </div>
  )
}