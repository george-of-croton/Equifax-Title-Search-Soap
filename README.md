## Consume the Equifax Land Title SOAP API

Basic example to get you up and running with the Equifax land titles SOAP API.

I found the documentation for this service really unhelpful and all the examples they provide are either outdated or slightly incorrect so I thought I'd upload this in case some other poor soul ever had to use it.

the project makes use of the really great [node-soap](https://github.com/vpulim/node-soap) module which provides a really simple and friendly API with great documentation. However, I did have to make a slight tweak to allow the addition of XML attributes to the soap:header element. My fork of the node-soap repo is included in the package.json so it should work if your only using it to integrate with this specific service.
