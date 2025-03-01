import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/Component/ThemeProvider/ThemeProvider";
import NavBar from "@/Component/NavBar";
import Footer from "@/Component/Footer";
import Provider from "./_trpc/Provider";
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "marka",
  description: "e-commerce website for traders",
};

 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
 { 

  return (
    <html lang="en">
      <body className={cn("dark:bg-dark min-h-screen sm:w-screen box-border absolute bg-light text-dark",inter.className)}>
        <Toaster richColors />
      <ThemeProvider>
          <Provider>
            <div className="w-full h-full dark:bg-dark bg-light ">
        <NavBar />
        <div className="h-screen overflow-auto">
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
