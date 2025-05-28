import closeIcon from "../assets/images/icon-close-modal.svg";

export default function UpdatePot(mode = "add") {
  const headerTitle =
    mode === "add" ? "Add to 'Saving'" : "Withdraw from 'Savings'";
  const headerSubText =
    mode === "add"
      ? "Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance."
      : " Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot.";
  return (
    <div>
      <header>
        <div>
          <h1>{headerTitle}</h1>
          <img src={closeIcon} alt="Close Modal"/>
        </div>
        <p>{headerSubText}</p>
      </header>
      <main>
        <div>
            
        </div>
      </main>
    </div>
  );
}
