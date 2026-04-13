import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <Navbar />
          <div className="min-h-screen pt-20 flex flex-col">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}