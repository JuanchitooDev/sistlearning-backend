import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import TipoDocumento from './tipoDocumento.models'
import Pais from './pais.models'
import Departamento from './departamento.models'

class Alumno extends Model {
    public id?: number
    public id_tipodocumento?: number
    public id_pais?: number
    public id_departamento?: number
    public numero_documento?: string
    public apellido_paterno?: string
    public apellido_materno?: string
    public nombres?: string
    public nombre_capitalized?: string
    public telefono?: string
    public direccion?: string
    public email?: string
    public fecha_nacimiento?: Date
    public fecha_nacimiento_str?: string
    public sexo?: string
    public nombre_pais?: string
    public nombre_departamento?: string
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public sistema?: boolean
    public estado?: boolean
}

Alumno.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_tipodocumento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoDocumento,
            key: 'id'
        }
    },
    id_pais: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Pais,
            key: 'id'
        }
    },
    id_departamento: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Departamento,
            key: 'id'
        }
    },
    numero_documento: {
        type: DataTypes.STRING(13),
        allowNull: false
    },
    apellido_paterno: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    apellido_materno: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    nombres: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    nombre_capitalized: {
        type: DataTypes.STRING(70),
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_nacimiento_str: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    sexo: {
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    nombre_pais: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    nombre_departamento: {
        type: DataTypes.STRING(30),
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
    modelName: 'Alumno',
    timestamps: true,
    freezeTableName: true
})

Alumno.belongsTo(TipoDocumento, {foreignKey: 'id_tipodocumento'})

Alumno.belongsTo(Pais, {foreignKey: 'id_pais'})

Alumno.belongsTo(Departamento, {foreignKey: 'id_departamento'})

export default Alumno