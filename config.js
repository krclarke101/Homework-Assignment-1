/*
 * Create and export configuration variables
 *
 */

// Container for all the environments
var environments = {};

// Development (default) object
environments.development = {
	'httpPort' : 3000,
	'envName' : 'development'
};
// Production object
environments.production = {
	'httpPort' : 4000,
	'envName' : 'production'
};

// determine which one should be exported when passed as a command line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the above, if not then default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.development;

// Export module
module.exports = environmentToExport;