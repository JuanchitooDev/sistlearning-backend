import { IPerfil } from "./perfilInterface"
import { ITrabajador } from "./trabajadorInterface"

export interface IUsuario {
    id?: number
    id_trabajador?: number
    id_perfil?: number
    username?: string
    password?: string
    token?: string
    fecha_sesion?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    trabajador?: ITrabajador
    perfil?: IPerfil
}

export interface UsuarioResponse {
    result: boolean
    message?: string
    data?: IUsuario | IUsuario[],
    token?: string,
    error?: string
}