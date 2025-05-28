import {useContext, useState, useEffect} from "react"
import closeIcon from "../assets/images/icon-close-modal.svg";
import downArrow from "../assets/images/icon-caret-down.svg";
import { updateCount, handleKeyDown } from "../utils/General"
import pageStyles from "../styles/commonmodal.module.css";
import useModalManagement from "./useModalManagement"
import { useTransaction } from "../context/transactionContext"
import { useBudget } from "../context/budgetContext"

import { supabase } from '../backend/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default function TransactionModal({ mode, title, closeModal }) {
    const { addTransaction, fetchCategories } = useTransaction() 
    const { fetchBudgets } = useBudget() 
    const [showCategories, setShowCategories] = useState(false)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedCategoryId, setSelectedCategoryId] = useState("")
    const hideName = false
    const [name, setName] = useState("") 
    const [type, setType] = useState(null)
    const [count, setCount] = useState(30);
    const [showType, setShowType] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [amount, setAmount] = useState("") 
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [isRecurring, setIsRecurring] = useState(false)
    const [frequency, setFrequency] = useState("")
    const [showFrequency, setShowFrequency] = useState(false)
    const [recurringDay, setRecurringDay] = useState("")

    useEffect(() => {
      const loadCategories = async () => {
        const data = await fetchCategories()
        setCategories(data)
      }
  
      loadCategories()
    }, [])

    const handleAmountChange = (e) => {
        // Remove any non-numeric characters except decimal point
        const value = e.target.value.replace(/[^0-9.]/g, '');
        setAmount(value);
    }

    const handleClick = () => {
        closeModal()
    }

    const handleSenderChange = (e) => {
      updateCount(e, setCount, setDisabled);
      setName(e.target.value);
    }

    const handleTypeChange = (e) =>{
      setType(e.target.textContent) 
      setShowType(false) // Close dropdown after selection
    }

    const showTypeMenu = () => {
      setShowType(!showType)
    }

    const showCategoriesMenu = () => {
      setShowCategories(!showCategories)
    }

    const showFrequencyMenu = () => {
        setShowFrequency(!showFrequency)
    }

    const handleFrequencyChange = (e) => {
        setFrequency(e.target.textContent);
        setShowFrequency(false);
    }

    const handleRecurringToggle = (e) => {
        setIsRecurring(e.target.checked);
        if (!e.target.checked) {
            // Reset frequency when not recurring
            setFrequency("");
            setRecurringDay("");
        }
    }

    const handleRecurringDayChange = (e) => {
        setRecurringDay(e.target.value);
    }

    // Calculate next occurrence date based on frequency
    const calculateNextDate = () => {
        if (!isRecurring || !frequency) return null;
        
        const now = new Date();
        const nextDate = new Date(now);
        
        switch (frequency) {
            case 'Weekly':
                nextDate.setDate(now.getDate() + 7);
                break;
            case 'Biweekly':
                nextDate.setDate(now.getDate() + 14);
                break;
            case 'Monthly':
                nextDate.setMonth(now.getMonth() + 1);
                if (recurringDay) {
                    nextDate.setDate(parseInt(recurringDay));
                }
                break;
            case 'Annually':
                nextDate.setFullYear(now.getFullYear() + 1);
                break;
            default:
                return null;
        }
        
        return nextDate.toISOString();
    }

    const handleCategoryChange = (e) => {
        const categoryName = e.target.textContent;
        const category = categories.find(cat => cat.name === categoryName);
        
        setSelectedCategory(categoryName);
        setSelectedCategoryId(category?.id || "");
        setShowCategories(false); // Close dropdown after selection
    }

    const validateForm = () => {
        if (!name.trim()) {
            setError("Name is required");
            return false;
        }
        if (!type) {
            setError("Transaction type is required");
            return false;
        }
        if (!amount || parseFloat(amount) <= 0) {
            setError("Valid amount is required");
            return false;
        }
        if (!selectedCategoryId) {
            setError("Category is required");
            return false;
        }
        if (isRecurring && !frequency) {
            setError("Frequency is required for recurring transactions");
            return false;
        }
        if (isRecurring && frequency === 'Monthly' && (!recurringDay || recurringDay < 1 || recurringDay > 31)) {
            setError("Valid recurring day (1-31) is required for monthly transactions");
            return false;
        }
        return true;
    }

    const handleBtnClick = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
                throw new Error("User not authenticated");
            }

            const finalAmount = type === 'Withdrawal' 
            ? -Math.abs(parseFloat(amount)) 
            : Math.abs(parseFloat(amount));

            const newTransaction = {
                id: uuidv4(),
                user_id: user.id,
                name: name.trim(),
                category_id: selectedCategoryId,
                category: selectedCategory,
                date: new Date().toISOString(),
                amount: finalAmount,
                recurring: isRecurring,
                frequency: isRecurring ? frequency : null,
                recurring_day: isRecurring && frequency === 'Monthly' ? parseInt(recurringDay) : null,
                next_date: isRecurring ? calculateNextDate() : null,
                // avatar is optional and will be NULL
            };
            
            console.log(newTransaction)

            const { data, error } = await supabase
                .from('transactions')
                .insert([newTransaction])
                .select(); // This will return the inserted record

            if (error) {
                throw error;
            }``

            // Add to local context (if your context expects it)
            if (addTransaction) {
                addTransaction(e, data[0]); 
            }

            if (type === 'Withdrawal') {
                await fetchBudgets(user.id);
            }

            closeModal();

        } catch (error) {
            console.error("Error inserting transaction:", error);
            setError(error.message || "Failed to add transaction");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={pageStyles.modal_container}>
            <div className={pageStyles.overlay}></div>
            <div className={pageStyles.modal}>
                <header className={pageStyles.header}>
                    <h1 className={pageStyles.title}>Add Transaction</h1>
                    <img
                        onClick={handleClick}
                        className={pageStyles.closeIcon}
                        src={closeIcon}
                        alt="Close Modal"
                    />
                </header>
                <div>
                    <p className={pageStyles.paragraph}>
                        Add a new Transaction
                    </p>
                </div>
                
                {error && (
                    <div style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
                        {error}
                    </div>
                )}

                <form className={pageStyles.form}>
                    {!hideName && (
                        <div className={pageStyles.input}>
                            <label htmlFor="name" className={pageStyles.input_title}>
                                Transaction Name
                            </label>
                            <input
                                value={name}
                                className={pageStyles.input_feild}
                                onChange={handleSenderChange}
                                onKeyDown={(e) => handleKeyDown(e, disabled, setDisabled)}
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Enter transaction name"
                            />
                            <p className={pageStyles.character_count}>
                                {count} of 30 characters left
                            </p>
                        </div>
                    )}

                    <div className={`${pageStyles.input} ${pageStyles.target_container}`}>
                        <label htmlFor="transactionType" className={pageStyles.input_title}>
                            Transaction Type
                        </label>
                        <div className={`${pageStyles.input_feild} ${pageStyles.type}`}>
                            <p>{type || "Select type"}</p>
                            <img onClick={showTypeMenu} src={downArrow} alt="down arrow" />
                            {showType && (
                                <ul className={pageStyles.type_container}>
                                    <li onClick={handleTypeChange}>Deposit</li>
                                    <li onClick={handleTypeChange}>Withdrawal</li>
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className={`${pageStyles.input} ${pageStyles.target_container}`}>
                        <label htmlFor="amount" className={pageStyles.input_title}>
                            Transaction Amount
                        </label>
                        <div className={pageStyles.input_feild}>
                            <span className={pageStyles.input_span}>
                                $ 
                                <input
                                    value={amount}
                                    onChange={handleAmountChange}
                                    className={pageStyles.input}
                                    type="text"
                                    name="amount"
                                    id="amount"
                                    placeholder="0.00"
                                />
                            </span>
                        </div>
                        {type && amount && (
                            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                Will be saved as: ${type === 'Withdrawal' ? '-' : '+'}{amount}
                            </p>
                        )}
                    </div>

                    <div className={`${pageStyles.input} ${pageStyles.target_container}`}>
                        <label htmlFor="category" className={pageStyles.input_title}>
                            Category
                        </label>
                        <div className={`${pageStyles.input_feild} ${pageStyles.theme_container}`}>
                            <p>{selectedCategory || "Select category"}</p>
                            <img onClick={showCategoriesMenu} src={downArrow} alt="down arrow" />
                            {showCategories && (
                                <ul className={pageStyles.colors}>
                                    {categories.map((item) => (
                                        <li 
                                            key={item.id}
                                            className={pageStyles.options_list_item} 
                                            onClick={handleCategoryChange}
                                        >
                                            {item.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Recurring Transaction Section */}
                    <div className={pageStyles.input}>
                        <label className={pageStyles.input_title}>
                            <input
                                type="checkbox"
                                checked={isRecurring}
                                onChange={handleRecurringToggle}
                                style={{ marginRight: '8px' }}
                            />
                            This is a recurring bill
                        </label>
                    </div>

                    {isRecurring && (
                        <>
                            <div className={`${pageStyles.input} ${pageStyles.target_container}`}>
                                <label htmlFor="frequency" className={pageStyles.input_title}>
                                    Frequency
                                </label>
                                <div className={`${pageStyles.input_feild} ${pageStyles.theme_container}`}>
                                    <p>{frequency || "Select frequency"}</p>
                                    <img onClick={showFrequencyMenu} src={downArrow} alt="down arrow" />
                                    {showFrequency && (
                                        <ul className={pageStyles.colors}>
                                            <li className={pageStyles.options_list_item} onClick={handleFrequencyChange}>
                                                Weekly
                                            </li>
                                            <li className={pageStyles.options_list_item} onClick={handleFrequencyChange}>
                                                Biweekly
                                            </li>
                                            <li className={pageStyles.options_list_item} onClick={handleFrequencyChange}>
                                                Monthly
                                            </li>
                                            <li className={pageStyles.options_list_item} onClick={handleFrequencyChange}>
                                                Annually
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {frequency === 'Monthly' && (
                                <div className={pageStyles.input}>
                                    <label htmlFor="recurringDay" className={pageStyles.input_title}>
                                        Day of Month (1-31)
                                    </label>
                                    <input
                                        type="number"
                                        id="recurringDay"
                                        value={recurringDay}
                                        onChange={handleRecurringDayChange}
                                        className={pageStyles.input_feild}
                                        min="1"
                                        max="31"
                                        placeholder="e.g., 15 for 15th of each month"
                                    />
                                </div>
                            )}

                            {frequency && (
                                <div className={pageStyles.input}>
                                    <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                                        Next occurrence: {calculateNextDate() ? new Date(calculateNextDate()).toLocaleDateString() : 'Not set'}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                    
                    <button 
                        onClick={handleBtnClick} 
                        className={pageStyles.save_btn}
                        disabled={isLoading}
                    >
                        {isLoading ? "Adding..." : "Add Transaction"}
                    </button>
                </form>
            </div>
        </div>
    );
}