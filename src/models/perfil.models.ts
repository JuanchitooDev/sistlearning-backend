import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db'

class Perfil extends Model {
    public id?: number
    public nombre?: string
    public nombre_url?: string
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public sistema?: boolean
    public estado?: boolean
}

Perfil.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    nombre_url: {
        type: DataTypes.STRING(60),
        allowNull: false
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
    modelName: 'Perfil',
    timestamps: true,
    freezeTableName: true
})

export default Perfil