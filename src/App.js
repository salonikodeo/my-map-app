import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  state = {
    venues: []
  }
  componentDidMount() {
    this.getPlaces()
    this.loadMap()
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDIH856EDhM6HZ9pI3A5NhPko9vjNOwBhw&callback=initMap")
    window.initMap = this.initMap
  }

  getPlaces = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id : "GZW23AP4MZ5N5TPYFXWICJMZDGCQVHKMOXLAFLNCOQUZO3PA",
      client_secret : "CWCZRBRASQDLLMMVO3NKYQ5LLBPX1AQGKNMINMUN1RM0DYVB",
      query : "foods",
      near : "Bhopal, India",
      v : "20182507"
    }
    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response => {
      this.setState({
        venues : response.data.response.groups[0].items
      }, this.loadMap())
    })
    .catch(error => {
      console.log("ERROR! " + error);
    })
  }

  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 23.259933, lng: 77.412615},
      zoom: 8
    });
    var infowindow = new window.google.maps.InfoWindow();

    this.state.venues.map(ven => {
      var contentString =  `${ven.venue.name}`;
      
      var marker = new window.google.maps.Marker({
      position : {lat: ven.venue.location.lat, lng: ven.venue.location.lng},
      map : map,
      title : ven.venue.name
      });
      marker.addListener('click', function() {
        infowindow.setContent(contentString)
        infowindow.open(map, marker);
      });
    })
  
  }

  render() {
    return (
      <main>
        <div id="map"></div>
      </main>
    );
  }
}

export default App;

function loadScript(url) {
  var index = window.document.getElementsByTagName('script')[0]
  var script = window.document.createElement('script')
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}