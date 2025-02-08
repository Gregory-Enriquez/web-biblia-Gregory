import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login'; // Asegúrate de que la ruta sea correcta
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../../lib/firebase';

// Mock de las funciones de Firebase
jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
}));

describe('Login Component', () => {
  // Prueba 1: Verificar que el componente se renderice correctamente
  it('renders the login component', () => {
    render(<Login />);

    // Verificar que el título esté presente
    expect(screen.getByText(/Biblia Reina Valera/i)).toBeInTheDocument();

    // Verificar que los botones de Google y GitHub estén presentes
    expect(screen.getByText(/Iniciar con Google/i)).toBeInTheDocument();
    expect(screen.getByText(/Iniciar con GitHub/i)).toBeInTheDocument();
  });

  // Prueba 2: Verificar que el botón de Google llame a la función de login
  it('calls handleGoogleSignIn when Google button is clicked', () => {
    render(<Login />);

    // Simular clic en el botón de Google
    const googleButton = screen.getByText(/Iniciar con Google/i);
    fireEvent.click(googleButton);

    // Verificar que la función de login se haya llamado
    expect(signInWithPopup).toHaveBeenCalledWith(auth, googleProvider);
  });

  // Prueba 3: Verificar que el botón de GitHub llame a la función de login
  it('calls handleGithubSignIn when GitHub button is clicked', () => {
    render(<Login />);

    // Simular clic en el botón de GitHub
    const githubButton = screen.getByText(/Iniciar con GitHub/i);
    fireEvent.click(githubButton);

    // Verificar que la función de login se haya llamado
    expect(signInWithPopup).toHaveBeenCalledWith(auth, githubProvider);
  });
});