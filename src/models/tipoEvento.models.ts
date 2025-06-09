import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'

class TipoEvento extends Model {
    public id?: number
    public nombre?: string
    public nombre_url?: string
    public descripcion?: string
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public estado?: boolean
}

TipoEvento.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    nombre_url: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(100),
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
    modelName: 'TipoEvento',
    timestamps: true,
    freezeTableName: true
})

export default TipoEvento