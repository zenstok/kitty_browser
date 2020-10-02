import React, { Component } from 'react';
import { object } from 'prop-types';
import Web3 from 'web3';
import KittyCoreABI from '../contracts/ABI.json';
import { CONTRACT_NAME, CONTRACT_ADDRESS } from '../config';
import KittyForm from './KittyForm/KittyForm';
import Moment from 'moment';

class Browser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kitty: {
        id: null,
        generation: null,
        genes: null,
        birthTime: null,
      }
    };
    this.kittyImgRef = React.createRef();
  }

  async handleOnFormSubmit(kittyId) {
    const drizzle = this.context.drizzle;
    if(!drizzle.contracts && !drizzle.contracts[CONTRACT_NAME]) {
      console.error('Contract not found!');
      return;
    }
    const contract = drizzle.contracts[CONTRACT_NAME];
    const kitty = await this.getKittyFromContract(contract, kittyId);

    this.getKittyImage(kittyId);

    this.setState({
      kitty: {
        id: kittyId,
        generation: kitty.generation,
        genes: kitty.genes,
        birthTime: Moment(kitty.birthTime * 1000),
      }
    })
  }

  async getKittyFromContract(contract, kittyId) {
    const getKitty = contract.methods.getKitty;
    return await getKitty(kittyId).call();
  }

  getKittyImgUrl(kittyId) {
    if(!kittyId) {
      console.error('Kitty ID must be defined!');
      return;
    }
    if(isNaN(parseInt(kittyId, 10))) {
      console.error('Kitty ID must be a number!')
      return;
    }
    return 'https://storage.googleapis.com/ck-kitty-image/' + CONTRACT_ADDRESS + '/' + kittyId + '.svg';
  }

  getKittyImage(kittyId) {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", (result) => {
      this.setKittyImage(result.target.response);
    });
    oReq.open("GET", this.getKittyImgUrl(kittyId));
    oReq.send();
  }

  setKittyImage(html) {
    if(this.kittyImgRef.current) {
      this.kittyImgRef.current.innerHTML = html;
    }
  }

  getBirthDate(birthTime) {
    if(!birthTime || !Moment.isMoment(birthTime)) {
      return null;
    }
    return birthTime.format('LL');
  }
  
  componentDidMount() {
    const web3 = new Web3(window.web3.currentProvider);

    // Initialize the contract instance
    const kittyContract = new web3.eth.Contract(
      KittyCoreABI, // import the contracts's ABI and use it here
      CONTRACT_ADDRESS,
    );

    // Add the contract to the drizzle store

    this.context.drizzle.addContract({
      contractName: CONTRACT_NAME,
      web3Contract: kittyContract,
    });
  }

  render() {
    const displayKitty = Boolean(this.state.kitty.id);
    return (
      <div className="browser">
        <h1>
          Kitty Browser
        </h1>
        <KittyForm onSubmit={this.handleOnFormSubmit.bind(this)}/>

        { displayKitty &&
          <div style={{marginTop: '2rem'}}>
            <h3>Genes</h3>
            <p>{this.state.kitty.genes}</p>
            <h3>Generation</h3>
            <p>{this.state.kitty.generation}</p>
            <h3>Birth Time</h3>
            <p>{this.getBirthDate(this.state.kitty.birthTime)}</p>
            <p style={{width: '20rem', height: '20rem'}} ref={this.kittyImgRef}></p>
          </div>
        }
      </div>
    );
  }
}

Browser.contextTypes = {
  drizzle: object,
};

export default Browser;
