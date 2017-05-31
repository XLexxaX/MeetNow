# Backend for the meetNow app
Written in Java using [Spring Boot](https://projects.spring.io/spring-boot) and [swagger](http://swagger.io/). For more information about swagger 
usage please refer to this [page](/src/main/resources/README.md).

## Setup Development Environment
### Maven
1. If you don't have maven, download the binary zip archive from [here](https://maven.apache.org/download.cgi).
2. Follow the installation steps describend [here](https://maven.apache.org/install.html).
3. Especially ensure that `JAVA_HOME` environment variable is set and add the maven/bin directory to the `PATH` Variable.

### Eclipse / Spring Tool Suite Setup
1. Create a new general project at the location of the MeetNow/backend directory.
2. Press `F5`(refresh) on the project. The subfolders should now appear.
3. Right-click the project and chooes `Configure` -> `Convert to Maven project`.
4. Press `Alt+F5` to update the maven project and download necessary dependencies.
5. Run `mvn clean verify` in a terminal in the project folder. This will generate the class files from the swagger code generation.
6. Add the `gen/src/java` directory to the build path (only the subfolder!). Therefore right-click the java folder and choose 
`Build-Path`->`Use as source folder`.

### Postman
Add the Postam Extension as a Chrome Plugin.
Open the Postam Plugin by pressing the `windows key` and typing "postman". Choose take me directly to the app.

## Local Testing
Test your spring Application:
- Eclipse: Open the MeetNowApplication.class and choose `Run`->`Run-As`->Java Application.
- STS: Open the Spring Boot View and press the start button.

After Startup, you can access the application via postman.

## Committing
1. Before you commit your changes to the github repository, always run a `mvn clean verify`. Only push to git if your build ended up with
`BUILD SUCCESS`. (Only for the spring project! If you changed something regarding the mobile app, you don't need to run maven)
2. Add your changes using your IDE or `git add filename`.
3. Commit your local changes using your IDE or `git commit -m "your commit message".
4. Fetch updates from upstream using your IDE or `git fetch`.
5. If there are updates, use `git rebase` to set your commit(s) on top of the remote commits.
6. After a successfull rebase, push your changes to the remote repository using `git push`.


