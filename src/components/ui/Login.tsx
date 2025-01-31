import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, providerGoogle, providerGithub } from "../../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate(); // Hook para la navegación

  // 🔹 Función para iniciar sesión con Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, providerGoogle);
      console.log("Inicio de sesión con Google:", result.user);
      navigate("/home"); // Redirige después del inicio de sesión
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  // 🔹 Función para iniciar sesión con GitHub
  const loginWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, providerGithub);
      console.log("Inicio de sesión con GitHub:", result.user);
      navigate("/home"); // Redirige después del inicio de sesión
    } catch (error) {
      console.error("Error al iniciar sesión con GitHub:", error);
    }
  };

  // 🔹 Detecta cambios en la sesión y redirige si el usuario ya está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Usuario autenticado:", user);
        navigate("/home"); // Redirige automáticamente si ya está autenticado
      } else {
        console.log("No hay usuario autenticado.");
      }
    });

    return () => unsubscribe(); // Limpia el evento al desmontar el componente
  }, [navigate]);

  // 🔹 Función para cerrar sesión (opcional, útil para pruebas)
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("Sesión cerrada");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h2 className="text-white text-2xl mb-4">Iniciar Sesión</h2>
      <button
        onClick={loginWithGoogle}
        className="bg-red-500 text-white p-2 m-2 rounded"
      >
        Iniciar con Google
      </button>
      <button
        onClick={loginWithGithub}
        className="bg-gray-800 text-white p-2 m-2 rounded"
      >
        Iniciar con GitHub
      </button>
      <button onClick={logout} className="bg-gray-600 text-white p-2 m-2 rounded">
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Login;
