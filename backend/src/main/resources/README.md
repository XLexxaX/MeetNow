# Swagger Usage
The application uses swagger to specify the API between the Ionic Mobile App and the Java Backend.
The API is defined in the [api.yaml](./api.yaml) file. Afterwards, while generating the java code resources, the Swagger Maven Plugin 
generates the necessary model and API classes in the `gen/src/java` folder. This folder is on the gitignore and only available locally after
`mvn clean verify`.

## Editing the API
If you need to change the API, follow these steps. Please discuss changes to the API with the dev team before you change the API.
1. Copy the [api.yaml](./api.yaml) to a [swagger editor](https://editor.swagger.io). 
2. Apply the necessary changes, verify there are no compile errors!
3. Copy the file back to your IDE and run `mvn clean verify`. This will generate the updated .class files for the backend. Make sure your project has no errors. 
4. If errors occur, fix them and rerun `mvn clean verify`. If maven finishes with `BUILD SUCCESS`, you can commit and push your changes as described [here](../../../README.md#committing).
