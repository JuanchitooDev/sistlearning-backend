import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import Pais from './pais.models'

class Departamento extends Model {
    public id?: number
    public id_pais?: number
    public nombre?: string
    public nombre_url?: string
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public estado?: boolean
}

Departamento.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_pais: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Pais,
            key: 'id'
        }
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
    modelName: 'Departamento',
    timestamps: true,
    freezeTableName: true
})

Departamento.belongsTo(Pais, { foreignKey: 'id_pais' })

export default Departamento