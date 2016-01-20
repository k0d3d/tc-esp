var config_module = angular.module('tc.config.ng', []);
var config_data = {
  'app': {
    'app_name': 'TagChief Stats Reporting'
  },
  'api_config': {
    // 'CONSUMER_API_URL': 'https://tagchief-stats.herokuapp.com'
    // 'CONSUMER_API_URL': 'http://192.168.1.2:3000'
    // 'CONSUMER_API_URL': 'http://192.168.43.27:3000'
    // 'CONSUMER_API_URL': 'http://192.168.43.184:3000'
    // 'CONSUMER_API_URL': 'http://192.168.42.16:3000'
    // 'CONSUMER_API_URL': 'http://localhost:3000'
    'CONSUMER_API_URL': 'http://localhost:3000'
  },
};
angular.forEach(config_data,function(key,value) {
  config_module.constant(value,key);
});