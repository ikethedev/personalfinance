import downArrow from "../assets/images/icon-caret-down.svg";
import { useState, useEffect, useRef } from "react";
import { updateCount, handleKeyDown } from "../utils/General"
import pageStyles from "../styles/commonmodal.module.css";

export default function ModalForm( {formName, placeholder, initialData, onFormChange, hideName = false }) {
  const colors = [
    { id: 1, name: "Green", hex: "#00A300", rgb: "rgb(0, 163, 0)" },
    { id: 2, name: "Yellow", hex: "#FFD700", rgb: "rgb(255, 215, 0)" },
    { id: 3, name: "Cyan", hex: "#00FFFF", rgb: "rgb(0, 255, 255)" },
    { id: 4, name: "Navy", hex: "#000080", rgb: "rgb(0, 0, 128)" },
    { id: 5, name: "Red", hex: "#FF0000", rgb: "rgb(255, 0, 0)" },
    { id: 6, name: "Purple", hex: "#800080", rgb: "rgb(128, 0, 128)" },
    { id: 7, name: "Turquoise", hex: "#40E0D0", rgb: "rgb(64, 224, 208)" },
    { id: 8, name: "Brown", hex: "#A52A2A", rgb: "rgb(165, 42, 42)" },
    { id: 9, name: "Magenta", hex: "#FF00FF", rgb: "rgb(255, 0, 255)" },
    { id: 10, name: "Blue", hex: "#0000FF", rgb: "rgb(0, 0, 255)" },
    { id: 11, name: "Navy Grey", hex: "#3B444B", rgb: "rgb(59, 68, 75)" },
    { id: 12, name: "Army Green", hex: "#4B5320", rgb: "rgb(75, 83, 32)" },
    { id: 13, name: "Pink", hex: "#FFC0CB", rgb: "rgb(255, 192, 203)" },
    { id: 14, name: "Gold", hex: "#FFD700", rgb: "rgb(255, 215, 0)" },
    { id: 15, name: "Orange", hex: "#FFA500", rgb: "rgb(255, 165, 0)" },
  ];

const [theme, setTheme] = useState(() => {
    const name = initialData?.theme || "Green";
    const foundColor = colors.find((color) => color.name === name);
    return {
      name: name,
      rgb: foundColor ? foundColor.rgb : colors[0].rgb,
    };
  });

  const [showColors, setShowColors] = useState(false);
  const [count, setCount] = useState(30);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    target: initialData?.target || '',
    theme: initialData?.theme || 'Green'
  });

  const prevFormData = useRef({
    name: initialData?.name || '',
    target: initialData?.target || '',
    theme: initialData?.theme || ''
  });
  
  useEffect(() => {
    if(onFormChange && (
      prevFormData.current.name !== formData.name ||
      prevFormData.current.target !== formData.target ||
      prevFormData.current.theme !== theme.name
    )) {
      onFormChange({
        ...formData, 
        theme: theme.name
      });
      // Update the ref with current values
      prevFormData.current = {
        name: formData.name,
        target: formData.target,
        theme: theme.name
      };
    }
  }, [formData, theme, onFormChange]);


  

  useEffect(() => {
    if(onFormChange) {
      onFormChange({
        ...formData, 
        theme: theme.name
      })
    }
  }, [formData, theme, onFormChange])


  const handleNameChange = (e) => {
    const newName = e.target.value;
    updateCount(e, setCount, setDisabled)
    setFormData({
      ...formData, 
      name: newName
    })
  }
  
  const handleTargetChange = (e) => {
    const newTarget = e.target.value;
    setFormData({
      ...formData, 
      target: newTarget
    })
  }

 const handleThemeUpdate = (color) => {
  setTheme(color);
  setFormData({
    ...formData, 
    theme: color.name
  })
  setShowColors(false)
 }

 const handleKeyDownName = (e) => {
  handleKeyDown(e, disabled, setDisabled);
}


  const SaveChanges = (e) => {
    e.preventDefault();
    closeModal();
  };

  const CreatePot = (e) => {
    e.preventDefault();
    closeModal();
  };


  return (
    <>
      <form className={pageStyles.form}>
      {!hideName &&  <div className={pageStyles.input}>
         <label htmlFor="name" className={pageStyles.input_title}>
           {formName}
         </label>
         <input
           className={pageStyles.input_feild}
           onChange={handleNameChange}
           onKeyDown={handleKeyDownName}
           type="text"
           name=""
           id=""
           placeholder={placeholder}
           value={formData.name}
         />
         <p className={pageStyles.character_count}>
           {count} of 30 characters left
         </p>
       </div>}
       
        <div className={`${pageStyles.input} ${pageStyles.target_container}`}>
          <label htmlFor="target" className={`${pageStyles.input_title} `}>
            Target
          </label>
          <div className={pageStyles.input_feild}>
            <span className={pageStyles.input_span}>
              $
              <input
                onChange={handleTargetChange}
                className={pageStyles.input}
                type="text"
                name="target"
                id="target"
                value={formData.target}
              />
            </span>
          </div>
        </div>
        <div>
          <label htmlFor="name" className={pageStyles.input_title}>
            Theme
          </label>
          <div
            onClick={() => setShowColors(!showColors)}
            className={`${pageStyles.input_feild} ${pageStyles.theme_container}`}
          >
            <div
              className={`${pageStyles.theme} ${pageStyles.color_container} ${pageStyles.input_title}`}
            >
              <div
                style={{
                  backgroundColor: theme.rgb,
                  height: "1rem",
                  width: "1rem",
                  borderRadius: "50%",
                }}
              ></div>
              <p>{theme.name}</p>
            </div>
            <img src={downArrow} alt="toggle theme choose" />
          </div>
        </div>
        {/* this needs to be abstracted out to a component*/}
        {showColors && (
          <ul className={pageStyles.options}>
            {colors.map((color) => (
              <li
                onClick={() => handleThemeUpdate(color)}
                className={`${pageStyles.options_list_item} ${
                  theme.name === color.name ? pageStyles.active_color : ""
                }`}
                id={color.id}
              >
                <div className={pageStyles.color_container}>
                  <div
                    className={pageStyles.color_circle}
                    style={{
                      backgroundColor: color.rgb,
                      height: "1rem",
                      width: "1rem",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <p className={pageStyles.color_name}>{color.name}</p>
                </div>
                {theme.name === color.name && (
                  <svg
                    className={pageStyles.check_icon}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.00016 10.7999L3.20016 7.9999L2.26683 8.93324L6.00016 12.6666L14.0002 4.66657L13.0668 3.73324L6.00016 10.7999Z"
                      fill="#00A300"
                    />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        )}
      </form>
    </>
  );
}
