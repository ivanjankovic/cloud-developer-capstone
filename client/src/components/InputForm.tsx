import * as React from 'react'
import { Button, Grid, Icon, Form, Input, Label } from 'semantic-ui-react'
import * as uuid from 'uuid'

import { createItem, patchItem } from '../api/items-api'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile } from '../api/items-api'

interface InputFormProps {
  item: any
  auth: Auth
  editMode: boolean
  attachmentLabel: string
  displayMessage: any
  addItemToArray: any
  updateAppState: any
  pageReload: any
}

interface InputFormState {
  name: string
  weight: number | string
  price: string
  attachment: boolean
  attachmentUrl: boolean | string
  input: any
  file: any
}

export class InputForm extends React.PureComponent<InputFormProps, InputFormState> {
  state: InputFormState = {
    name: '',
    weight: '',
    price: '',
    attachment: false,
    attachmentUrl: false,
    input: undefined,
    file: undefined
  }

  handleItemNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }

  handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ weight: Number(event.target.value )})
  }

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
    const newPrice = event.target.value
    
    if (newPrice === '' || floatRegExp.test(newPrice)){
      this.setState({ price: event.target.value })
    }
  }

  onItemCreate = async () => {
    if (!this.state.name) {
      this.props.displayMessage('error')
      return
    }

    try {
      this.state.weight? null : this.state.weight = '0'
      this.state.price? null : this.state.price = '_'
      const newItemCreateRequest = this.getInputState()
      this.resetInputFields()
      const itemId = uuid.v4()
      const idToken = this.props.auth.getIdToken()
      
      if (this.state.file) {
        await this.uploadImage(idToken ,itemId, this.state.file)
      }
      
      const newItem = await createItem( idToken, { ...newItemCreateRequest, itemId } )

      this.props.addItemToArray(newItem)
      
      this.props.displayMessage('success')

    } catch {
      alert('Item creation failed.')
    }
  }

  onItemEdit = async () => {

    try {
      
      const itemUpdateRequest = this.getInputState()
      const itemId = this.props.item.itemId
      const idToken = this.props.auth.getIdToken()
      const key = {
        userId: this.props.item.userId,
        createdAt: this.props.item.createdAt,
      }

      if (this.state.file) {
        await this.uploadImage(idToken ,itemId, this.state.file)

      }
      
      const patchedItem = await patchItem( idToken, itemId, itemUpdateRequest, key )
      
      this.props.pageReload(patchedItem)
      this.resetInputFields()
      this.props.updateAppState(patchedItem)

    } catch {
      alert('Item edit failed')
    } 
    
  }

  getInputState = () => {
    const { name, weight, price, attachment, attachmentUrl } = this.state
    
    const curentState = {
      name,
      weight,
      price,
      attachment,
      attachmentUrl
    }
    
    return curentState
  }

  uploadImage = async (idToken: string ,itemId: string, file: any) => {
    const uploadUrl = await getUploadUrl( idToken, itemId )
    await uploadFile( uploadUrl, file )
  }

  async componentDidMount() {
  }

  resetInputFields = () => {
    this.setState({
      name: '',
      weight: '',
      price: '',
      attachment: false,
    })
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0],
      attachment: true
    })
    console.log("New State: ", this.state)
  }

  onUpload = (file: any) => {
    this.setState({
      file,
      attachment: true
    })
  }

  // RENDER Methods
  
  render() {
    return (
      <Form inverted
        className='main-form'
        onSubmit={this.props.editMode? this.onItemEdit : this.onItemCreate} >
        
        <Form.Group>
          <Form.Input
            width={10}
            label='Item'
            value={this.state.name}
            placeholder='Spinach'
            size='small'
            onChange={this.handleItemNameChange}
          />
          <Form.Input
            width={3}
            type='number'
            label='Weight'
            value={this.state.weight}
            placeholder='oz'
            size='small'
            onChange={this.handleWeightChange}
          />
          <Form.Input
            width={3}
            type='text'
            label='Price'
            value={this.state.price}
            placeholder='1.99'
            icon='dollar'
            iconPosition='left'
            size='small'
            onChange={this.handlePriceChange}
          />
        </Form.Group>

        <Grid textAlign='right'>
          <Grid.Column>
            <Grid.Column>
              <Form.Button
                floated='right'
                icon='add'
                basic
                size='small'
                color='teal'
                labelPosition='left'
                content={this.props.editMode? 'Edit item': 'Add item'}
              />
              {this.renderAddEditImageButton()}
            </Grid.Column>
          </Grid.Column>
        </Grid>

      </Form>
    )
  }

  // TODO: simplify the custom button with semantic-ui-react Label and Input components

  renderAddEditImageButton = () => {
    let fileInput: any = null;
    const uid = Math.random().toString(36).substring(7);
    
    return (
      <span>
        <label htmlFor={uid} className='customB'>
          <Icon as={Button}
            className='customB'
            icon='images'
            basic
            size='small'
            color='blue'
            labelPosition='left'
            content={this.props.attachmentLabel}
            disabled
          />
          <input type="file" id={uid}
            accept="image/*"
            style={{display: "none"}}
            onChange={() => {
              // this.handleFileChange
              this.onUpload(fileInput.files[0]);
            }}
            ref={input => {
              fileInput = input;
            }}
          />
        </label>
      </span>
    )
  } 
}
