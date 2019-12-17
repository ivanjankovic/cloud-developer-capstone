import { History } from 'history'
import * as React from 'react'
import { Button, Grid, Image, Loader, Segment } from 'semantic-ui-react'

import Auth from '../auth/Auth'
import { deleteItem } from '../api/items-api'
import { typeItem } from '../types/Item'
import { InputForm } from './InputForm'
import { Loading } from './Loading'
import { Item } from './Item'

interface ItemsProps {
  auth: Auth
  history: History
  displayMessage: any
  addItemToArray: any
  updateAppState: any
  setItemsState: any
  deleteItemFromArray: any
  items: typeItem[]
  loadingItems: boolean
  pageReload: any
}

interface ItemsState {
}

export class Todos extends React.PureComponent<ItemsProps, ItemsState> {
  state: ItemsState = {
  }

  onEditButtonClick = (itemId: string) => {
    this.props.history.push(`/items/${itemId}/edit`)
  }

  onDeleteButtonClick = async (itemId: string) => {
    try {
      const idToken = this.props.auth.getIdToken()
      await deleteItem( idToken, itemId )
      this.props.deleteItemFromArray(itemId)
    } catch {
      alert('Item deletion failed')
    }
  }

async componentDidMount() {
  this.props.setItemsState()
}

// RENDER Methods

  render() {
    return (
      <div>
        <InputForm
          {...this.props}
          item={undefined}
          editMode={false}
          attachmentLabel='Add image'
          auth={this.props.auth}
          displayMessage={this.props.displayMessage}
          addItemToArray={this.props.addItemToArray}
          updateAppState={this.props.updateAppState}
        />
        { this.props.loadingItems? <Loading /> : this.renderItemsList()}
      </div>
    )
  }
  
  renderItemsList() {
    return (
      <Grid>

        {this.props.items.map((item, pos) => {
          return (
            
            <Grid.Row key={item.itemId} className='item-row'>

              {/* Item left side */}
              <Grid.Column width={14}>
                <Item { ...item} />
              </Grid.Column>

              {/* Item right side */}
              <Grid.Column width={2} >
                
                <Button floated='right'
                  className='round-button'
                  icon='trash'
                  basic
                  circular
                  size='tiny'
                  color="red"
                  onClick={() => this.onDeleteButtonClick(item.itemId)}
                />
                <Button floated='right'
                  className='round-button'
                  icon="pencil"
                  basic
                  circular
                  size='tiny'
                  color="blue"
                  onClick={() => this.onEditButtonClick(item.itemId)}
                />
                
              </Grid.Column>
            </Grid.Row>
          )
        })}

      </Grid>
    )
  }

}
