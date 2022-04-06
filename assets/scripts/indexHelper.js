function createIndex() {
  // create index here
  // Index is created on fields "marketname", "payment", "products" in seasional, "city" in address

  //alert("createIndex" + ref);

  var index = {
    product: undefined,
    marketName: undefined,
    payment: undefined,
    city: undefined,
  };
  //console.log(index);
  fetch("assets/reference/reference.json")
    .then((response) => response.json())
    .then((layers) => {
      //console.log(layers["indexFiles"]);
      Object.entries(layers["indexFiles"]).forEach((entry) => {
        const [file, fileId] = entry;
        //console.log("assests/data-files/" + file);
        let fileName = fileId;
        fetch("assets/data-files/" + file)
          .then((response) => response.json())
          .then((fileData) => {
            // console.log(file);
            // loop through data and create index
            let count = 0;
            fileData.forEach((data) => {
              //console.log(data);
              //console.log("marketname " + fileName);
              if (
                data.hasOwnProperty("properties") &&
                data.properties.hasOwnProperty("marketname")
              ) {
                //console.log(data["properties"]["marketname"]);
                //console.log(index["marketName"]);
                if (
                  index["marketName"] != undefined &&
                  index["marketName"].hasOwnProperty(
                    data["properties"]["marketname"]
                  )
                ) {
                  //console.log("in if");
                  index["marketName"][
                    data["properties"]["marketname"].trim()
                  ].push({
                    file: fileName,
                    index: count,
                  });
                } else {
                  let temp = {};
                  temp[data["properties"]["marketname"].trim()] = [
                    { file: fileName, index: count },
                  ];
                  // add to index
                  index["marketName"] = { ...index["marketName"], ...temp };
                  //index["marketName"].temp = temp;
                }
              }

              // index on Products

              if (
                data.hasOwnProperty("properties") &&
                data.properties.hasOwnProperty("seasonal")
              ) {
                let seasonalArray = data.properties.seasonal;
                // console.log(seasonalArray + " " + file);
                if (seasonalArray != null)
                  seasonalArray.forEach((seasion) => {
                    if (seasion.hasOwnProperty("products")) {
                      let productsArray = seasion.products.split(";");
                      // console.log(productsArray);
                      productsArray
                        .filter((prod) => prod != "")
                        .forEach((product) => {
                          if (
                            index["product"] != undefined &&
                            index["product"].hasOwnProperty(product)
                          ) {
                            index["product"][product].push({
                              file: fileName,
                              index: count,
                            });
                          } else {
                            let temp = {};
                            temp[product] = [{ file: fileName, index: count }];
                            // add to index
                            index["product"] = { ...index["product"], ...temp };
                          }
                        });
                    }
                  });
              }
              count++;
              //objData["marketname"] = data["marketname"];
            });
            // console.log(index);

            // var mainExFlData = "assets/reference/index.json";
            // // Write data into mainExFlData
            // var file = new Blob([JSON.stringify(index)], {
            //   type: "application/json",
            // });
            // var fileURL = URL.createObjectURL(file);
            // var a = document.createElement("a");
            // a.href = fileURL;
            // a.download = mainExFlData;
            // a.click();

            //var fileURL = URL.createObjectURL(file);
            //var a = document.createElement("a");
            //a.href = fileURL;
            //a.download = mainExFlData;
            //a.click();

            // var flName = new File([JSON.stringify(index)], "utf-8");
            // write to file

            //flName.open("w"); // open file with write access
            //flName.writeln("First line of text");
            // flName.writeln("Second line of text " + userString);
            //flName.write(userString);
            //flName.close();
          });
      });
    });
}

function searchData(inputData) {
  /*
 Input format 
  {
    "marketname": "",
    "payment": "",
    "products": "",
  }
  */
  console.log(cachedMarkers);
  fetch("assets/reference/index.json")
    .then((response) => response.json())
    .then((index) => {
      console.log(index);
      console.log(inputData);
      let searchResults = [];
      // check if marketname is present in marketname in index
      if (inputData["marketname"] != "") {
        if (
          Object.keys(index["marketName"]).length > 0 &&
          index["marketName"].hasOwnProperty(inputData["marketName"])
        ) {
          searchResults.push({
            marketName: index["marketName"][inputData["marketName"]],
          });
          console.log("marketname");
          console.log(index["marketName"][inputData["marketName"]]);
        }
      }
      // console.log(inputData["product"]);
      // check if payment is present in payment in index
      if (inputData["product"] != "") {
        if (
          Object.keys(index["product"]).length > 0 &&
          index["product"].hasOwnProperty(inputData["product"])
        ) {
          searchResults.push({
            product: index["product"][inputData["product"]],
          });
          // console.log("product");
          // console.log(index["product"][inputData["product"]]);
        }
      }
      // check if products is present in products in index
      if (inputData["payment"] != "") {
        if (
          index.hasOwnProperty("payment") &&
          Object.keys(index["payment"]).length > 0 &&
          index["payment"].hasOwnProperty(inputData["payment"])
        ) {
          searchResults.push({
            payment: index["payment"][inputData["payment"]],
          });
          // console.log("payment");
          // console.log(index["payment"][inputData["payment"]]);
        }
      }
      // console.log(searchResults);
    });
}

function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function (e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

let indexKeys = [];

createSearchKeys();

function createSearchKeys() {
  var searchKeys = [];

  fetch("assets/reference/index.json")
    .then((response) => response.json())
    .then((layers) => {
      Object.keys(layers).forEach((key) => {
        Object.keys(layers).forEach((layer) => {
          indexKeys = [...Object.keys(layers[layer]), ...indexKeys];
        });
        autocomplete(document.getElementById("searchText"), indexKeys);

        // return indexKeys;
      });
    });
}

function isButtonDisable() {
  document.getElementById("searchButton").disabled =
    document.getElementById("searchText").value === "";
}
