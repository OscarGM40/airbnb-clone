import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import RegisterModal from "./components/modals/RegisterModal";
import Navbar from "./components/navbar/Navbar";
import "./globals.css";
import ToasterProvider from "./providers/ToasterProvider";
import LoginModal from "./components/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/modals/RentModal";

// puedo importar,configurar y establecer una fuente de forma global facilmente en Next 13
const font = Nunito({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] }); // <-otro ejemplo

// esta instancia permite cambiar el title
export const metadata: Metadata = {
  title: "Airbnb",
  description: "Airbnb clone",
};

// IMPORTANTE: layout.tsx es por defecto un server component,asi que puedo llamar a la session,etc

// el root layout debe de llevar las etiquetas html y body,el resto no
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className={font.className}>
        {/* fijate que fácil es crear un HOC para asegurarme que un componente se monta solo en el segundo render,evitando posibles problemas de hidratación */}
        {/* <ClientOnly> */}
        <ToasterProvider />
        <RentModal />
        <RegisterModal />
        <LoginModal />
        <Navbar currentUser={currentUser} />
        {/* </ClientOnly> */}
        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  );
}
