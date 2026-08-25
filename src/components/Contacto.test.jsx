import { render, screen, fireEvent } from '@testing-library/react'
import Contacto from './Contacto.jsx'

// Prueba de la queja 6: "que no lleguen vacíos ni con correos inventados".
// Usa fireEvent porque el proyecto no tiene instalado @testing-library/user-event.

describe('Formulario de contacto', () => {
  it('no deja enviar vacío y manda el foco al primer campo con error', () => {
    render(<Contacto />)

    fireEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    const nombre = screen.getByLabelText(/nombre completo/i)
    expect(nombre).toHaveAttribute('aria-invalid', 'true')
    expect(nombre).toHaveFocus()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('rechaza un correo inventado y acepta uno válido', () => {
    render(<Contacto />)

    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Wendy Morales' },
    })
    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: 'wendy@correo' },
    })
    fireEvent.change(screen.getByLabelText(/motivo/i), {
      target: { value: 'reserva' },
    })
    fireEvent.change(screen.getByLabelText(/mensaje/i), {
      target: { value: 'Quiero reservar mesa para 4 personas el sabado.' },
    })

    fireEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }))
    expect(screen.getByText(/ese correo no es válido/i)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: 'wendy@correo.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    expect(screen.getByRole('status')).toHaveTextContent(/recibimos tu mensaje/i)
  })

  it('asocia el mensaje de error al campo con aria-describedby', () => {
    render(<Contacto />)

    fireEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    const correo = screen.getByLabelText(/correo/i)
    expect(correo.getAttribute('aria-describedby')).toContain('correo-error')
  })
})
