import { useFirebase } from '../../firebase';
import './styles.css';

export const Leaderboard = () => {
  const { highscores } = useFirebase();

  return (
    <div className="leaderboard">
      <div className="row header-row glow">
        <div className="cell">Aavegotchi</div>
        <div className="cell">Score</div>
      </div>
      {highscores?.map((item, i) => {
        return (
          <div className="row glow" key={i}>
            <div className="cell">{i + 1}. {item.name} [{item.tokenId}]</div>
            <div className="cell">{item.score}</div>
          </div>
        )
      })}
    </div>
  )
}