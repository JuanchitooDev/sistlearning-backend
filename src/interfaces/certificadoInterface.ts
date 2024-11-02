import { IAlumno } from "./alumnoInterface"
import { IEvento } from "./eventoInterface"

export interface ICertificado {
    id?: number
    id_alumno?: number
    id_evento?: number
    codigo?: string
    codigoQR?: string
    ruta?: string
    fileName?: string
    fecha_registro?: Date
    fecha_descarga?: Date
    fecha_envio?: Date
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    alumno?: IAlumno
    evento?: IEvento
}

export interface CertificadoResponse {
    result?: boolean
    message?: string
    data?: ICertificado | ICertificado[],
    error?: string
}