import { IPerfil } from "./perfilInterface"
import { ITrabajador } from "./trabajadorInterface"
import { IInstructor } from "./instructorInterface"
import { IAlumno } from "./alumnoInterface"

export interface IUsuario {
    id?: number
    id_trabajador?: number | null
    id_instructor?: number | null
    id_alumno?: number | null
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
    instructor?: IInstructor
    alumno?: IAlumno
    perfil?: IPerfil
}

export interface UsuarioResponse {
    result: boolean
    message?: string
    data?: IUsuario | IUsuario[]
    token?: string
    error?: string
    status?: number
}