Node.js Install
==============================================
1. Go to nodejs.org
2. Press big green install button
3. Source: http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/

Express.js Install
==============================================
1. Open Terminal/ Command Prompt
2. Run 'npm install -g express' *Note: npm was installed with Node.js and is the official package manager
3. Run 'npm install -g express-generator'
4. *Source: http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/

Bower Install
==============================================
1. Open Terminal/ Command Prompt
2. Run 'npm install -g bower'

Pull Repository from Github
==============================================
1. Create directory in desired location
2. Open terminal(Mac)/ Git Shell(PC) and navigate to created directory
3. Run 'git init'
4. Set remote repository by running 'git remote add origin https://github.com/TsN-RaMPaGE/crossfit-tracker.git'
5. If you get the error "fatal: remote origin already exists" then run "git remote set-url origin https://github.com/TsN-RaMPaGE/crossfit-tracker.git"
5. Pull files from repository with 'git pull https://github.com/TsN-RaMPaGE/crossfit-tracker.git'
6. *Sources: http://www.newthinktank.com/2014/04/git-video-tutorial/ and http://www.newthinktank.com/2014/04/git-video-tutorial-2/

Configure Application
==============================================
1. Open Terminal/ Command Prompt
2. Navigate to directory where the repository resides
3. Run 'npm install' *Note: 'npm install' installs all dependencies listed in package.json into a directory named 'node_modules'. This new directory is in the git ignore file, therefore any added dependencies will have to be installed manually by each contributor.
4. Run 'bower install' * Note: 'bower install' installs all dependencies listed in bower.josn into a directory named 'public/libs.' All dependencies will have to be installed manually by each contributor like 'npm install.'
5. Run 'npm start' to start the server
6. Open a browser and enter the URL: localhost:1337/home
