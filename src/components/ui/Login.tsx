import { 
  getAuth, 
  GithubAuthProvider, 
  GoogleAuthProvider, 
  signInWithPopup, 
  linkWithCredential, 
  fetchSignInMethodsForEmail 
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const auth = getAuth();
const Login = () => {
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    navigate("/home");
  };

  const loginWithGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error: any) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const pendingCred = GithubAuthProvider.credentialFromError(error);
        const existingUser = await fetchSignInMethodsForEmail(auth, error.customData.email);
        
        if (existingUser.includes("password") || existingUser.includes("google.com")) {
          const googleProvider = new GoogleAuthProvider();
          const userCredential = await signInWithPopup(auth, googleProvider);
          await linkWithCredential(userCredential.user, pendingCred!);
          navigate("/home");
        }
      } else {
        console.error("Error en la autenticación con GitHub:", error);
      }
    }
  };

  return (
    <div>
      <button onClick={loginWithGoogle}>Iniciar con Google</button>
      <button onClick={loginWithGithub}>Iniciar con GitHub</button>
    </div>
  );
};

export default Login;
