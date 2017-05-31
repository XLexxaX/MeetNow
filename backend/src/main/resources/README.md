# Swagger Usage
The application uses swagger to specify the API between the Ionic Mobile App and the Java Backend.
The API is defined in the [api.yaml](/api.yaml) file. Afterwards, while generating the java code resources, the Swagger Maven Plugin 
generates the necessary model and API classes in the gen/src/java folder. This folder is on the gitignore and only available locally after
`mvn clean verify`.

## Editing the API
TODO
