import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import Usuario from './usuario.models'

class LogSesion extends Model {
    public id?: number
    public id_usuario?: number
    public token?: string
    public fecha_sesion?: Date
    public user_agent?: string
}

LogSesion.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: "id"
        }
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fecha_sesion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    user_agent: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'LogSesion',
    timestamps: true,
    freezeTableName: true
})

LogSesion.belongsTo(Usuario, { foreignKey: 'id_usuario' })

export default LogSesion