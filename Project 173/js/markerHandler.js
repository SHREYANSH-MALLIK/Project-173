AFRAME.registerComponent("markerhandler", {
    init: async function () {

      var toys = await this.gettoys();

      this.el.addEventListener("markerFound", () => {
        var markerId = this.el.id;      
        this.handleMarkerFound(toys, markerId);
      });

      this.el.addEventListener("markerLost", () => {
        this.handleMarkerLost();
      });
  
    },
    handleMarkerFound: function (toys, markerId) {
  
      var todayDate = new Date()
      var todayDay = todayDate.getDay()
  
      var days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ]
  
      var toy = toys.filter(toy => toy.id === markerId)[0]
      if(toy.unavailable_days.includes(days[todayDay])){
        swal({
          icon : "warning",
          title : toy.toy_name.toUpperCase(),
          text : "This toy is not available today",
          timer : 2500,
          buttons : false
        })
      } else {
        
      }
  
      // Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "flex";
  
      var ratingButton = document.getElementById("rating-button");
      var orderButtton = document.getElementById("order-button");
      var orderSummaryButton = document.getElementById("order-summary-button")
      var payButton = document.getElementById("pay-button")
  
      // Handling Click Events
      ratingButton.addEventListener("click", function () {
        swal({
          icon: "warning",
          title: "Rate toy",
          text: "Work In Progress"
        });
      });
  
      orderButtton.addEventListener("click", () => {
        swal({
          icon: "https://i.imgur.com/4NZ6uLY.jpg",
          title: "Thanks For Order !",
          text: "Your order will serve soon on your table!"
        });
      });
  
      orderSummaryButton.addEventListener("click", () => this.handleOrderSummary())
  
      payButton.addEventListener("click", () => this.handlePayment)
  
      // Changing Model scale to initial scale
      var toy = toys.filter(toy => toy.id === markerId)[0];
  
      var model = document.querySelector(`#model-${toy.id}`);
      model.setAttribute("position", toy.model_geometry.position);
      model.setAttribute("rotation", toy.model_geometry.rotation);
      model.setAttribute("scale", toy.model_geometry.scale);
    },
  
    handleMarkerLost: function () {
      // Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "none";
    },
    //get the toys collection from firestore database
    gettoys: async function () {
      return await firebase
        .firestore()
        .collection("toys")
        .get()
        .then(snap => {
          return snap.docs.map(doc => doc.data());
        });
    },
  
    getOrderSummary: async function(tNumber){
      return await firebase
      .firestore()
      .collection("Tables")
      .doc(tNumber)
      .get()
      .then(doc => doc.data())
    },
  
    handleOrderSummary: async function(){
      var tNumber 
      tableNumber <= 9 ?(tNumber = `T0${tableNumber}`): `T${tableNumber}`
      var orderSummary = await this.getOrderSummary(tNumber)
  
      var modalDiv = document.getElementById("modal-div")
      modalDiv.style.display = "flex"
      var tableBodyTag = document.getElementById("bill-table-body")
      tableBodyTag.innerHTML = ""
  
      var currentOrders = Object.keys(orderSummary.current_orders)
      currentOrders.map(i => {
        var tr = document.createElement("tr")
        var item = document.createElement("td")
        var price = document.createElement("td")
        var quantity = document.createElement("td")
        var subTotal = document.createElement("td")
  
        item.innerHTML = orderSummary.current_orders[i].item
        price.innerHTML = "$" + orderSummary.current_orders[i].price
        price.setAttribute("class","text-center")
        quantity.innerHTML = orderSummary.current_orders[i].quantity
        quantity.setAttribute("class","text-center")
        subTotal.innerHTML = "$" + orderSummary.current_orders[i].subTotal
        subTotal.setAttribute("class","text-center")
  
        tr.appendChild(item)
        tr.appendChild(price)
        tr.appendChild(quantity)
        tr.appendChild(subTotal)
  
        tableBodyTag.appendChild(tr)
      })
  
      var totalTr = document.createElement("tr")
      var td1 = document.createElement("td")
      td1.setAttribute("class","no-line")
      
      var td2 = document.createElement("td")
      td1.setAttribute("class","no-line")
  
      var td3 = document.createElement("td")
      td1.setAttribute("class","no-line text-center")
  
      var strongTag = document.createElement("strong")
      strongTag.innerHTML = "total"
  
      td3.appendChild(strongTag)
  
      var td4 = document.createElement("td")
      td1.setAttribute("class","no-line text-right")
  
      td4.innerHTML = "$" + orderSummary.total_bill
      totalTr.appendChild(td1)
      totalTr.appendChild(td2)
      totalTr.appendChild(td3)
      totalTr.appendChild(td4)
  
      tableBodyTag.appendChild(totalTr)
    },
  
    handlePayment: function(){
      document.getElementById("modal-div").style.display = "none"
      var tNumber
      tableNumber <= 9 ?(tNumber = `T0${tableNumber}`): `T${tableNumber}`
  
      firebase
      .firestore()
      .collection("Tables")
      .doc(tNumber).update({
        current_orders : {},
        total_bill  : 0
      })
      .then(() => {
        swal({
          icon : "success",
          title : "Thanks For Paying",
          text : "We hope You Enjoyed your Food !!",
          timer : 2500,
          buttons : false
        })
      })
    },

      handleRatings: async function (toy) {

        // Getting Table Number
        var tNumber;
        tableNumber <= 9 ? (tNumber = `T0${tableNumber}`) : `T${tableNumber}`;
        
        // Getting Order Summary from database
        var orderSummary = await this.getOrderSummary(tNumber);
    
        var currentOrders = Object.keys(orderSummary.current_orders);    
    
        if (currentOrders.length > 0 && currentOrders==toy.id) {
          
          // Close Modal
          document.getElementById("rating-modal-div").style.display = "flex";
          document.getElementById("rating-input").value = "0";
          document.getElementById("feedback-input").value = "";
    
          //Submit button click event
          var saveRatingButton = document.getElementById("save-rating-button");
    
          saveRatingButton.addEventListener("click", () => {
            document.getElementById("rating-modal-div").style.display = "none";
            //Get the input value(Review & Rating)
            var rating = document.getElementById("rating-input").value;
            var feedback = document.getElementById("feedback-input").value;
    
            //Update db
            firebase
              .firestore()
              .collection("toyes")
              .doc(toy.id)
              .update({
                last_review: feedback,
                last_rating: rating
              })
              .then(() => {
                swal({
                  icon: "success",
                  title: "Thanks For Rating!",
                  text: "We Hope You Like toy !!",
                  timer: 2500,
                  buttons: false
                });
              });
          });
        } else{
          swal({
            icon: "warning",
            title: "Oops!",
            text: "No toy found to give ratings!!",
            timer: 2500,
            buttons: false
          });
        }
    }
  })