import { IAlumno } from "./alumnoInterface"
import { IEvento } from "./eventoInterface"

export interface IMatricula {
    id?: number
    id_alumno?: number
    id_evento?: number
    subtotal?: number
    igv?: number
    total?: number
    moneda?: string
    fecha_pago?: string
    forma_pago?: string
    tipo_pago?: string
    nro_voucher?: string
    nro_deposito?: string
    imagen_pago?: string
    acuenta?: number
    saldo?: number
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado_pago?: string
    estado?: boolean
    alumno?: IAlumno
    evento?: IEvento
}

export interface MatriculaResponse {
    result?: boolean
    message?: string
    data?: IMatricula | IMatricula[],
    error?: string
}