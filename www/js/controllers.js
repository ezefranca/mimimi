angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {

})

.controller('MainCtrl', function($scope, $ionicActionSheet, $ionicSlideBoxDelegate) {
  $scope.plus = 'ion-ios-plus-outline';
  $scope.closed = true;
  $scope.showOptions = 'hide-options';
  $scope.slide = 'slide-1';
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
	
//	var actionSheet = $ionicActionSheet.show({
//	 buttons: [
//	   { text: 'Escrever' },
//	   { text: 'Falar' }
//	 ],
//	 titleText: 'Expresse-se',
//	 cancelText: 'Cancelar',
//	 cancel: function() {
//		$scope.plus = 'ion-ios-plus-outline';
//	 },
//	 buttonClicked: function(index) {
//		$scope.plus = 'ion-ios-plus-outline';
//	   return true;
//	 }
//   });
  }
  
  $scope.openTextInput = function(){
	$ionicSlideBoxDelegate.next();
	$scope.slide = 'slide-2';
  }
  
  $scope.slideHasChanged = function(index){
	console.log(index);
	switch(index){
		case 0: $scope.slide = 'slide-1'; break;
		case 1: $scope.slide = 'slide-2'; break;
		case 2: $scope.slide = 'slide-3'; break;
	}
  }
});

