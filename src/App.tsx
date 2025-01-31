import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, User, signOut } from "firebase/auth"; // Importado signOut aquí
import { auth } from "./lib/firebase";
import "./index.css";
import ReinaValeraBooks from "./components/ui/ReinaValeraBooks";
import Login from "./components/ui/Login";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <Router>
      <Routes>
        {/* Si el usuario está autenticado, lo redirige a /home; si no, muestra Login */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />

        {/* Si el usuario está autenticado, muestra ReinaValeraBooks; si no, lo redirige a Login */}
        <Route
          path="/home"
          element={
            user ? (
              <div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white p-2 rounded mb-4"
                >
                  Cerrar Sesión
                </button>
                <ReinaValeraBooks />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
