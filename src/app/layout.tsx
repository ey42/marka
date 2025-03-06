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
      <body className={cn("dark:bg-dark w-full min-w-[456px] min-h-screen bg-light relative text-dark",inter.className)}>
        <Toaster richColors closeButton position="top-center"/>
      <ThemeProvider>
          <Provider>
            <div className="w-full main min-w-full min-h-screen absolute overflow-auto dark:bg-dark bg-light">
        <NavBar />
        <div className="w-full min-h-screen pb-20">
            {children} 
        </div>
        <div className="bottom-0 min-h-full w-full">
        <Footer/>
        </div>
        </div>
          </Provider>
       
 </ThemeProvider>
        </body>
    </html>
  );
}
