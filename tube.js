var tubeModule = angular.module('Tube', []);

tubeModule.service('tubeService', ['$http', function ($http) {

  function adaptResponse(sourceTubes) {
    return sourceTubes.map(adaptOneTube);
  }

  function adaptOneTube(sourceTube) {
    return {
      line: sourceTube.lineName,
      currentLocation: sourceTube.currentLocation,
      direction: sourceTube.direction,
      eta: sourceTube.timeToStation
    };
  }

  function getTubes () {
    console.log('Requesting tube data now...');
    return $http({
      method: 'GET',
      url: 'https://api.tfl.gov.uk/Line/central/Arrivals?stopPointId=940GZZLUHBN&app_id=&app_key='
    }).then(function (response) {
      console.log('Received tube data.');
      var targetTubes = adaptResponse(response.data);
      console.log(JSON.stringify(targetTubes, null, 2));
      return targetTubes;
    }, function (error) {
      console.log('Got error.');
      var errorJson = JSON.stringify(error, null, 2);
      alert(errorJson);
    });
  }

  return {
    getTubes: getTubes
  };
}]);

tubeModule.controller('TubeCtrl', ['tubeService', '$scope', function (tubeService, $scope) {
  $scope.tubes = [];
  $scope.refreshing = false;
  
  // TODO: a bit hacky - refresh straight away and then every five seconds
  setTimeout(refresh, 0);
  setInterval(refresh, 5000);

  function refresh () {
    $scope.refreshing = true;
    tubeService.getTubes()
      .then(function (tubes) {
        $scope.tubes = tubes;
        $scope.refreshing = false;
      });
  }
}]);
