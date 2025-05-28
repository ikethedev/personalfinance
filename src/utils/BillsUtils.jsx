import billPaid from "../assets/images/icon-bill-paid.svg";
import billsDueSoon from "../assets/images/icon-bill-due.svg";

const getStatusIcon = (item) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const billDay = item.recurring_day;

    const isPaid = currentDay > billDay;
    const isDueSoon = billDay - currentDay <= 3 && billDay - currentDay >= 0;

    return isPaid ? (
      <img src={billPaid} alt="Paid" />
    ) : isDueSoon ? (
      <img src={billsDueSoon} alt="Due Soon" />
    ) : null;
  };

const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

const getTotalMonthlyBills = (transactions) => {
    const getCurrentDate = new Date();
    const currentMonth = getCurrentDate.getMonth();
    const currentYear = getCurrentDate.getFullYear();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(getCurrentDate.getDate() + 7);

    const billsDueSoon = transactions.filter((item) => {
      const txDate = new Date(item.date);
      return (
        item.category === "Bills" &&
        txDate > getCurrentDate &&
        txDate <= sevenDaysFromNow
      );
    });

    const billsDueSoonCount = billsDueSoon.length;

    const paidBills = transactions.filter((item) => {
      const txDate = new Date(item.date);
      return (
        item.category === "Bills" &&
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear &&
        item.amount < 0
      );
    });

    const paidTotal = paidBills.reduce(
      (acc, cur) => acc + Math.abs(cur.amount),
      0
    );
    const paidCount = paidBills.length;

    const expectedBills = transactions.filter(
      (item) =>
        item.recurring &&
        item.category === "Bills" &&
        item.amount < 0 &&
        !paidBills.some((paid) => paid.name === item.name)
    );

    const expectedCount = expectedBills.length;

    const expectedTotal = expectedBills.reduce(
      (acc, cur) => acc + Math.abs(cur.amount),
      0
    );

    return {
      paid: paidTotal,
      expected: expectedTotal,
      total: paidTotal + expectedTotal,
      paidCount: paidCount,
      expectedCount: expectedCount,
      billsDueSoon: billsDueSoon,
      billsDueSoonCount: billsDueSoonCount,
    };
  }

  export {getStatusIcon, capitalizeFirstLetter, getTotalMonthlyBills}