import { useRef, useState } from "react";

// Formulario de contacto y reserva del Comedor La Placita.
// Responde a la queja 6 de Don Chente ("un espacio para que me escriban,
// pero que no lleguen vacíos ni con correos inventados") y sostiene la parte
// de accesibilidad del formulario: label visible por campo, error asociado
// al campo con aria-describedby, aria-invalid y foco al primer campo malo.

const CAMPOS_VACIOS = {
  nombre: "",
  correo: "",
  telefono: "",
  motivo: "",
  mensaje: "",
};

// Exige texto + @ + dominio + punto + extensión de al menos 2 letras.
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
// Teléfono de Guatemala: 8 dígitos una vez que quitamos espacios y guiones.
const TELEFONO_VALIDO = /^\d{8}$/;

const LARGO_MAXIMO_MENSAJE = 500;

// Una sola función de validación por campo: la usamos al salir del campo
// (onBlur) y otra vez al enviar, para no repetir reglas en dos lugares.
function validarCampo(campo, valor) {
  const texto = valor.trim();

  switch (campo) {
    case "nombre":
      if (texto === "") return "Escribí tu nombre para saber quién nos escribe.";
      if (texto.length < 3) return "El nombre debe tener al menos 3 letras.";
      return "";

    case "correo":
      if (texto === "") return "Escribí tu correo para poder responderte.";
      if (!CORREO_VALIDO.test(texto)) {
        return "Ese correo no es válido. Revisá que tenga el formato nombre@dominio.com.";
      }
      return "";

    case "telefono":
      // Campo opcional: solo se valida si la persona escribió algo.
      if (texto === "") return "";
      if (!TELEFONO_VALIDO.test(texto.replace(/[\s-]/g, ""))) {
        return "El teléfono debe tener 8 dígitos. Ejemplo: 5555 5555.";
      }
      return "";

    case "motivo":
      if (texto === "") return "Elegí si querés reservar, consultar o dejar un comentario.";
      return "";

    case "mensaje":
      if (texto === "") return "Contanos brevemente en qué te ayudamos.";
      if (texto.length < 10) return "El mensaje debe tener al menos 10 caracteres.";
      if (texto.length > LARGO_MAXIMO_MENSAJE) {
        return `El mensaje no puede pasar de ${LARGO_MAXIMO_MENSAJE} caracteres.`;
      }
      return "";

    default:
      return "";
  }
}

