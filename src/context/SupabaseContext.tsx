import React, { createContext, useContext, ReactNode } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import supabase from "../database/supabase";

const SupabaseContext = createContext<SupabaseClient | null>(null);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
    return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>;
};

export const useSupabase = (): SupabaseClient => {
    const client = useContext(SupabaseContext);
    if (!client) {
        throw new Error("useSupabase must be used within a SupabaseProvider");
    }
    return client;
};

export default SupabaseContext;