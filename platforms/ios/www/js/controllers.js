angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http) {
  $http.get('http://162.243.220.111/mimimi').then(function(data){
		console.log(data.data);
		$scope.chorosRelevantes = data.data
  }, function(error){
		console.log(error);
		$ionicLoading.hide();
  });
  
  $scope.doRefresh = function(){
	  $http.get('http://162.243.220.111/mimimi').then(function(data){
			console.log(data.data);
			$scope.chorosRelevantes = data.data
	  }, function(error){
			console.log(error);
			$ionicLoading.hide();
	  });
  }
  
  $scope.like = function(id){
	$http.post('http://162.243.220.111/mimimi/like/'+id).then(function(data){
		console.log(data);
		$scope.doRefresh();
	}, function(error){
		console.log(error);
	});
  }
  
  $scope.meh = function(id){
	$http.post('http://162.243.220.111/mimimi/meh/'+id).then(function(data){
		console.log(data);
		$scope.doRefresh();
	}, function(error){
		console.log(error);
	});
  }
})

.controller('MainCtrl', function($scope, $ionicActionSheet, $ionicSlideBoxDelegate, $http, $ionicLoading, $ionicScrollDelegate) {
  $scope.plus = 'ion-ios-plus-outline';
  $scope.closed = true;
  $scope.showOptions = 'hide-options';
  $scope.showChoro = 'hide-choro';
  $scope.showAnswer = 'hide-answer';
  $scope.slide = 'slide-2';
  $scope.choros = [];
  
  $ionicSlideBoxDelegate.enableSlide(false);
  
  $scope.openPostOptions = function(closed){
	if($scope.closed){
		$scope.plus = 'ion-ios-plus';
		$scope.showOptions = 'show-options';
		$scope.closed = false;
	}else{
		$scope.plus = 'ion-ios-plus-outline';
		$scope.showOptions = 'hide-options';
		$scope.closed = true;
	}
  }
  
  $scope.openTextInput = function(){
	$ionicSlideBoxDelegate.next();
	$scope.slide = 'slide-2';
  }
  
  $scope.slideHasChanged = function(index){
	console.log(index);
	switch(index){
		case 0: $scope.slide = 'slide-2'; break;
		case 1: $scope.slide = 'slide-2'; break;
		case 2: $scope.slide = 'slide-3'; break;
	}
  }
  
  $scope.search = function(searchData){
	$ionicScrollDelegate.scrollBottom(true);
	
	$scope.choro = searchData.text;
	$scope.showOptions = 'hide-options';
	$scope.showChoro = 'show-choro';
	
	$scope.plus = 'ion-ios-plus-outline';
	$scope.slide = 'slide-2';
	$scope.showLogo = 'hide';
	$scope.closed = true;
	
	$ionicLoading.show();
	$http.post('http://162.243.220.111/mimimi', searchData).then(function(data){
		console.log(data.data);
		
		$ionicLoading.hide();
		
		$scope.choros.push({ choro: searchData.text, answer: data.data.text });
		
		searchData.text = '';
		$scope.showAnswer = 'show-answer';
	}, function(error){
		console.log(error);
		$ionicLoading.hide();
	});
  }
});

