import { useEffect, useState } from 'react';
import { convertInlineSVGToBlobURL } from '../../helpers';
import './styles.css';

export const GotchiSelector = ({ gotchis, handleSelect }) => {
  const [ selectedIndex, setSelectedIndex ] = useState(0);
  const [ open, setOpen ] = useState(false);

  useEffect(() => {
    handleSelect(gotchis[selectedIndex])
  }, [selectedIndex, gotchis, handleSelect])

  return (
    <div className="selector-container">
      <div className="img-container glow">
        <img src={convertInlineSVGToBlobURL(gotchis[selectedIndex].svg)} alt="selected gotchi" />
      </div>
      <div className="selector-col">
        <h3>Select Aavegotchi:</h3>
        <div className="dropdown-container glow" onClick={() => setOpen(prevState => !prevState)}>
          <p>{gotchis[selectedIndex].name}</p>
          <span className={`chevron ${open ? 'chevron-down': ''}`}>▲</span>
          {open &&
            <div className="dropdown">
              {gotchis.map((gotchi, i) => {
              return (
                <option value={i} onClick={() => setSelectedIndex(i)} className="glow" key={i}>
                  {gotchi.name}
                </option>
              )
            })}
            </div>
          }
        </div>
      </div>
    </div>
  )
}