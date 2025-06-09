import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'

class TipoDocumento extends Model {
    public id?: number
    public nombre?: string
    public nombre_url?: string
    public abreviatura?: string
    public longitud?: number
    public en_persona?: boolean
    public en_empresa?: boolean
    public compra?: boolean
    public venta?: boolean
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public sistema?: boolean
    public estado?: boolean
}

TipoDocumento.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre_url: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    abreviatura: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    longitud: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    en_persona: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    en_empresa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    compra: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    venta: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    user_crea: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    user_actualiza: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    user_elimina: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    sistema: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'TipoDocumento',
    timestamps: true
})

export default TipoDocumento;