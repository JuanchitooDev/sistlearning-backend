export interface IEmpresa {
    id?: number
    nombre?: string
    direccion?: string
    telefono?: string
    email?: string
    redes_sociales?: string
    logo?: string
    lema?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface EmpresaResponse {
    result: boolean
    message?: string
    data?: IEmpresa | IEmpresa[],
    error?: string
}