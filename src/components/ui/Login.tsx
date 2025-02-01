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
    <div className="flex items-center justify-center h-screen w-screen bg-gray-800">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-[450px] text-center">
        <h2 className="text-3xl font-bold text-gray-700 mb-6">Iniciar Sesión</h2>
        
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg mb-4 transition-all text-lg"
        >
          <FaGoogle className="mr-3 text-xl" /> Iniciar con Google
        </button>

        <button
          onClick={handleGithubSignIn}
          className="flex items-center justify-center w-full bg-gray-900 hover:bg-gray-950 text-white font-medium py-3 px-4 rounded-lg transition-all text-lg"
        >
          <FaGithub className="mr-3 text-xl" /> Iniciar con GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;