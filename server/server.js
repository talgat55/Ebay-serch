import express from "express";
import bodyParser from "body-parser";
import templating from "consolidate";
import ebay from "ebay-api";
import config from "./../config/config.json";


const  app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());


app.engine("hbs", templating.twig );

app.set("view engine", "twig");
app.set("views", __dirname + "/../client/views");
// routes
app.get( "/",  (req, res) =>  {

  res.render("index", {
    title : "Entry name product for search in Ebay"

  });

});
app.post("/", (req, res) => {


  if(!req.body.search || req.body.search==""){

    res.render("index", {
        title: "Please Entry name product ",

    });
  }else {

    // ebay
    var params = {
      keywords: [req.body.search],

      // add additional fields
    //  outputSelector: ['AspectHistogram'],

      paginationInput: {
        entriesPerPage: 10
      },
    /*
      itemFilter: [
        {name: 'FreeShippingOnly', value: true},
        {name: 'MaxPrice', value: '150'}
      ],*/
    /*
      domainFilter: [
        {name: 'domainName', value: 'Digital_Cameras'}
      ]*/
    };

    ebay.xmlRequest({
        serviceName: 'Finding',
        opType: 'findItemsByKeywords',
        appId: config.appid,      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
        params: params,
        parser: ebay.parseResponseJson    // (default)
      },
      // gets all the items together in a merged array
      function itemsCallback(error, itemsResponse) {
        if (error) throw error;

        var items = itemsResponse.searchResult.item;

        res.render("results", {
            title: "Results",
            value: req.body.search,
            dataebays: items

        });

      }
    ); // end request ebay



      // end request if
  }

});


app.listen(3000 , () =>  console.log("server run port 3000") );
