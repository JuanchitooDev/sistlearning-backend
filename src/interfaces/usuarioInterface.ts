import { ITrabajador } from "./trabajadorInterface"

export interface IUsuario {
    id?: number
    id_trabajador?: number
    username?: string
    password?: string
    token?: string
    fecha_sesion?: Date
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    trabajador?: ITrabajador
}

export interface UsuarioResponse {
    result: boolean
    message?: string
    data?: IUsuario | IUsuario[],
    error?: string
}