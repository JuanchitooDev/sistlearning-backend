import sequelize from '../config/db'
import { Model, DataTypes } from 'sequelize'

class Temporal extends Model {
    public id?: number
    public id_evento?: number
    public id_usuario?: number
    public id_perfil?: number
    public id_tipodocumento?: number
    public numero_documento?: string
    public nombre_impresion?: string
    public fecha_envio?: string
    public tabla?: string
}

Temporal.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_evento: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_tipodocumento: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    numero_documento: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    nombre_impresion: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    fecha_envio: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    tabla: {
        type: DataTypes.STRING(30),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Temporal',
    timestamps: true,
    freezeTableName: true
})

export default Temporal