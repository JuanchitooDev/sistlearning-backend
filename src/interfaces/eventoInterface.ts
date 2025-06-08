import { ITipoEvento } from "./tipoEventoInterface"
import { ICategoriaEvento } from "./categoriaEventoInterface"
import { IInstructor } from './instructorInterface'

export enum EModalidad {
    VIRTUAL = "Virtual",
    PRESENCIAL = "Presencial",
    MIXTO = "Mixto"
}

export interface IEvento {
    id?: number
    id_parent?: number
    id_tipoevento?: number
    id_categoriaevento?: number
    id_instructor?: number
    titulo?: string
    titulo_url?: string
    descripcion?: string
    temario?: string
    plantilla_certificado?: string
    fecha?: Date
    fecha_fin?: string
    modalidad?: EModalidad
    precio?: number
    duracion?: string
    capacidad_maxima?: number
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    tipoEvento?: ITipoEvento
    categoriaEvento?: ICategoriaEvento
    instructor?: IInstructor
}

export interface EventoResponse {
    result: boolean
    message?: string
    data?: IEvento | IEvento[]
    error?: string
    status?: number
}