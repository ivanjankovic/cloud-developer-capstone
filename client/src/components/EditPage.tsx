import * as React from 'react'
import Auth from '../auth/Auth'
import { Segment, Divider } from 'semantic-ui-react'
import { InputForm } from './InputForm'
import { Loading } from './Loading'
import { Item } from './Item'

import { getItem } from '../api/items-api'


interface EditItemProps {
  match: {
    params: {
      itemId: string
    }
  }
  items: any
  displayMessage: any
  addItemToArray: any
  updateAppState: any
  auth: Auth
}

interface EditItemState {
  item: any
  loadingItem: boolean
}

export class EditPage extends React.PureComponent<
  EditItemProps,
  EditItemState
> {
  state: EditItemState = {
    item: {},
    loadingItem: true,
  }
  pageReload = async (item: any) => {
    this.setState({
      item
    })
  }

  async componentDidMount() {
    try {
      const item = await getItem(
        this.props.auth.getIdToken(),
        this.props.match.params.itemId
      )
      this.setState({
        item,
        loadingItem: false
      })
      
    } catch (e) {
      alert(`Failed to fetch item: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <InputForm
          editMode={true}
          item={this.state.item}
          attachmentLabel={this.state.item.attachment? 'Edit image': 'Add image'}
          { ...this.props}
          pageReload={this.pageReload}
        />
        <Divider inverted />
        { this.state.loadingItem?
          <Segment basic><Loading /></Segment> :
          <Item { ...this.state.item} />
        }
    </div>
    )
  }

}
