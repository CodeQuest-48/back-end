<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <h1 align="center">Api Rest CodeQuest 2024</h1>

## Guía de Instalación

1. Clona el Repositorio
2. Reconstruye el proyecto

```bash
$ npm install
```
3. Renombrar el archivo .env.template a .env y rellenar las variables de entorno que están ahí. Esas son las necesarias para que funcione el sistema

4. Levantar la base de datos ejecutando el siguiente comando -> (Obligatorio: Tener docker instalado)

```
docker-compose up -d
```

## Correr la Aplicación

```bash
# Desarrollo
$ npm run start:dev

# Producción
$ npm run start:prod
```
