import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../../lib/firebase";
import { FaGoogle, FaGithub } from "react-icons/fa";

const Login: React.FC = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error al iniciar sesión con Google", error);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      console.error("Error al iniciar sesión con GitHub", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-cyan-300 flex flex-col items-center justify-center p-4">
      {/* Contenedor principal */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl shadow-blue-400 max-w-md w-full text-center">
        {/* Título con emoji */}
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-4">
          📖 Biblia Reina Valera
        </h1>
        <p className="text-black text-sm sm:text-base mb-6 sm:mb-8">
          Inicia sesión para acceder a la Biblia Reina Valera.
        </p>

        {/* Botón de Google */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-blue-300 border border-gray-400 text-gray-700 font-semibold py-2 sm:py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-all mb-4"
        >
          <FaGoogle className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-sm sm:text-base">Iniciar con Google</span>
        </button>

        {/* Botón de GitHub */}
        <button
          onClick={handleGithubSignIn}
          className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <FaGithub className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-sm sm:text-base">Iniciar con GitHub</span>
        </button>
      </div>
    </div>
  );
};

export default Login;