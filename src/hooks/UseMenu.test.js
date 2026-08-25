import { describe, it, expect, vi, beforeEach, afterEach, act } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMenu } from "./UseMenu";

const menuDeEjemplo = [
  { id: "1", nombre: "Desayuno chapín", categoria: "desayunos", precio: 30, descripcion: "x", foto: "", alt: "", disponible: true },
  { id: "2", nombre: "Limonada", categoria: "bebidas", precio: 15, descripcion: "x", foto: "", alt: "", disponible: true },
];

describe("useMenu", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("empieza en estado de carga", () => {
    global.fetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useMenu());
    expect(result.current.cargando).toBe(true);
    expect(result.current.platosFiltrados).toEqual([]);
  });

  it("carga los platos cuando el fetch responde bien", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => menuDeEjemplo,
    });

    const { result } = renderHook(() => useMenu());

    await waitFor(() => {
      expect(result.current.cargando).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.platosFiltrados).toHaveLength(2);
  });

  it("filtra por categoría correctamente", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => menuDeEjemplo,
    });

    const { result } = renderHook(() => useMenu());

    await waitFor(() => {
      expect(result.current.cargando).toBe(false);
    });

    act(() => {
      result.current.setCategoria("bebidas");
    });

    await waitFor(() => {
      expect(result.current.platosFiltrados).toHaveLength(1);
    });
    expect(result.current.platosFiltrados[0].nombre).toBe("Limonada");
  });

  it("guarda el mensaje de error si el fetch falla", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });

    const { result } = renderHook(() => useMenu());

    await waitFor(() => {
      expect(result.current.cargando).toBe(false);
    });

    expect(result.current.error).toBe(
      "No pudimos cargar el menú en este momento. Por favor recarga la página o contáctanos directamente."
    );
  });
});