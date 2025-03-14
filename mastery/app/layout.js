import "@/styles/globals.scss"; // ✅ Keep global styles import
import { AuthProvider } from "@/context/AuthContext";
import { SkillProvider } from "@/context/SkillContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // ✅ Import Footer

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="layout-container">
        <AuthProvider>
          <SkillProvider>
            <Navbar />
            <main className="content">{children}</main>
            <Footer />
          </SkillProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
