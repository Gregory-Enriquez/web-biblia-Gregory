import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button"; // Ruta corregida
import { vi } from "vitest";

describe("Button Component", () => {
  // Prueba 1: Renderiza correctamente con las clases base
  test("renders with default classes", () => {
    render(<Button>Click Me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("px-4 py-2 bg-blue-500 text-white rounded");
  });

  // Prueba 2: Acepta y aplica clases personalizadas
  test("applies custom className", () => {
    render(<Button className="custom-class">Click Me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("custom-class");
  });

  // Prueba 3: Maneja correctamente el evento onClick
  test("handles onClick event", () => {
    const handleClick = vi.fn(); // Mock de la función onClick
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1); // Verifica que se llamó la función
  });

  // Prueba 4: Acepta y aplica propiedades adicionales (como `disabled`)
  test("applies additional props", () => {
    render(<Button disabled>Click Me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeDisabled(); // Verifica que el botón está deshabilitado
  });

  // Prueba 5: Renderiza correctamente con children personalizados
  test("renders custom children", () => {
    render(<Button><span>Custom Text</span></Button>);

    const button = screen.getByRole("button");
    expect(button).toContainHTML("<span>Custom Text</span>"); // Verifica el contenido del botón
  });
});