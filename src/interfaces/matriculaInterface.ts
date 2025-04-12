import { IAlumno } from "./alumnoInterface"
import { IEvento } from "./eventoInterface"

export enum Moneda {
    PEN = "Pen",
    USD = "Usd"
}

export enum FormaPago {
    CONTADO = "Contado",
    CREDITO = "Crédito"
}

export enum TipoPago {
    EFECTIVO = "Efectivo",
    TARJETA = "Tarjeta",
    DEPOSITO = "Depósito",
    MIXto = "Mixto"
}

export enum ModalidadPago {
    PARCIAL = "Parcial",
    TOTAL = "Total"
}

export enum EstadoPago {
    PENDIENTE = "Pendiente",
    PAGADA = "Pagada",
    CONFIRMADA = "Confirmada",
    ANULADA = "Anulada"
}

export interface IMatricula {
    id?: number
    id_alumno?: number
    id_evento?: number
    subtotal?: number
    igv?: number
    total?: number
    moneda?: Moneda
    fecha_pago?: string
    forma_pago?: FormaPago
    tipo_pago?: TipoPago
    estado_pago?: EstadoPago
    modalidad_pago?: ModalidadPago
    nro_voucher?: string
    nro_deposito?: string
    imagen_pago?: string
    acuenta?: number
    saldo?: number
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    alumno?: IAlumno
    evento?: IEvento
}

export interface MatriculaResponse {
    result: boolean
    message?: string
    data?: IMatricula | IMatricula[],
    error?: string
}