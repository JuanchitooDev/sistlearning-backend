import { IEvento } from "./eventoInterface"
import { ITrabajador } from "./trabajadorInterface"

export interface IProgramacion {
    id?: number
    id_trabajador?: number
    id_evento?: number
    descripcion?: string
    enlace?: string
    fecha_inicio?: string
    fecha_final?: string
    fecha_reprograma?: string
    fecha_cancela?: string
    fecha_registro?: Date
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    trabajador?: ITrabajador
    evento?: IEvento
}

export interface ProgramacionResponse {
    result?: boolean
    message?: string
    data?: IProgramacion | IProgramacion[],
    error?: string
}