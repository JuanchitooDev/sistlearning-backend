import { ICargo } from "./cargoInterface"
import { IPerfil } from "./perfilInterface"
import { ITipoDocumento } from "./tipoDocumentoInterface"

export interface ITrabajador {
    id?: number
    id_perfil?: number
    id_cargo?: number
    id_tipodocumento?: number
    numero_documento?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombres?: string
    telefono?: string
    direccion?: string
    email?: string
    linkedin?: string
    fecha_nacimiento?: Date
    biografia?: string
    sexo?: string
    firma?: string
    foto_perfil?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    perfil?: IPerfil
    cargo?: ICargo
    tipoDocumento?: ITipoDocumento
}

export interface TrabajadorResponse {
    result: boolean
    message?: string
    data?: ITrabajador | ITrabajador[],
    error?: string
}