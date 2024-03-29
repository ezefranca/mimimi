// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.style(1);
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app',{
	   url: '/app',
	   abstract: true,
	   templateUrl: 'templates/menu.html',
	   controller: 'AppCtrl'
	})
	.state('app.main',{
	   url: '/main',
	   views: {
		'menuContent': {
			templateUrl: 'templates/main.html',
			controller: 'MainCtrl'
		}
	   }
	});

  $urlRouterProvider.otherwise('/app/main');
});

