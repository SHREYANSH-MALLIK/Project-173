AFRAME.registerComponent("create-markers", {
  
    init: async function() {
  
      var mainScene = document.querySelector("#main-scene");
  
      //get the toys collection from firestore database
      var toys = await this.getAllToys();
     
      toys.map(toy => {
        var marker = document.createElement("a-marker");   
        marker.setAttribute("id", toy.id);
        marker.setAttribute("type", "pattern");
        marker.setAttribute("url", toy.marker_pattern_url);
        marker.setAttribute("cursor", {
          rayOrigin: "mouse"
        });

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
  
        if(!toy.unavailable_days.includes(days[todayDay])){
  
            //set the markerhandler component
            marker.setAttribute("markerhandler", {});
            mainScene.appendChild(marker);
      
            // Adding 3D model to scene
            var model = document.createElement("a-entity");    
          
            model.setAttribute("id", `model-${toy.id}`);
            model.setAttribute("position", toy.model_geometry.position);
            model.setAttribute("rotation", toy.model_geometry.rotation);
            model.setAttribute("scale", toy.model_geometry.scale);
            model.setAttribute("gltf-model", `url(${toy.model_url})`);
            model.setAttribute("gesture-handler", {});
            marker.appendChild(model);
            mainPlane.appendChild(ingredients);
        }
      });
    },

    getAllToys: async function() {
      return await firebase
        .firestore()
        .collection("toys")
        .get()
        .then(snap => {
          return snap.docs.map(doc => doc.data());
        });
    }
});