import { IPais } from "./paisInterface"

export interface IDepartamento {
    id?: number
    id_pais?: number
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    pais?: IPais
}

export interface DepartamentoResponse {
    result: boolean
    message?: string
    data?: IDepartamento | IDepartamento[],
    error?: string
}