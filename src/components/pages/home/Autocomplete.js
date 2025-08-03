// Autocomplete.js
import axios from "axios";
import React, { Component, useRef, Fragment } from "react";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import AutocompleteMUI from "@mui/material/Autocomplete";
import styled from "styled-components";
import { MyVerticallyCenteredModal } from "./modal";
import { EditModal } from "./modal";
import LocationCheck from "../../../images/edit-2.svg";
import IconSearch from "../../../images/search-normal.svg";
import IconPlane from "../../../images/newairplane.svg";
import IconLandmark from "../../../images/landmark.svg";
import IconLocation from "../../../images/map.svg";
import Pickup from "../../../images/pickup.svg";
import Dropoff from "../../../images/dropoff.svg";
import AddStop from "../../../images/addstop.svg";

const google = window.google;
const Wrapper = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 20px 20px 10px;
`;
var markers = {};
markers.stop = [];
var bounds = [];
var pickupLatLng = {};
var dropoffLatLng = {};
var stopLatLng = [];
var directionsDisplay;

class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      editModalshow: false,
      location: {},
      modaldata: {},

      open: false,
      options: [],
      inputValue: "",
      loading: false,
      typingTimer: 200,
      currentPlace: null,
      iconType: IconSearch,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.hideEditModal = this.hideEditModal.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.searchInputRef = React.createRef();
    this.autoCompleteRef = React.createRef();
  }

  getLocs = async (keyword) => {
    let self = this;
    let response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/airport/get?keyword=${keyword}`
    );
    if (!response.data || response.data == "undefined") {
      self.setState({ options: [] });
      return;
    }
    let response_data = [...response.data];

    let latitude = response_data[0]?.lat_decimal;
    let longitude = response_data[0]?.lon_decimal;

    if (!latitude || !longitude) {
      return response_data;
    }
    response_data[0].type = "airport";
    if(!isNaN(latitude) && !isNaN(longitude)) {
      let latlng = parseFloat(latitude)+','+parseFloat(longitude);
      let gecocodeResponse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/geocode/get?query=${latlng}`
      );
      let results = gecocodeResponse.data.results;
      if (results[1]) {
        response_data[0].place_id = results[1].place_id;
      } else {
        console.log("No results found");
      }
    }
    return response_data;
  };

  filterLoc = async (keyword) => {
    const filteredLocs = await this.getLocs(keyword);
    this.setState({ options: filteredLocs });
  };

  getPlaceDetail = (place_id, { map, mapApi } = this.props) => {
    var placesService = new mapApi.places.PlacesService(map);
    let self = this;
    placesService.getDetails({ placeId: place_id }, function (results, status) {
      self.setState({ currentPlace: results });
    });
  };

  selectLoc = async (
    selectPlace,
    { map, addplace, mapApi, value, setValue, selectedType, type, id, searchkey } = this.props
  ) => {
    // const place = this.autoCompleteRef.current.getPlace();
    if (!selectPlace || !selectPlace.place_id) return;

    // Places Detail API
    let response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/placedetail/get?query=${selectPlace.place_id}`
    );
      let results = response.data.result;
      let self = this;
        self.setState({ currentPlace: results });
        const place = results;
        const selectedPlaceType = selectPlace.type;
        selectedType(selectedPlaceType);

        if (!place.geometry) return;
        if (place.geometry.viewport) {
          // map.fitBounds(place.geometry.viewport);
          self.setState({ modalShow: true });
          const street_number = place.address_components.find((c) =>
            c.types.includes("street_number")
          ) || { short_name: "" };
          const street_name = place.address_components.find((c) =>
            c.types.includes("route")
          ) ||
            place.address_components.find((c) =>
              c.types.includes("sublocality_level_1")
            ) || { short_name: "" };

          const street = street_number.short_name + " " + street_name.short_name;

          self.setState({
            location: {
              postcode:
                place.address_components.find((c) =>
                  c.types.includes("postal_code")
                ) || {},
              street: street,
              street_number:
                place.address_components.find((c) =>
                  c.types.includes("street_number")
                ) || {},
              street_name:
                place.address_components.find((c) =>
                  c.types.includes("route")
                ) ||
                place.address_components.find((c) =>
                  c.types.includes("sublocality_level_1")
                ) ||
                {},
              city:
                place.address_components.find((c) =>
                  c.types.includes("locality")
                ) || {},
              country:
                place.address_components.find((c) =>
                  c.types.includes("country")
                ) || {},
              state:
                place.address_components.find((c) =>
                  c.types.includes("administrative_area_level_1")
                ) || {},
            },
          });

          if (type == "pickup") {
            setValue(place.formatted_address);
            if (markers.pickup) {
              const result = markers.pickup.setMap(null);
            }
            pickupLatLng = {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
            };
          } else if (type == "dropoff") {
            setValue(place.formatted_address);
            if (markers.dropoff) markers.dropoff.setMap(null);
            dropoffLatLng = {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
            };
          } else {
            value.push(place.formatted_address);

            setValue(value);
            stopLatLng[id] = {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
            };
          }
          bounds = new google.maps.LatLngBounds();
          const directionsService = new google.maps.DirectionsService();
          let waypoints = [];
          stopLatLng.map((val) => {
            waypoints.push({ location: val, stopover: true });
          });

          if (pickupLatLng.lat & dropoffLatLng.lat)
            directionsService.route(
              {
                origin: { lat: pickupLatLng.lat, lng: pickupLatLng.lng },
                destination: { lat: dropoffLatLng.lat, lng: dropoffLatLng.lng },
                waypoints: waypoints,
                travelMode: "DRIVING",
              },
              (response, status) => {
                if (status === "OK") {
                  if (directionsDisplay != null) {
                    directionsDisplay.setMap(null);
                    directionsDisplay = null;
                  }
                  directionsDisplay = new google.maps.DirectionsRenderer({
                    suppressMarkers: true,
                  });
                  directionsDisplay.setMap(map);
                  directionsDisplay.setDirections(response);
                  directionsDisplay.setOptions({
                    polylineOptions: {
                      strokeColor: '#F4730E'
                    }
                  });
                  var route = response.routes[0];
                  var markerCounter = 0;
                  // start marker
                  self.addMarker(
                    route.legs[0].start_location,
                    map,
                    markerCounter++
                  );
                  // the rest
                  for (var i = 0; i < route.legs.length; i++) {
                    self.addMarker(
                      route.legs[i].end_location,
                      map,
                      markerCounter++
                    );
                  }
                } else {
                  console.log("Directions request failed due to " + status);
                }
              }
            );
          if (pickupLatLng.lat) {
            if (markers.pickup) markers.pickup.setMap(null);
            bounds.extend(
              new google.maps.LatLng(pickupLatLng.lat, pickupLatLng.lng)
            );
            markers.pickup = new google.maps.Marker({
              map: map,
              position: { lat: pickupLatLng.lat, lng: pickupLatLng.lng },
              icon: Pickup,
            });
          }
          if (dropoffLatLng.lat) {
            if (markers.dropoff) markers.dropoff.setMap(null);
            bounds.extend(
              new google.maps.LatLng(dropoffLatLng.lat, dropoffLatLng.lng)
            );
            var marker = new google.maps.Marker({
              map: map,
              position: { lat: dropoffLatLng.lat, lng: dropoffLatLng.lng },
              icon: Dropoff,
            });
            markers.dropoff = marker;
          }
          if (stopLatLng.length > 0) {
            stopLatLng.map((val, index) => {
              if (val) {
                bounds.extend(new google.maps.LatLng(val.lat, val.lng));
                if (markers.stop[index]) markers.stop[index].setMap(null);
                var marker = new google.maps.Marker({
                  map: map,
                  position: { lat: val.lat, lng: val.lng },
                  icon: AddStop,
                });
                markers.stop[index] = marker;
              }
            });
          }
          map.fitBounds(bounds);
        } else {
          // map.setCenter(place.geometry.location);
          // map.setMarker({})
          map.setZoom(12);
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: Pickup,
          });
        }
        addplace(place);
        // self.searchInputRef.current.blur();
      // });
  };

  onInputChange = (newInputValue, { map, mapApi, searchkey } = this.props) => {  
    this.setState({ inputValue: newInputValue });
    let search_options;
    let self = this;
    switch (searchkey) {
      case "searchall": // address + airport
        this.getAddressfromMap(newInputValue);
        break;
      case "address": // address + airport
        this.getAddressfromMap(newInputValue);
        break;
      case "airport":
        // to avoid multiple unnecessary api calls
        clearTimeout(this.typingTimer);
        this.setState({
          typingTimer: setTimeout(function () {
            self.filterLoc(newInputValue);
          }, 200),
        });
        break;
      case "landmark":
        search_options = {
          types: ["landmark"],
          language: ["en"],
        };
        break;
    }
  };

  displaySuggestions = (predictions, status) => {
    if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
      this.setState({ options: [] });
    }

    let predicts = [];
    for (let index = 0; index < predictions.length; ++index) {
      const one_predict = predictions[index];
      predicts[index] = {
        name: one_predict["description"],
        place_id: one_predict["place_id"],
      };
    }
    this.setState({ options: [...predicts] });
  };

  getAddressfromMap = async (
    searchStr,
    results,
    { map, mapApi, searchkey } = this.props
  ) => {
    let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/autocomplete/get?query=${searchStr}`);
    let predictions = response.data.predictions;
    if (!predictions) {
      this.setState({ options: [] });
    }

    let predicts = [];
    for (let index = 0; index < predictions.length; ++index) {
      const one_predict = predictions[index];
      predicts[index] = {
        name: one_predict["description"],
        place_id: one_predict["place_id"],
        type: "address",
      };
    }
    let airport = await this.getLocs(searchStr);
    airport = airport.concat(predicts);
    this.setState({ options: [...airport] });

  };

  showModal = () => {
    this.setState({ modalShow: true });
  };
  address_return = (data) => {
    this.setState({ editModalshow: false });
    const address =
      data.street + ", " + data.city + ", " + data.state + ", " + data.country;
    // this.searchInputRef.current.value = address;

    // this.searchInputRef.current.focus();
    // $('#addressInput').focus();
  };
  showEditModal = () => {
    this.setState({ editModalshow: true });
  };
  hideModal = (data) => {
    this.setState({ modaldata: data });
    this.setState({ modalShow: false });
  };
  hideEditModal = () => {
    this.setState({ editModalshow: false });
  };
  componentDidMount({ map, mapApi, searchkey } = this.props) {
    let options;
    switch (searchkey) {
      case "searchall":
        options = {
          types: ["address", "Loc", "landmark"],
          language: ["en"],
        };
        this.setState({ iconType: IconSearch });
        break;
      case "address":
        options = {
          types: ["address"],
          language: ["en"],
        };
        this.setState({ iconType: IconLocation });
        break;
      case "Loc":
      case "airport":
        options = {
          types: ["Loc"],
          language: ["en"],
        };
        this.setState({ iconType: IconPlane }, () => {
          this.forceUpdate();  // Force update if necessary
        });
        break;
      case "landmark":
        options = {
          types: ["landmark"],
          language: ["en"],
        };
        this.setState({ iconType: IconLandmark });
        break;
    }

    // this.autoCompleteRef.current = new mapApi.places.Autocomplete(
    //   this.searchInputRef.current,
    //   options
    // );
    // this.props.initialValue ? this.searchInput.value = this.props.initialValue : '';
    // this.autoCompleteRef.current.addListener(
    //   "place_changed",
    //   this.onPlaceChanged
    // );
  }

  componentWillUnmount({ mapApi } = this.props) {
    // mapApi.event.clearInstanceListeners(this.searchInputRef.current);
  }
  addMarker(position, map, i) {
    return new google.maps.Marker({
      // @see http://stackoverflow.com/questions/2436484/how-can-i-create-numbered-map-markers-in-google-maps-v3 for numbered icons
      //icon:
      // "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" +
      // i +
      //  "|FF0000|000000",
      position: position,
      map: map,
    });
  }
  onPlaceChanged = (
    { map, addplace, mapApi, value, setValue, selectedType,  type, id } = this.props
  ) => {
    const place = this.autoCompleteRef.current.getPlace();
    if (!place.geometry) return;
    if (place.geometry.viewport) {
      // map.fitBounds(place.geometry.viewport);
      this.setState({ modalShow: true });
      const street_number = place.address_components.find((c) =>
        c.types.includes("street_number")
      ) || { short_name: "" };
      const street_name = place.address_components.find((c) =>
        c.types.includes("route")
      ) ||
        place.address_components.find((c) =>
          c.types.includes("sublocality_level_1")
        ) || { short_name: "" };

      const street = street_number.short_name + " " + street_name.short_name;

      this.setState({
        location: {
          postcode:
            place.address_components.find((c) =>
              c.types.includes("postal_code")
            ) || {},
          street: street,
          street_number:
            place.address_components.find((c) =>
              c.types.includes("street_number")
            ) || {},
          street_name:
            place.address_components.find((c) => c.types.includes("route")) ||
            place.address_components.find((c) =>
              c.types.includes("sublocality_level_1")
            ) ||
            {},
          city:
            place.address_components.find((c) =>
              c.types.includes("locality")
            ) || {},
          country:
            place.address_components.find((c) => c.types.includes("country")) ||
            {},
          state:
            place.address_components.find((c) =>
              c.types.includes("administrative_area_level_1")
            ) || {},
        },
      });

      if (type == "pickup") {
        setValue(place.formatted_address);
        if (markers.pickup) {
          const result = markers.pickup.setMap(null);
        }
        pickupLatLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
      } else if (type == "dropoff") {
        setValue(place.formatted_address);
        if (markers.dropoff) markers.dropoff.setMap(null);
        dropoffLatLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
      } else {
        value.push(place.formatted_address);

        setValue(value);
        stopLatLng[id] = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
      }
      bounds = new google.maps.LatLngBounds();
      const directionsService = new google.maps.DirectionsService();
      let waypoints = [];
      stopLatLng.map((val) => {
        waypoints.push({ location: val, stopover: true });
      });

      if (pickupLatLng.lat & dropoffLatLng.lat)
        directionsService.route(
          {
            origin: { lat: pickupLatLng.lat, lng: pickupLatLng.lng },
            destination: { lat: dropoffLatLng.lat, lng: dropoffLatLng.lng },
            waypoints: waypoints,
            travelMode: "DRIVING",
          },
          (response, status) => {
            if (status === "OK") {
              if (directionsDisplay != null) {
                directionsDisplay.setMap(null);
                directionsDisplay = null;
              }
              directionsDisplay = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
              });
              directionsDisplay.setMap(map);
              directionsDisplay.setDirections(response);
              directionsDisplay.setOptions({
                polylineOptions: {
                  strokeColor: '#F4730E'
                }
              });
              var route = response.routes[0];
              var markerCounter = 0;
              // start marker
              this.addMarker(
                route.legs[0].start_location,
                map,
                markerCounter++
              );
              // the rest
              for (var i = 0; i < route.legs.length; i++) {
                this.addMarker(
                  route.legs[i].end_location,
                  map,
                  markerCounter++
                );
              }
            } else {
              console.log("Directions request failed due to " + status);
            }
          }
        );
      if (pickupLatLng.lat) {
        if (markers.pickup) markers.pickup.setMap(null);
        bounds.extend(
          new google.maps.LatLng(pickupLatLng.lat, pickupLatLng.lng)
        );
        markers.pickup = new google.maps.Marker({
          map: map,
          position: { lat: pickupLatLng.lat, lng: pickupLatLng.lng },
          icon: Pickup,
        });
      }
      if (dropoffLatLng.lat) {
        if (markers.dropoff) markers.dropoff.setMap(null);
        bounds.extend(
          new google.maps.LatLng(dropoffLatLng.lat, dropoffLatLng.lng)
        );
        var marker = new google.maps.Marker({
          map: map,
          position: { lat: dropoffLatLng.lat, lng: dropoffLatLng.lng },
          icon: Dropoff,
        });
        markers.dropoff = marker;
      }
      if (stopLatLng.length > 0) {
        stopLatLng.map((val, index) => {
          if (val) {
            bounds.extend(new google.maps.LatLng(val.lat, val.lng));
            if (markers.stop[index]) markers.stop[index].setMap(null);
            var marker = new google.maps.Marker({
              map: map,
              position: { lat: val.lat, lng: val.lng },
              icon: AddStop,
            });
            markers.stop[index] = marker;
          }
        });
      }
      map.fitBounds(bounds);
    } else {
      // map.setCenter(place.geometry.location);
      // map.setMarker({})
      map.setZoom(12);
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: Pickup,
      });
    }
    addplace(place);
    this.searchInputRef.current.blur();
  };

  componentDidUpdate(prevProps) {
     if (prevProps.searchkey !== this.props.searchkey) {
      this.updateIconType(this.props.searchkey);
    }
  }

  updateIconType(searchkey) {
    let iconType;

    switch (searchkey) {
      case "searchall":
        iconType = IconSearch;
        break;
      case "address":
        iconType = IconLocation;
        break;
      case "Loc":
      case "airport":
        iconType = IconPlane;
        break;
      case "landmark":
        iconType = IconLandmark;
        break;
      default:
        iconType = IconSearch; 
        break;
    }

    this.setState({ iconType }); 
  }

  render() {
    return (
      <>
        <MyVerticallyCenteredModal
          show={this.state.modalShow}
          confirm={this.hideModal}
          location={this.state.location}
          showeditmodal={this.showEditModal}
          hideEditModal={this.hideEditModal}
          onHide={this.hideModal}
        />
        <EditModal
          show={this.state.editModalshow}
          data={this.state.modaldata}
          address_return={this.address_return}
          onHide={this.hideEditModal}
        />

        <Wrapper className="auto-complete-wrapper">
          <label className="icon-type">
            <img
              src={this.state.iconType}
              width="24px"
              height="24px"
              alt="location"
            />
          </label>
          <AutocompleteMUI
            id="addressInput"
            defaultValue={
              this.props.initialValue?this.props.initialValue: null
            }
            // sx={{ width: 500 }}
            style={{ border: 0 }}
            ListboxProps={{
              sx: { fontSize: 12 },
            }}
            forcePopupIcon={false}
            open={this.state.open}
            onOpen={() => {
              if (this.state.inputValue && this.state.inputValue.length > 0) {
                this.setState({ open: true });
              }
            }}
            onClose={() => {
              this.setState({ open: false });
            }}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (option.name || this.props.initialValue|| "")}
            options={this.state.options}
            loading={this.state.loading}
            onChange={(event, value) => this.selectLoc(value)} // prints the selected value
            inputValue={this.state.inputValue}
            onInputChange={(event, newInputValue) => {
              if(event) {
              this.props.droffBackCall(newInputValue, this.props.type )
              this.onInputChange(newInputValue)
              if (newInputValue.length > 0) {
                this.setState({ open: true });
              } else {
                this.setState({ open: false });
              }
            } else {
              if(this.props.initialValue) {
              this.onInputChange(this.props.initialValue);
              } else {
              this.onInputChange("");
              }
            }
            }
            }
            filterOptions={(x) => x}
            renderOption={(props, option) => (
              <li className={option.type} {...props}>
                <img
                  src={option.type != "airport" ? IconLocation : IconPlane}
                  width="18px"
                  height="18px"
                  alt="location-type"
                />
                {option.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                variant="standard"
                placeholder="Enter location"
                {...params}
                label=""
                InputProps={{
                  style: { fontSize: "12px" },
                  disableUnderline: true,
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {this.state.loading ? (
                        <CircularProgress color="inherit" size={12} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  ),
                }}
              />
            )}
          />
        </Wrapper>
        <div className="check" onClick={() => this.showEditModal()}>
          <img
            src={LocationCheck}
            width="24px"
            height="24px"
            alt="location-check"
          />
        </div>
      </>
    );
  }
}

export default AutoComplete;
