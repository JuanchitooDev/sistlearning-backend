import { IAlumno } from "./alumnoInterface"
import { IEvento } from "./eventoInterface"

export interface ICertificado {
    id?: number
    id_alumno?: number
    id_evento?: number
    nombre_alumno_impresion?: string
    codigo?: string
    codigoQR?: string
    ruta?: string
    fileName?: string
    templateName?: string
    fecha_registro?: string
    fecha_descarga?: string
    fecha_envio?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    alumno?: IAlumno
    evento?: IEvento
}

export interface CertificadoResponse {
    result: boolean
    message?: string
    data?: ICertificado | ICertificado[]
    error?: string
    status?: number
}