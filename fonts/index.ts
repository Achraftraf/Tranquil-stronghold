import { Open_Sans } from "next/font/google";
import { Inter_Tight } from "next/font/google";

export const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: 'swap',
  variable: "--font-open-sans",
});


export const inter = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: 'swap',
  variable: "--font-enter",
});
