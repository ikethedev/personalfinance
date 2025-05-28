
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };


  
export function updateCount(e, setCount, setDisabled, max = 30) {
  const newCount = max - e.target.value.length;
  
  if (newCount <= 0) {
    setCount(0);
    setDisabled(true);
    // Trim the value to max length to prevent overflow
    e.target.value = e.target.value.substring(0, max);
  } else {
    setDisabled(false);
    setCount(newCount);
  }
}

export function handleKeyDown(e, disabled, setDisabled) {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];

  if (disabled && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }

  // If user presses backspace/delete, re-enable the input
  if (allowedKeys.includes(e.key) && disabled) {
    setDisabled(false);
  }
}

export { formatDate }