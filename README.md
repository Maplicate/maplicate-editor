# mapix

Mapix is a collaborative mapping based on IPFS and orbit-db.

## Idea

Today, most large-scale mapping work is done with a collaborative way. From collecting business locations for an urban development plan to surveying for a road constructing plan, mapping at this scale usually takes the effort of tens of or hundreds of people. OpenStreetMap, the world's largest collaborative mapping program, is maintained by volunteers from the whole world.

Data sharing is the center of the collaborative mapping. In the current practice, the data sharing is based on a master database where all mappers' client read updates from and write updates to.

However, the use of a master database has several disadvantages:
* there is cost to maintain such database
* the data is not sharable without the connection of the database
* the data has to be stored at a 3rd party
* it takes more time to share data via a middleman

In this project, a mapping tool based on a peer-to-peer network (IPFS).

## Implementation

A mapping client is a browser-based application. It is node in the IFPS network and uses orbit-db to synchronize data with peers.

Currently, orbit-db uses in-memory cache as local storage. When the user maps a feature, the application will add the geojson data into orbit-db and synchronize with connected peers. When the application is off-line, the data is stored at the local storage and get synchronized once connected.

## To-do

* [ ] try IPFS browser workability
* [ ] update ngx-leaflet-starter to Angular 6
* [ ] copy ngx-leaflet-starter into this project and make it map-only
* [ ] add orbit-db and sync with map room table
* [ ] add map editing tool
* [ ] create map room and add peer
* [ ] share geojson among peers
* [ ] map shows synchronized geojson
