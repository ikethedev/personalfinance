import React, { useState, createContext, useContext, useMemo } from 'react'
import { useAuth } from "./authContext"
import { supabase } from '../backend/supabaseClient';


export const PotContext = createContext(null);

export const PotProvider = ({ children }) => {
  const [pots, setPots] = useState([]);
  const { startData, setStartData, user  } = useAuth();
  
    const fetchPots = async (userId) => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('pots')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

          if(error){
            console.error("Error fetching pots:", error)
            const fallbackData = await fetchFallbackPots()
            setPots(fallbackData)
            return fallbackData
          }

          setPots(data || []);
          return data

      } catch (err) {
        console.error("Exception fetching pots:", error);
        setError("Failed to fetch pots");
        
        // Try to use fallback data
        const fallbackData = await fetchFallbackPots();
        setPots(fallbackData);
        return fallbackData;
      }
    }

    const fetchFallbackPots = async () => {
      try {
        // Try to get data from your data.json file
        const response = await fetch('../data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        
        // If the json has a pots property, use that, otherwise return empty array
        return json.pots || [];
      } catch (e) {
        console.error("Error fetching fallback pots:", e);
        // Return empty array if even fallback fails
        return [];
      }
    }

    const addPot = async (newPot) => {
      // Check if user exists
      if (!user) {
        return null;
      }
    
      // Check if newPot is undefined or null
      if (!newPot) {
        return null;
      }
      
      try {
        // Create a new pot object with the data from the form
        const potData = {
          user_id: user.id,
          name: newPot.name || (newPot.category ? newPot.category : "Unnamed Pot"),
          target: newPot.target ? Number(newPot.target) : 0,
          theme: newPot.theme || 'Default'
        };

        const { data, error } = await supabase
        .from('pots')
        .insert([potData])
        .select('*');

      // Check if there was an error with the Supabase operation
      if (error) {
        return null;
      }
      
      // Only log success if there was no error
        
        // Update the local state with the new pot
        if (data && data.length > 0) {
          setPots(currentPots => [data[0], ...currentPots]);
          return data[0];
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    };
    
    const editPot = async (potId, updatedPot) => {
      if (!user) {
        return null;
      }
    
      if (!updatedPot) {
        return null;
      }
    
      try {
        const { data, error } = await supabase
          .from('pots')
          .update(updatedPot)
          .eq('id', potId);
    
        if (error) {
          console.error("Error updating pot:", error);
          return null;
        }

        const updated = updatedPot;
        console.log(updated)

        setPots(prevPots =>
          prevPots.map(pot =>
            pot.id === potId ? { ...pot, ...updated } : pot
          )
        );
    
        return data; 
      } catch (err) {
        console.error("Unexpected error:", err);
        return null;
      }
    };

    const deletePot = async (potId) => {
      try {
        if (typeof potId !== 'string') {
          console.error("Invalid potId: expected a UUID string, got:", potId);
          return false;
        }
    
        console.log("Deleting pot with ID:", potId);
        console.log(user)

        const { data, error } = await supabase
          .from('pots')
          .delete()
          .eq('id', potId);
    
        if (error) {
          console.error("Error deleting pot:", error.message);
          return false;
        }
    
        setPots(prevPots => prevPots.filter(pot => pot.id !== potId));

        return true;
      } catch (error) {
        console.error("Unexpected error:", error.message);
        return false;
      }
    };

    const totalSaved = async () => {

    }
    
    const value = {
        pots, 
        addPot,
        editPot, 
        fetchPots,
        deletePot
    }

    return <PotContext.Provider value={value}>{children}</PotContext.Provider>
}


export const usePot = () => {
    const context = useContext(PotContext);
    if(!context){
        throw new Error("usePot must be used within a PotProvider");
    }

    return context
}