AFRAME.registerComponent("create-buttons", {
    init: function() {
      var button1 = document.createElement("orderSummaryButton");
      button1.innerHTML = "ORDER SUMMARY";
      button1.setAttribute("id", "order-summary-button");
      button1.setAttribute("class", "btn btn-warning");
  
      var orderButton = document.createElement("orderButton");
      orderButton.innerHTML = "ORDER NOW";
      orderButton.setAttribute("id", "order-button");
      orderButton.setAttribute("class", "btn btn-warning");

      var button2 = document.createElement("button")
      button2.innerHTML = "ORDER SUMMARY"
      button2.setAttribute("id","order-summary-button")
      button2.setAttribute("class","btn btn-danger ml-3")

      var buttonDiv = document.getElementById("button-div");
      buttonDiv.appendChild(orderSummaryButton);
      buttonDiv.appendChild(orderButton);
    }
  });
  