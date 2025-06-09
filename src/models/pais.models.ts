import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'

class Pais extends Model {
    public id?: number
    public nombre?: string
    public nombre_url?: string
    public codigo_postal?: string
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public estado?: boolean
}

Pais.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    nombre_url: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    codigo_postal: {
        type: DataTypes.STRING(10),
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
    modelName: 'Pais',
    timestamps: true,
    freezeTableName: true
})

export default Pais