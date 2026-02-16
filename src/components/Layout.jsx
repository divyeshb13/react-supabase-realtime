import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="bg-white min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
