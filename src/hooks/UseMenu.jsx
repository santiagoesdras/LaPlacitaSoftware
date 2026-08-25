import { useEffect, useState } from "react";

export function useMenu() {
  const [platos, setPlatos] = useState([]);
  const [categoria, setCategoria] = useState("todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    setCargando(true);
    setError(null);

    fetch("/data/menu.json")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`Respuesta no válida: ${respuesta.status}`);
        }
        return respuesta.json();
      })
      .then((datos) => {
        if (!cancelado) {
          setPlatos(datos);
          setCargando(false);
        }
      })
      .catch((err) => {
        // Detalle técnico: solo para la consola, nunca para el usuario.
        console.error("Error al cargar el menú:", err);

        if (!cancelado) {
          // Mensaje humano: esto es lo que ve Don Chente.
          setError("No pudimos cargar el menú en este momento. Por favor recarga la página o contáctanos directamente.");
          setCargando(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const platosFiltrados =
    categoria === "todos"
      ? platos
      : platos.filter((plato) => plato.categoria === categoria);

  return { platosFiltrados, categoria, setCategoria, cargando, error };
}