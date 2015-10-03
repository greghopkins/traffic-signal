module.exports = function(wallaby) {
  return {
    files: [
      'src/*.js'
    ],

    tests: [
      'test/*.js'
    ],

    testFramework: 'mocha',

    env: {
      // use 'node' type to use node.js
      type: 'node',

      // if runner property is not set, then wallaby.js embedded node.js version is used
      // you can specifically set the node version by specifying 'node' (or any other command)
      // that resolves your default node version, or just specify the path
      // to your node installation, like

      // runner: 'node'
      // or
      // runner: 'path to the desired node version'
      // TODO figure out how to make nvm work with this... submit issue with wallaby?
      runner: '/Users/gregoryhopkins/.nvm/v0.10.29/bin/node'

      // params: {
      // // node flags
      // runner: 'run --silent',
      //   // env vars
      //   env: 'PARAM1=true;PARAM2=false'
      // }
    }
  };
};
