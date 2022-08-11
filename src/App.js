import React, {Component} from 'react';
import './App.css';
import axios from "axios";
import Moment from 'moment';
import config from './data/config'
import instTypes from './data/InstTypes.json';
import logo from './images/logo_new.png';
import { Dropdown } from 'semantic-ui-react';


//let time = new Date().toLocaleString();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
	  istate: '',
	  idistrict: '',
	  insttype: '',
	  error: '',
	  states: [],
	  districts: [],
	  dataRows: [],
      loggedIn: true,
      time: Moment().format('DD MMMM YYYY, h:mm:ss A')
    };
  }


async componentDidMount() {
	console.log('instTypes:',instTypes.types);
    await this.retrieveAllStates();
}

retrieveAllStates = async () => {
  console.log('getStatesUrl:',config.getStates); 	
  try {
      await axios.get(config.getStates)
      .then(res => {
        //console.log(res);
        //console.log(res.data.states);

		const indiasteates = res.data.states.map((row) => {
                return {
                       key: row.id,
                       value: row.id,
                       text: row.state}
            });		
		
		console.log(indiasteates);
        if (res.data.states) { this.setState({ states: indiasteates }); }
      })
    } catch (err) {
      console.log(err.message);
    }
}

retrieveDiscticts = async (stateid) => {
  console.log('getDistricts:',config.getDistricts+stateid); 	
  try {
      await axios.get(config.getDistricts+stateid)
      .then(res => {
        //console.log(res);
        console.log(res.data.districts);

		const thisDistricts = res.data.districts.map((row) => {
                return {
                       key: row.id,
                       value: row.name,
                       text: row.name}
            });		
		
		console.log(thisDistricts);
        if (res.data.districts) { this.setState({ districts: thisDistricts }); }
      })
    } catch (err) {
      console.log(err.message);
    }
}

retrieveInstData = async (district1) => {
   try {
    let data = {};
	let selectedState = [];
	let selectedDistrict = [];
	selectedState.push(this.state.istate);
	selectedDistrict.push(district1);
    data.state = selectedState;
    data.district = selectedDistrict;
    console.log('getInstDetailsUrl:',config.getInstituteDetails);
    console.log('payload:',data);
    await axios.post(config.getInstituteDetails, data).then(
      res => {
        console.log('response2',res.data);
        this.setState({
         dataRows: res.data.institutes
       });
	   console.log('institutes size',this.state.dataRows.length);
      })
      .catch(
        error => {
          console.log(error);
          this.setState({
           error: "Not able to retrive Institutions List"
         });
        })
      } catch (err) {
        console.log('Error Occured');
      }
}

renderRows() {
  console.log('renderRowa');
  let rows = [];
  rows.push(<tr><th align="center">Institute Name</th><th align="center">Institute Address</th><th align="center">Programme</th></tr>)
  for (let i = 0; i < this.state.dataRows.length; i++) {
		  rows.push(<tr><td>{this.state.dataRows[i]['CURRENT_INSTITUTE_NAME']}</td><td>{this.state.dataRows[i]['CURRENT_INSTITUTE_ADDRESS']}</td><td>{this.state.dataRows[i]['PROGRAMME']}</td></tr>);
  }
  return rows;
}

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  tick() {
    this.setState({
      time: Moment().format('DD MMMM YYYY, h:mm:ss A')
    });
  }

 handleDropDownState = async (event, data) => {
   this.setState({ 
		istate: data.value,
		idistrict: '',
		insttype: '',
		dataRows: []	
	}); 
   console.log(data.value);
   await this.retrieveDiscticts(data.value);
};

 handleDropDownDistrict = async (event, data) => {
   this.setState({ 
		idistrict: data.value	
	}); 
   console.log(data.value);
   await this.retrieveInstData(data.value);
};
  
render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
		  <div className="App-Label">
			<p> {this.state.time}. </p>
		  </div>
			  <div>
				  <p>
					  <Dropdown placeholder='Select a state' name="states" fluid selection options={this.state.states} onChange={this.handleDropDownState} />
				  </p>
				  {this.state.istate && this.state.districts &&
					 <p>
					  <Dropdown placeholder='Select a district' name="districts" fluid selection options={this.state.districts} onChange={this.handleDropDownDistrict} />
				     </p>	
				  }	
			    </div>
				
			  {this.state.dataRows && this.state.dataRows.length > 0 &&
				<div class="Result-Table">
					<p> </p> <p> <div class="App-Label">Search Results</div></p> <p> </p>
					<table class="ui striped table">
						{this.renderRows()}  
					</table>
				</div>
			  }	
		   
			  {this.state.error &&
				<div class="App-Error">
					<p> </p> <p> </p> {this.state.error} 
				</div>
		      }	
		   
      </header>
    </div>

    );
  }
}

export default App;
