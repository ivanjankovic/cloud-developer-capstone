import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment, Button, Message, Transition, Divider, Rail, Image } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditPage } from './components/EditPage'
import { NotFound } from './components/NotFound'
import { Todos } from './components/ListPage'
import { getItems, createItem , deleteItem } from './api/items-api'
import { typeItem } from './types/Item'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {
  items: typeItem[]
  loadingItems: boolean
  messageVisible: any
  messageType: string
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }
  state: AppState = {
    items: [],
    loadingItems: true,
    messageVisible: false,
    messageType: ''
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }
  setItemsState = async () => {
    try {
      const items = await getItems(this.props.auth.getIdToken())
      this.setState({
        items,
        loadingItems: false
      })
    } catch (e) {
      alert(`Failed to fetch items: ${e.message}`)
    }
  }

  addItemToArray = (item: any) => {
    this.setState({ items: [item, ...this.state.items] })
  }

  updateAppState = async (patchedItem: any) => {

    const itemId = patchedItem.itemId
    let updatedItems = this.state.items.map(
      item => (item.itemId == itemId)? patchedItem : item
    )
    this.setState({
      items: updatedItems
    })
  }

  deleteItemFromArray = (itemId: string) => {
    this.setState({
      items: this.state.items.filter(item => item.itemId != itemId)
    })
  }

  toggleVisibility = () => {
    this.setState((prevState) => ({ messageVisible: !prevState.messageVisible }))
  }

  displayMessage = (message: string) => {
    this.setState({ messageType: message })
    this.toggleVisibility()
    setTimeout(this.toggleVisibility, 3000)
  }

  // RENDER Methods

  render() {
    return (
      <div>
        <Segment vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.renderMenue()}
                  
                  {this.props.auth.isAuthenticated()? this.generateCurrentPage(): null}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  renderMenue() {
    let auth = this.props.auth
    
    return (
      <Grid className='menue' columns='equal' padded>
        <Grid.Row>
          <Grid.Column>
            <Link to="/">
              <Button 
                icon='home'
                basic
                size='medium'
                color='teal'
                labelPosition='left'
                content='Home'
              />
            </Link>
            
          </Grid.Column>
          <Grid.Column textAlign='center'>
            {this.renderMessage()}
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <Button
              icon='sign-in'
              basic
              size='medium'
              color='yellow'
              labelPosition='left'
              content={auth.isAuthenticated()? 'Log out': 'Log in'}
              className='menu-signin-button'
              onClick={
                auth.isAuthenticated()?
                this.handleLogout: this.handleLogin
              }
            />
          </Grid.Column>
        </Grid.Row>
        
      </Grid>
    )
  }

  renderMessage() {
    const { messageVisible, messageType } = this.state
    const show = 2000
    const hide = 3000
    return (
      <Transition visible={messageVisible} animation='fade' duration={{ hide, show }}>
        <Message 
          visible={messageVisible}
          color={messageType == 'success'? 'yellow': 'red'}
          size={messageType == 'success'? 'mini': 'tiny'}
          header={messageType == 'success'? 'Item added.': 'Please input the name.'}
        />
      </Transition>
    )
  }

  generateCurrentPage() {
    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Todos {...props} 
              auth={this.props.auth}
              items={this.state.items}
              loadingItems={this.state.loadingItems}
              displayMessage={this.displayMessage}
              addItemToArray={this.addItemToArray}
              updateAppState={this.updateAppState}
              setItemsState={this.setItemsState}
              deleteItemFromArray={this.deleteItemFromArray}
              pageReload={'dummy'}
            />
          }}
        />
        
        <Route
          path="/items/:itemId/edit"
          exact
          render={props => {
            return <EditPage {...props}
              auth={this.props.auth}
              items={this.state.items}
              displayMessage={this.displayMessage}
              addItemToArray={this.addItemToArray}
              updateAppState={this.updateAppState}
            />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
