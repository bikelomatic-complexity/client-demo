/*eslint-disable no-unused-vars*/
import React from 'react';
import { RaisedButton, TextField } from 'material-ui';
/*eslint-enable no-unused-vars*/

import { isEmpty } from 'lodash';
import WizardPage from './wizard-page';

export class ServiceDescription extends WizardPage {
  componentWillMount() {
    const {point} = this.props;
    this.setState( {
      description: point.description,
      phone: point.phone,
      address: point.address,
      website: point.website,
      coverUrl: point.coverUrl
    } );
  }

  componentDidMount() {
    this.props.setDrawer( 'Add Details' );
  }

  getPageFields() {
    return [
      'description',
      'phone',
      'address',
      'website',
      'coverBlob',
      'coverUrl'
    ];
  }

  getPageContent() {
    const {coverUrl} = this.state;

    let image;
    if( coverUrl ) {
      image = (
        <div>
          <image style={ { width: '100%' } }
            src={ coverUrl } />
        </div>
      );
    }

    return (
      <div className="wizard-page">
        <TextField fullWidth
          { ...this.link( 'phoneNumber' ) }
          floatingLabelText="Phone Number"
          type="tel" />
        <TextField fullWidth
          { ...this.link( 'address' ) }
          floatingLabelText="Address" />
        <TextField fullWidth
          { ...this.link( 'website' ) }
          floatingLabelText="Website"
          type="url" />
        <TextField fullWidth
          { ...this.link( 'description' ) }
          floatingLabelText="Description"
          multiLine={ true }
          rows={ 2 }
          rowsMax={ 4 } />
        { image }
        <div className="wizard-page__spacer" />
        <RaisedButton fullWidth
          secondary
          onClick={ this.onPhotoAdd }
          label="Upload Photo" />
      </div>
      );
  }

  getPreferredTransition() {
    const anySet = this.getPageFields().reduce( ( anySet, field ) => {
      return anySet || !isEmpty( this.state[ field ] );
    }, false );

    if ( anySet ) {
      return WizardPage.transitions.next;
    } else {
      return WizardPage.transitions.skip;
    }
  }
}

export default ServiceDescription;
