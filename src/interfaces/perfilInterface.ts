export interface IPerfil {
    id?: number
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface PerfilResponse {
    result: boolean
    message?: string
    data?: IPerfil | IPerfil[],
    error?: string
}