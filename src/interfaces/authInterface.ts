export interface IAuth {
    username?: string
    password?: string
    userAgent?: string
    idAlumno?: number
    idInstructor?: number
    idTrabajador?: number
    idPerfil?: number
    usuario?: string
    slugPerfil?: string
    nombrePerfil?: string
}

export interface AuthResponse {
    result: boolean
    message?: string
    data?: IAuth | IAuth[]
    token?: string
    error?: string
    status?: number
}