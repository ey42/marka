import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/Component/ThemeProvider/ThemeProvider";
import NavBar from "@/Component/NavBar";
import Footer from "@/Component/Footer";
import Provider from "./_trpc/Provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEB",
  description: "Generated by create next app",
};

 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
 { 

  return (
    <html lang="en">
      <body className={cn("dark:bg-dark min-h-screen w-screen min-w-max bg-light dark:text-slate-300 text-dark",inter.className)}>
      <ThemeProvider>
          <Provider>
            <div className="w-screen dark:bg-dark  bg-light ">
        <NavBar />
        <div className="w-screen overflow-hidden h-screen">
            {children} 
        </div>
        <Footer/>
        </div>
          </Provider>
       
 </ThemeProvider>
        </body>
    </html>
  );
}
