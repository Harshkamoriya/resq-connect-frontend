import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import Footer from "./footer/page";
import Navbar from "components/Navbar";
import { AppcontextProvider } from "./context/Appcontext";
import SessionWrapper from "components/Providers/SessionWrapper";
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
  title: "ResQ-connect",
  description: "Roadside Assistance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className={`${outfit.className}`}>
        <SessionWrapper>
        <Navbar />
          <AppcontextProvider> {children}</AppcontextProvider>
        </SessionWrapper>
        <Footer />
      </body>
    </html>
  );
}
