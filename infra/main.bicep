targetScope = 'resourceGroup'
param location string = 'eastus2'
param appName string = 'bcrs-grimsyntaxcloud'
param existingCosmosName string = 'nodebucket-grimsyntaxcloud'

// Reuse the existing free-tier account. Do not create a second paid account.
resource cosmos 'Microsoft.DocumentDB/databaseAccounts@2024-11-15' existing = {
  name: existingCosmosName
}
resource database 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2024-11-15' = {
  parent: cosmos
  name: 'bcrs-demo'
  properties: { resource: { id: 'bcrs-demo' } }
}
resource demo 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections@2024-11-15' = {
  parent: database
  name: 'demo'
  properties: {
    resource: {
      id: 'demo'
      indexes: [{ key: { keys: ['_id'] }, options: { unique: true } }]
    }
    options: { throughput: 400 }
  }
}
resource site 'Microsoft.Web/staticSites@2024-11-01' = {
  name: appName
  location: location
  sku: { name: 'Free', tier: 'Free' }
  properties: {
    stagingEnvironmentPolicy: 'Disabled'
    buildProperties: { skipGithubActionWorkflowGeneration: true }
  }
}
resource settings 'Microsoft.Web/staticSites/config@2024-11-01' = {
  parent: site
  name: 'appsettings'
  properties: {
    MONGODB_DATABASE: database.name
    MONGODB_URI: cosmos.listConnectionStrings().connectionStrings[0].connectionString
  }
  dependsOn: [demo]
}
output appUrl string = 'https://${site.properties.defaultHostname}'
