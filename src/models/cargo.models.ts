import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'

class Cargo extends Model {
    public id?: number
    public nombre?: string
    public nombre_url?: string
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public sistema?: boolean
    public estado?: boolean
}

Cargo.init({
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
        type: DataTypes.STRING(70),
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
    modelName: 'Cargo',
    timestamps: true,
    freezeTableName: true
})

export default Cargo