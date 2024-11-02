import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'

class Empresa extends Model {
    public id?: number
    public nombre?: string
    public direccion?: string
    public telefono?: string
    public email?: string
    public redes_sociales?: string
    public logo?: string
    public lema?: string
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public estado?: boolean
}

Empresa.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING(13),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    redes_sociales: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    logo: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    lema: {
        type: DataTypes.STRING(40),
        allowNull: true
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
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Empresa',
    timestamps: true,
    freezeTableName: true
})

export default Empresa