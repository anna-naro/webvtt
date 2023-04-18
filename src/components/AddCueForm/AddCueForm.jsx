import { useState } from "react";
import styles from "./AddCueForm.module.css";

const initialOptions = {
  text: "",
  startTime: 0,
  endTime: 0,
};

export const AddCueForm = ({ addCue }) => {
  const [options, setOptions] = useState(initialOptions);

  const handleChange = (e) => {
    setOptions((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const hanldeClick = () => {
    addCue(options);
    setOptions(initialOptions);
  };

  return (
    <div onChange={handleChange} className={styles.container}>
      <label>
        Start Time
        <input id="startTime" type="number" value={options.startTime} />
      </label>
      <label>
        End Time
        <input id="endTime" type="number" value={options.endTime} />
      </label>
      <label>
        Text
        <input
          id="text"
          type="text"
          value={options.value}
          onChange={handleChange}
        />
      </label>
      <button onClick={hanldeClick}>ADD</button>
    </div>
  );
};