export default function Contacto() {
  const [valores, setValores] = useState(CAMPOS_VACIOS);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  // Referencias para mover el foco al primer campo con error.
  const referencias = {
    nombre: useRef(null),
    correo: useRef(null),
    telefono: useRef(null),
    motivo: useRef(null),
    mensaje: useRef(null),
  };

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setValores((anteriores) => ({ ...anteriores, [name]: value }));

    // Si el campo ya tenía error, lo limpiamos apenas queda correcto:
    // corregir no debería seguir viéndose como falla.
    if (errores[name]) {
      setErrores((anteriores) => ({ ...anteriores, [name]: validarCampo(name, value) }));
    }
  }

  function manejarSalida(evento) {
    const { name, value } = evento.target;
    setErrores((anteriores) => ({ ...anteriores, [name]: validarCampo(name, value) }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    const nuevosErrores = {};
    Object.keys(CAMPOS_VACIOS).forEach((campo) => {
      const error = validarCampo(campo, valores[campo]);
      if (error) nuevosErrores[campo] = error;
    });

    setErrores(nuevosErrores);

    const camposConError = Object.keys(nuevosErrores);
    if (camposConError.length > 0) {
      setEnviado(false);
      // Orden del formulario, no orden del objeto: el foco cae en el primer
      // campo malo de arriba hacia abajo.
      const primero = Object.keys(CAMPOS_VACIOS).find((campo) => nuevosErrores[campo]);
      referencias[primero]?.current?.focus();
      return;
    }

    // Todavía no hay servidor (eso llega en la Semana 7). Confirmamos en
    // pantalla y limpiamos el formulario.
    setEnviado(true);
    setValores(CAMPOS_VACIOS);
  }

  // Arma el aria-describedby de cada campo: siempre la ayuda si existe,
  // y el error solo cuando hay error.
  function describedBy(campo, tieneAyuda) {
    const ids = [];
    if (tieneAyuda) ids.push(`${campo}-ayuda`);
    if (errores[campo]) ids.push(`${campo}-error`);
    return ids.length > 0 ? ids.join(" ") : undefined;
  }

  const restantes = LARGO_MAXIMO_MENSAJE - valores.mensaje.length;

  return (
    <section
      id="contacto"
      className="section section--muted"
      aria-labelledby="titulo-contacto"
    >
      <div className="container flow">
        <header className="section-heading">
          <p className="eyebrow">Reservas y consultas</p>
          <h2 id="titulo-contacto">Escribinos</h2>
          <p>
            Apartá tu mesa o hacenos una consulta. Te respondemos el mismo día
            en horario de atención.
          </p>
        </header>

        {/* Confirmación. role="status" lo anuncia sin interrumpir. */}
        {enviado && (
          <p className="formulario__exito" role="status">
            Listo, recibimos tu mensaje. Te contestamos al correo que dejaste.
          </p>
        )}

        {/* noValidate desactiva los globos del navegador para que se vean
            nuestros mensajes, que sí están asociados a cada campo. */}
        <form className="formulario" onSubmit={manejarEnvio} noValidate>
          <p className="formulario__nota" id="nota-obligatorios">
            Los campos marcados con <span aria-hidden="true">*</span>
            <span className="solo-lectores"> asterisco</span> son obligatorios.
          </p>

          <div className="campo">
            <label htmlFor="nombre">
              Nombre completo <span aria-hidden="true">*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              autoComplete="name"
              ref={referencias.nombre}
              value={valores.nombre}
              onChange={manejarCambio}
              onBlur={manejarSalida}
              aria-required="true"
              aria-invalid={errores.nombre ? "true" : "false"}
              aria-describedby={describedBy("nombre", false)}
            />
            {errores.nombre && (
              <p className="campo__error" id="nombre-error">
                {errores.nombre}
              </p>
            )}
          </div>

          <div className="campo">
            <label htmlFor="correo">
              Correo electrónico <span aria-hidden="true">*</span>
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              autoComplete="email"
              ref={referencias.correo}
              value={valores.correo}
              onChange={manejarCambio}
              onBlur={manejarSalida}
              aria-required="true"
              aria-invalid={errores.correo ? "true" : "false"}
              aria-describedby={describedBy("correo", true)}
            />
            <p className="campo__ayuda" id="correo-ayuda">
              Aquí te enviamos la confirmación. Ejemplo: nombre@correo.com
            </p>
            {errores.correo && (
              <p className="campo__error" id="correo-error">
                {errores.correo}
              </p>
            )}
          </div>

          <div className="campo">
            <label htmlFor="telefono">Teléfono (opcional)</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              ref={referencias.telefono}
              value={valores.telefono}
              onChange={manejarCambio}
              onBlur={manejarSalida}
              aria-invalid={errores.telefono ? "true" : "false"}
              aria-describedby={describedBy("telefono", true)}
            />
            <p className="campo__ayuda" id="telefono-ayuda">
              8 dígitos, sin código de país.
            </p>
            {errores.telefono && (
              <p className="campo__error" id="telefono-error">
                {errores.telefono}
              </p>
            )}
          </div>

          <div className="campo">
            <label htmlFor="motivo">
              Motivo <span aria-hidden="true">*</span>
            </label>
            <select
              id="motivo"
              name="motivo"
              ref={referencias.motivo}
              value={valores.motivo}
              onChange={manejarCambio}
              onBlur={manejarSalida}
              aria-required="true"
              aria-invalid={errores.motivo ? "true" : "false"}
              aria-describedby={describedBy("motivo", false)}
            >
              <option value="">Elegí una opción</option>
              <option value="reserva">Reservar mesa</option>
              <option value="consulta">Consulta sobre el menú</option>
              <option value="comentario">Comentario o sugerencia</option>
            </select>
            {errores.motivo && (
              <p className="campo__error" id="motivo-error">
                {errores.motivo}
              </p>
            )}
          </div>

          <div className="campo">
            <label htmlFor="mensaje">
              Mensaje <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows="5"
              maxLength={LARGO_MAXIMO_MENSAJE}
              ref={referencias.mensaje}
              value={valores.mensaje}
              onChange={manejarCambio}
              onBlur={manejarSalida}
              aria-required="true"
              aria-invalid={errores.mensaje ? "true" : "false"}
              aria-describedby={describedBy("mensaje", true)}
            />
            <p className="campo__ayuda" id="mensaje-ayuda">
              Si es reserva, decinos día, hora y cuántas personas. Te quedan{" "}
              {restantes} caracteres.
            </p>
            {errores.mensaje && (
              <p className="campo__error" id="mensaje-error">
                {errores.mensaje}
              </p>
            )}
          </div>

          <button className="boton boton--primario" type="submit">
            Enviar mensaje
          </button>
        </form>
      </div>
    </section>
  );
}
