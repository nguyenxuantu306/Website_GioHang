var app = angular.module("myApp", ["ngRoute"]);
app.config(function ($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl: "layout/main.html",
  })
    .when("/layout/login", {
      templateUrl: "layout/login.html",
    })
    .when("/layout/register", {
      templateUrl: "layout/register.html",
    })
    .when("/layout/info_product", {
      templateUrl: "layout/info_product.html",
    })
    .otherwise({
      redirectTo: "layout/main.html",
    });
});

app.run(function ($rootScope) {
  $rootScope.$on("$routeChangeStart", function () {
    $rootScope.loading = true;
  });
  $rootScope.$on("$routeChangeSuccess", function () {
    $rootScope.loading = false;
  });
  $rootScope.$on("$routeChangeError", function () {
    $rootScope.loading = false;
    alert("Lỗi!!! Không tải được template");
  });
});

app.controller("myCtrl", function ($scope, $http) {
  $http.get("/data/products.json").then(function (response) {
    $scope.products = response.data;
  });

  $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];

  // tính tổng giá tiền của một sản phẩm
  function calculateTotalPrice(item) {
    item.totalPrice = item.price * item.quantity;
  }

  // tính tổng giá tiền của toàn bộ giỏ hàng
  function calculateTotalCartPrice() {
    $scope.totalCartPrice = 0;
    for (var i = 0; i < $scope.cart.length; i++) {
      $scope.totalCartPrice += $scope.cart[i].totalPrice;
    }
  }

  $scope.addToCart = function (product) {
    var index = -1;
    for (var i = 0; i < $scope.cart.length; i++) {
      if ($scope.cart[i].id === product.id) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      var item = {
        id: product.id,
        img: product.img,
        name: product.name,
        price: product.price,
        quantity: 1,
      };
      $scope.cart.push(item);
    } else {
      $scope.cart[index].quantity++;
    }
    calculateTotalPrice(item);
    calculateTotalCartPrice();
    localStorage.setItem("cart", JSON.stringify($scope.cart));
  };

  $scope.removeFromCart = function (product) {
    var index = $scope.cart.indexOf(product);
    if (index > -1) {
      $scope.cart.splice(index, 1);
    }
    calculateTotalCartPrice();
    localStorage.setItem("cart", JSON.stringify($scope.cart));
  };

  $scope.updateTotalPrice = function (item) {
    calculateTotalPrice(item);
    calculateTotalCartPrice();
    localStorage.setItem("cart", JSON.stringify($scope.cart));
  };

  calculateTotalCartPrice();
});

window.addEventListener("beforeunload", function () {
  localStorage.setItem("cart", JSON.stringify($scope.cart));
});

function updateTime() {
  var now = new Date();
  var clock = document.getElementById("clock");
  clock.textContent = now.toLocaleTimeString() + "s" ;
}
setInterval(updateTime, 1000);

$scope.prop = "name";
      $scope.sortBy = function (prop) {
        $scope.prop = prop;
      }



