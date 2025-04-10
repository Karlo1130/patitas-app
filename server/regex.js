export const fechaRegex = /^(?:19|20)\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/;

export const especieRegex = /^\d+$/;

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const horaRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export const apellidosRegex = /^[A-Za-z][A-Za-z0-9_ ]{2,40}$/;

export const contraseñaRegex = /^[A-Za-z\d@$!%*?&]{8,30}$/;

export const codigoPostalRegex = /^\d{5}(?:[-\s]\d{4})?$/;

export const nombreRegex = /^[A-Za-z][A-Za-z0-9_]{2,19}$/;

export const descripcionRegex = /^[\w\s\d.,!?()'"-]+$/;

export const tituloRegex = /^[A-Za-z0-9\s\-.,'?!()]+$/i

export const imagenRegex = /\.(jpg|jpeg|png|gif|bmp)$/i;

export const coloniaRegex = /^[A-Za-z0-9\s\.,'-]+$/;

export const recompensaRegex = /^\d{1,8}(\.\d{1,2})?$/;

export const calleRegex = /^[A-Za-z0-9\s\.,'-]+$/;

export const edadRegex = /^(0?[1-9]|[1-9][0-9])$/;

export const numeroCasaRegex = /^\d+[A-Za-z]?$/;

export const razaRegex = /^[A-Za-z0-9\s]+$/i

export const pesoRegex = /^\d+(\.\d+)?$/;

export const cartillaRegex = /\.(pdf)$/i;

export const sexoRegex = /^(M|F)$/;

export const idRegex = /^\d+$/;
