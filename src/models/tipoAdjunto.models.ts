import { Model, DataTypes } from 'sequelize'
import sequelize from '@/config/db'

class TipoAdjunto extends Model {
    public id?: number
    public nombre?: string
    public nombre_url?: string
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public estado?: boolean
}

TipoAdjunto.init({
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
    modelName: 'TipoAdjunto',
    timestamps: true
})

export default TipoAdjunto