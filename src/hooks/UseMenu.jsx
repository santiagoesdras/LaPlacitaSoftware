import { useState, useEffect } from "react";

export function useMenu() {
  const [platos, setPlatos] = useState([]);
  const [categoria, setCategoria] = useState("todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/data/menu.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            "No pudimos cargar el menú en este momento. Por favor recarga la página o contáctanos directamente."
          );
        }
        return res.json();
      })
      .then((data) => {
        setPlatos(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  const categoriasDisponibles = [
    "todas",
    ...new Set(platos.map((plato) => plato.categoria).filter(Boolean)),
  ];

  const platosFiltrados =
    categoria === "todas"
      ? platos
      : platos.filter((plato) => plato.categoria === categoria);

  return {
    platosFiltrados,
    categoria,
    setCategoria,
    cargando,
    error,
    categoriasDisponibles,
  };
}