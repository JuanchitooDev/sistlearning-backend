import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import Trabajador from './trabajador.models'
import Perfil from './perfil.models'

class Usuario extends Model {
    public id?: number
    public id_trabajador?: number
    public id_perfil?: number
    public username?: string
    public password?: string
    public token?: string
    public fecha_sesion?: string
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public estado?: boolean
}

Usuario.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_trabajador: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Trabajador,
            key: "id"
        }
    },
    id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Perfil,
            key: "id"
        }
    },
    username: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    token: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    fecha_sesion: {
        type: DataTypes.DATE,
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
    modelName: "Usuario",
    timestamps: true,
    freezeTableName: true
})

Usuario.belongsTo(Trabajador, { foreignKey: 'id_trabajador'} )

Usuario.belongsTo(Perfil, { foreignKey: 'id_perfil' })

export default Usuario;