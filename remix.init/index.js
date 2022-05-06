const crypto = require('crypto')
const fs = require('fs/promises')
const path = require('path')
const inquirer = require('inquirer')

const toml = require('@iarna/toml')
const sort = require('sort-package-json')
const { execSync, spawnSync } = require('child_process')

function escapeRegExp(string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getRandomString(length) {
  return crypto.randomBytes(length).toString('hex')
}

async function main({ rootDirectory }) {
  const README_PATH = path.join(rootDirectory, 'README.md')
  const FLY_TOML_PATH = path.join(rootDirectory, 'fly.toml')
  const PACKAGE_JSON_PATH = path.join(rootDirectory, 'package.json')

  const REPLACER = 'remix-chop-suey-stack'
  const REPLACER_REGEXP = new RegExp(escapeRegExp(REPLACER), 'g')

  const DIR_NAME = path.basename(rootDirectory)
  const SUFFIX = getRandomString(2)

  const APP_NAME = (DIR_NAME + '-' + SUFFIX)
    // get rid of anything that's not allowed in an app name
    .replace(/[^a-zA-Z0-9-_]/g, '-')

  const [readme, flyToml, packageJson] = await Promise.all([
    fs.readFile(README_PATH, 'utf-8'),
    fs.readFile(FLY_TOML_PATH, 'utf-8'),
    fs.readFile(PACKAGE_JSON_PATH, 'utf-8'),
  ])

  const prodToml = toml.parse(flyToml)
  prodToml.app = prodToml.app.replace(REPLACER, APP_NAME)

  const newReadme = readme.replace(REPLACER_REGEXP, APP_NAME)

  const newPackageJson =
    JSON.stringify(
      sort({ ...JSON.parse(packageJson), name: APP_NAME }),
      null,
      2
    ) + '\n'

  fs.copyFile(
    path.join(rootDirectory, '.env.example'),
    path.join(rootDirectory, '.env')
  )

  await Promise.all([
    fs.writeFile(FLY_TOML_PATH, toml.stringify(prodToml)),
    fs.writeFile(README_PATH, newReadme),
    fs.writeFile(PACKAGE_JSON_PATH, newPackageJson),
  ])

  const [didSetupDb] = await askSetupQuestions({ rootDirectory }).catch(
    (error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        throw error
      }
    }
  )

  if (didSetupDb) {
    console.log(`✅  Project is ready! Start development with "yarn dev"`)
  } else {
    console.log(
      `
Setup is almost complete. You'll next need to install the EdgeDB CLI:

https://www.edgedb.com/install

Then run "edgedb project init" to initialize the db.
    `.trim()
    )
  }
}

async function askSetupQuestions({ rootDirectory }) {
  const answers = await inquirer.prompt([
    {
      name: 'db',
      type: 'confirm',
      default: false,
      message:
        'Do you want to setup the database (requires EdgeDB to be installed)? (Y/n)',
    },
  ])

  let didSetupDb = false

  if (answers.db) {
    console.log('Checking to ensure EdgeDB CLI is installed...')
    let isEdgeDbInstalled = false
    try {
      execSync('type -p edgedb')
      isEdgeDbInstalled = true
    } catch (error) {
      console.warning(`Could not initialize db: EdgeDB CLI not found!`)
    }

    if (isEdgeDbInstalled) {
      spawnSync('edgedb', ['project', 'init', '--non-interactive'], {
        stdio: 'inherit',
        cwd: rootDirectory,
      })
      spawnSync('yarn', ['genereate:edgeql'], {
        stdio: 'inherit',
        cwd: rootDirectory,
      })
      didSetupDb = true
    }
  }

  return [didSetupDb]
}

module.exports = main
