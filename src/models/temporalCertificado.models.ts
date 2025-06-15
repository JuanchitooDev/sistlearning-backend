import sequelize from '../config/db'
import { Model, DataTypes } from 'sequelize'

class TemporalCertificado extends Model {
    public id?: number
    public id_evento?: number
    public id_tipodocumento?: number
    public numero_documento?: string
    public tabla?: string
}

TemporalCertificado.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_evento: {
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
    tabla: {
        type: DataTypes.STRING(30),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'TemporalCertificado',
    timestamps: true,
    freezeTableName: true
})

export default TemporalCertificado