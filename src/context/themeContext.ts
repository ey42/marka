import { createContext, Dispatch, SetStateAction } from "react";
type ThemeContextType = {
    darkTheme: boolean;
    setDarkTheme: Dispatch<SetStateAction<boolean>>;
    search: boolean;
    setSearch: Dispatch<SetStateAction<boolean>>;
}

const ThemeContext = createContext<ThemeContextType>({
    darkTheme: false,
    setDarkTheme: () => null,
    search: false,
    setSearch: () => null
});

export default ThemeContext;