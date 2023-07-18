export function deducirMensajeError(o_error) {
  console.log(JSON.stringify(o_error));
  let mensaje = '';
  let hubo = false;
  if (o_error.message) {
    mensaje =
      o_error.message === 'Network Error'
        ? 'La aplicación no logra conectarse con el servidor, revise si su dispositivo esta con internet o si el servidor esta disponible.'
        : o_error.message;
    hubo = true;
  }
  if (o_error.config) {
    if (o_error.config.url) {
      mensaje =
        mensaje +
        "<br><span style='color:red'>" +
        o_error.config.url +
        '</span>';
      hubo = true;
    }
  }
  if (hubo === false) {
    mensaje = JSON.stringify(o_error);
  }
  return mensaje;
}
