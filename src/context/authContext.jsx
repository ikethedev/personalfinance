import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from '../backend/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [startData, setStartData] = useState(null);

    const fetchUserBalance = async (userId) => {
        try {
            // Query the balances table for the specific user
            const { data, error } = await supabase
                .from('balances')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) {
                console.error("Error fetching balance data:", error);
                throw error;
            }

            // Format the balance data
            return {
                current: data.current,
                income: data.income,
                expenses: data.expenses // Updated to match the new column name 'expenses' (plural)
            };
        } catch (error) {
            console.error("Failed to fetch balance:", error);
            // Return default balance structure in case of error
            return {
                current: 0,
                income: 0,
                expenses: 0
            };
        }
    };

    // Function to create initial balance record for new users
    const createUserBalance = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('balances')
                .insert([
                    {
                        user_id: userId,
                        current: 0.00,
                        income: 0.00,
                        expenses: 0.00
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error("Error creating balance record:", error);
                throw error;
            }

            return {
                current: data.current,
                income: data.income,
                expenses: data.expenses
            };
        } catch (error) {
            console.error("Failed to create balance record:", error);
            return {
                current: 0,
                income: 0,
                expenses: 0
            };
        }
    };

    // Function to fetch all user data including balances
    const fetchUserData = async (userId) => {
        try {
            // Get balance data
            let balanceData = await fetchUserBalance(userId);
            
            // If no balance record exists, create one
            if (!balanceData || (balanceData.current === 0 && balanceData.income === 0 && balanceData.expenses === 0)) {
                try {
                    // Try to fetch again to see if record exists but is all zeros
                    const { data: existingBalance } = await supabase
                        .from('balances')
                        .select('*')
                        .eq('user_id', userId)
                        .single();
                    
                    if (!existingBalance) {
                        // No record exists, create one
                        balanceData = await createUserBalance(userId);
                    }
                } catch (err) {
                    // Record doesn't exist, create it
                    balanceData = await createUserBalance(userId);
                }
            }
            
            console.log("Balance data:", balanceData);
            
            // You can add more data fetching here (transactions, budgets, pots, etc.)
            // const transactionsData = await fetchUserTransactions(userId);
            // const budgetsData = await fetchUserBudgets(userId);
            // const potsData = await fetchUserPots(userId);
            
            // Combine all the data
            const combinedData = {
                balance: balanceData,
                // transactions: transactionsData,
                // budgets: budgetsData,
                // pots: potsData
            };
            
            setStartData(combinedData);
            return combinedData;
        } catch (error) {
            console.error("Error in fetchUserData:", error);
            const fallbackData = await fetchFallbackData();
            setStartData(fallbackData);
            return fallbackData;
        }
    };

    const fetchFallbackData = async () => {
        try {
            const response = await fetch('../data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            return json;
        } catch (e) {
            console.error("Error fetching fallback data:", e);
            // Return minimal structure if even fallback fails
            return {
                balance: { current: 0, income: 0, expenses: 0 },
                transactions: [],
                budgets: [],
                pots: []
            };
        }
    };

    const showProfile = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Login error:", error.message);
                return null;
            }

            const user = data.user;
            setUser(user);
            setIsAuth(true);
            
            // Fetch and return user data
            const userData = await fetchUserData(user.id);
            return userData;
        } catch(err) {
            console.error("Login process error:", err);
            return null;
        }
    };
    
    async function registerUser(email, password, name){
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if(error){
            console.log("Auth error", error.message);
            return;
        }

        const user = data.user;

        // Insert user profile
        const { error: insertError } = await supabase.from('users').insert([
            { id: user.id, name }
        ]);

        if (insertError) {
            console.error("Insert error:", insertError.message);
        } else {
            console.log("User registered and profile saved");
            // Create initial balance record for new user
            await createUserBalance(user.id);
        }
    }

    // Load fallback data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('../data.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setStartData(json);            
            } catch (e) {
                console.error("Error loading initial data:", e);
            }
        };

        // Only fetch fallback data if user is not authenticated
        if (!isAuth) {
            fetchData();
        }
    }, [isAuth]);

    const value = {
        registerUser,
        user,
        setUser, 
        isAuth,
        showProfile, 
        startData, 
        setStartData,
        fetchUserData, // Expose this function so components can refresh data
    };

    return (
        <AuthContext.Provider value={value}>  
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used with an AuthProvider");
    }
    return context;
};

export { AuthContext };