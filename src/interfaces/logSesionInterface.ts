import { IUsuario } from "./usuarioInterface"

export interface ILogSesion {
    id?: number
    id_usuario?: number
    token?: string
    fecha_sesion?: string
    user_agent?: string
    usuario?: IUsuario
}

export interface LogSesionResponse {
    result: boolean
    message?: string
    data?: ILogSesion | ILogSesion[]
    error?: string
    status?: number
}