import { Dialog, Notify } from 'quasar';

export function useMensajes() {
  const mostrarMensaje = (titulo: string, mensaje: string) =>
    Dialog.create({
      title: titulo,
      message: mensaje,
      html: true,
    });

  const mostrarConfirmacion = (
    mensaje: string,
    posicion:
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right'
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'center'
      | undefined
  ) => {
    if (mensaje.trim().length === 0) {
      return;
    }
    Notify.create({
      message: mensaje,
      color: 'grey-8',
      multiLine: true,
      position: posicion === undefined ? 'center' : posicion,
      icon: 'info',
      html: true,
      actions: [{ label: 'Cerrar', color: 'white', handler: () => undefined }],
    });
  };

  const mostrarError = (
    mensaje: string,
    posicion:
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right'
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'center'
      | undefined
  ) => {
    if (mensaje.trim().length === 0) {
      return;
    }
    Notify.create({
      message: mensaje,
      color: 'red-4',
      textColor: 'white',
      multiLine: true,
      position: posicion === undefined ? 'center' : posicion,
      icon: 'error',
      html: true,
      actions: [{ label: 'Cerrar', color: 'white', handler: () => undefined }],
    });
  };

  return {
    mostrarMensaje,
    mostrarConfirmacion,
    mostrarError,
  };
}
