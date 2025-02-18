'use client';
import {useEffect, useState} from "react"
import ThemeContext from "@/context/themeContext";

const ThemeProvider = ({children}: {children: React.ReactNode}) => {
    const themeFromStorage:boolean = typeof localStorage !== "undefined" && localStorage.getItem("theme") ? JSON.parse(localStorage.getItem("theme")!) : false;
    const searchStatus: boolean = typeof localStorage !== "undefined" && localStorage.getItem("search") ? JSON.parse(localStorage.getItem("search")!) : false;
    const [darkTheme, setDarkTheme] = useState<boolean>(themeFromStorage)
    const [search, setSearch] = useState<boolean>(searchStatus)
    const [renderComponent, setRenderComponent] = useState<boolean>(false)

    useEffect(()=> {
        setRenderComponent(true)
    },[])

    if(!renderComponent) return <></>;
  return (
    <ThemeContext.Provider value={{darkTheme, setDarkTheme, search, setSearch }}>
        <div className={`${darkTheme ? "dark" : ""} min-h-screen`}>
            <div className="dark:text-light dark:bg-dark ">
            {children }
            </div>
        </div>
    </ThemeContext.Provider>
  )
}

export default ThemeProvider