//node modules
var fs = require('fs')
var soap = require('soap'); // patched soap client - george-of-croton/node-soap
require('dotenv').config() // loads environment variables from .env file

function documentOrderForm(response) {
  var titles = response['search-land-titles-response-data']['land-titles']['land-title']
  console.log(titles)
  return {
    "lt:request-header": {
      "lt:client-reference": process.env.EQUIFAX_CLIENT_REFERENCE
    },
    "lt:order-document-request-data": {
      "lt:state-territory-land-registry": "VIC",
      "lt:order-title-proceed": '',
      "lt:order-title-request" : {
        "lt:title-by-reference": {
          "lt:title-reference": titles[titles.length -1]['title-reference']
        }
      }
    }
  }
}


var request = {
		args: {
			"request-header": {
				"lt:client-reference": process.env.EQUIFAX_CLIENT_REFERENCE,
				"lt:operator-id": process.env.EQUIFAX_OPERATOR_ID,
				"lt:operator-name": process.env.EQUIFAX_OPERATOR_NAME
			},
			"lt:search-land-titles-request-data": {
				"state-territory-land-registry": "VIC",
				"price-confirm-proceed": "true",
				"land-title-search-by-address-request": {
					"address": {
						"lt:street-number": '17',
						"lt:street-name": 'Anzac',
						"lt:street-type": 'AVE',
						"lt:suburb": "Coburg North",
						"lt:state": "VIC",
						"lt:postcode": '3058',
						"lt:country-code": "AUS"
					}
				}
			}
		},
		security: new soap.WSSecurity(process.env.EQUIFAX_API_USERNAME, process.env.EQUIFAX_API_PASSWORD), //adds wsse:security headers to the soap header
		url: 'http://localhost:3000/titleSearch.wsdl', //defines the location of the services WSDL document.
		options: { // default soap request options
			forceSoap12Headers: true,
		}
	}

searchLandTitles(request, orderTitleDocument)


function searchLandTitles(request, callback) {
	soap.createClient(request.url, request.options, function(err, client) {
		client.setEndpoint('https://ctaau.vedaxml.com/cta/sys2/soap12/land-titles-v1') //test environment endpoint. Production endpoint defined in WSDL.
		client.addSoapHeader({
			'wsa:To': 'https://vedaxml.com/sys2/soap12/land-titles-v1',
			'wsa:Action': 'http://vedaxml.com/land-titles/searchLandTitlesRequest'
		})
		client.addHttpHeader('Connection', "Keep-Alive") //prevents large requests from being truncated
		client.addHttpHeader('Content-type', 'application/soap+xml;charset=utf-8')
		client.setSecurity(request.security)
		client.LandTitlesManagementService.LandTitlesManagementSOAP12Port.searchLandTitles(request.args, function(err, result, raw, soapHeader) {
			if (err) console.log(err.body);
			else {
				return callback(result, client);
			}
		});
	})
}

function orderTitleDocument(result, client) {
  client.clearSoapHeaders()
  client.addSoapHeader({
    'wsa:To': 'https://vedaxml.com/sys2/soap12/land-titles-v1',
    'wsa:Action': 'http://vedaxml.com/land-titles/orderDocumentRequest'
  })
  var args = documentOrderForm(result)
  client.LandTitlesManagementService.LandTitlesManagementSOAP12Port.orderDocument(args, function(err, result, raw ,soapHeader) {
    if(err){
      console.log(err.body)
      fs.writeFile(Math.random() + '.xml', err.response.request.body, function(err) {
        !err ? console.log("file written") : console.log(err)
      })
    }
    else {
      console.log(result)
    }
  })
}
