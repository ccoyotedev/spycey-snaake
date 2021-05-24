import { useFirebase } from '../../firebase';
import { useState, useEffect } from 'react';
import './styles.css';

export const Leaderboard = () => {
  const { highscores } = useFirebase();

  const [ currentPage, setCurrentPage ] = useState(0);

  const pageTotal = 50;

  // For testing --------
  // useEffect(() => {
  //   if (!highscores) return;

  //   setData(fillArray(highscores[0], 51))
  // }, [highscores])

  // function fillArray(value, len) {
  //   if (!value) return undefined;
  //   var arr = [];
  //   for (var i = 0; i < len; i++) {
  //     arr.push(value);
  //   }
  //   return arr;
  // }

  return (
    <div className="leaderboard">
      <div className="title-container">
        <h2>Leaderboard</h2>
      </div>
      <div className="row header-row glow">
        <div className="cell">Aavegotchi</div>
        <div className="cell">Score</div>
      </div>
      {highscores?.slice(currentPage * pageTotal, currentPage * pageTotal + pageTotal).map((item, i) => {
        return (
          <div className="row glow" key={item.tokenId}>
            <div className="cell">{i + 1 + currentPage * pageTotal}. {item.name} [{item.tokenId}]</div>
            <div className="cell">{item.score}</div>
          </div>
        )
      })}
      {highscores?.length > pageTotal &&
        <div className="page-selector">
          {
            Array(Math.ceil(highscores.length / pageTotal)).fill().map((_, i) => {
              return (
                <div
                  className={`selector ${i === currentPage ? 'selected glow' : ''}`}
                  onClick={() => setCurrentPage(i)}
                >
                  {i + 1}
                </div>
              )
            })
          }
        </div>
      }
    </div>
  )
}