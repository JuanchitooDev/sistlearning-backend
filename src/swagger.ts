import swaggerJSDoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mi Api',
            version: '1.0.0',
            description: 'Documentación de la API'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ]
    },
    apis: ['./src/routes/*.ts']
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec