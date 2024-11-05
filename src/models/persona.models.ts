import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import TipoDocumento from './tipoDocumento.models'

class Persona extends Model {
    public id?: number
    public id_tipodocumento?: number
    public numero?: string
    public nombres?: string
    public apellido_paterno?: string
    public apellido_materno?: string
    public nombre_completo?: string
    public departamento?: string
    public provincia?: string
    public distrito?: string
    public direccion?: string
    public direccion_completa?: string
    public ubigeo_reniec?: string
    public ubigeo_sunat?: string
    public ubigeo?: string
    public fecha_nacimiento?: string
    public estado_civil?: string
    public foto?: string
    public sexo?: string
    public origen?: 'API | WEB | APP'
    public estado?: boolean
}

Persona.init({
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
    numero: {
        type: DataTypes.STRING(13),
        allowNull: false
    },
    nombres: {
        type: DataTypes.STRING(20),
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
    nombre_completo: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    departamento: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    provincia: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    distrito: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    direccion: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    direccion_completa: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    ubigeo_reniec: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    ubigeo_sunat: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    ubigeo: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    fecha_nacimiento: {
        type: DataTypes.STRING(12),
        allowNull: false,
        defaultValue: ''
    },
    estado_civil: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    foto: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    sexo: {
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    origen: {
        type: DataTypes.ENUM('API', 'WEB', 'APP'),
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Persona',
    timestamps: true,
    freezeTableName: true
})

Persona.belongsTo(TipoDocumento, { foreignKey: 'id_tipodocumento' })

export default Persona