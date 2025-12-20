import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { inter } from "@/fonts";

export const metadata: Metadata = {
  title: "Steadfast haven",
  description: "Empowering youth through art, film, and music.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`relative flex flex-col bg-white min-h-screen text-black ${inter.className} tracking-wide`}
        suppressHydrationWarning
      >
        <Header />
        <div className="absolute top-0 right-0 left-0 z-30 w-full h-20 opacity-65 blur-3xl pointer-events-none bg-gradient-to-r
         from-[#ffa700] 
         via-[#ffa700%] 
         via-[#30d158_30%] 
         via-[#ffd60a_50%] 
         via-[#ff9f0a_65%] 
         via-[#ff375f_80%] 
         to-[#bf5af2]">
        </div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
