import sequelize from '../config/db'
import { Model, DataTypes } from 'sequelize'

class Temporal extends Model {
    public id?: number
    public id_tipodocumento?: number
    public numero_documento?: string
    public tabla?: string
    public esInsertado?: boolean
}

Temporal.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    },
    esInsertado: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Temporal',
    timestamps: true,
    freezeTableName: true
})

export default Temporal