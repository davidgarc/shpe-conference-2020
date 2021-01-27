const util = require('util');
const exec = util.promisify(require('child_process').exec);
const validEnvironment = ['prod', 'test', 'dev'];
const templateList = [
  {
    name: 'PackageApiTemplate',
    path: 'api/'
  },
  {
    name: 'PackageBucketsTemplate',
    path: 'storage/'
  },
  {
    name: 'SharedLayerTemplate',
    path: 'sharedLayer/'
  },
  {
    name: 'TablesTemplate',
    path: 'tables/'
  },
]

async function ls() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}

async function runCmd(cmd) {
  const { stdout, stderr } = await exec(cmd);
  console.log('stdout:', stdout);
  if (stderr) {
    throw stderr
  }
  return true;
}

async function deployment() {
  const args = process.argv;
  console.log('args: ', args);

  let environment = args[2];
  if (!!!environment) {
    throw 'No environment argument found';
  }

  if (!validEnvironment.includes(environment.trim())) {
    throw 'Invalid environment argument found ';
  }
  let awsProfile = args[5];
  if (!!!awsProfile) {
    awsProfile = 'default';
    console.log('Not AWS profile specified using the one set already for the cli');
  }
  else {
    console.log('AWS profile set to :' + awsProfile);
  }

  const configBucket = args[3];
  if (!!!configBucket) {
    throw 'No configuration bucket argument found. Please provide an existing bucket.';
  }

  const websiteBucket = args[4];
  if (!!!websiteBucket) {
    throw 'No website bucket argument found';
  }

  let cmds = [];

  for (let templateItem of templateList) {
    cmds.push({
      name: templateItem.name,
      cmd: 'sam package --template-file backend/templates/' + templateItem.path + 'template.yaml ' +
        '--output-template-file backend/templates/' + templateItem.path + 'packaged.yaml ' +
        '--s3-bucket ' + configBucket
    });
  }

  cmds.push({
    name: 'SubTemplatesCopy',
    cmd: 'aws s3 cp --recursive --exclude "*template.yaml" backend/templates s3://' + configBucket + '/templates/'
  });

  cmds.push({
    name: 'SamAppTemplate',
    cmd: 'sam package --template-file backend/template.yaml --output-template-file backend/packaged.yaml --s3-bucket ' + configBucket
  });

  cmds.push({
    name: 'cloudFormationExec',
    cmd: 'sam deploy  --template-file backend/packaged.yaml --stack-name web-app-demo-' + environment +
      ' --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND' + 
      ' --parameter-overrides Environment=' + environment + ' WebsiteBucketName=' + websiteBucket + ' ConfigurationBucketName=' + configBucket
  });

  for (let cmd of cmds) {
    console.log("---------Start cmd %s-----------", cmd.name);
    let success = false;
    try {
      if (awsProfile !== 'default') {
        cmd.cmd = cmd.cmd + " --profile " + awsProfile;
      }
      success = await runCmd(cmd.cmd);
    }
    catch (e) {
      switch (cmd.name) {
        case 'cloudFormationExec':
          if (e.message.includes('No changes to deploy')) {
            success = true;
            break;
          }
        default:
          console.error(e);
      };
    }

    console.log("Cmd %s complete with status: %s ", cmd.name, success);
    if (!success) {
      console.log('Stop operation due to previous error!');
      break;
    }
  }
}

//execute the deployment function
deployment();
