import * as React from 'react'
import { Button, Grid, Image, Loader, Segment } from 'semantic-ui-react'

interface ItemProps {
  name: any
  weight: any
  price: any
  attachmentUrl: any
  attachment: any
}

interface ItemsState {
}

export class Item extends React.PureComponent<ItemProps, ItemsState> {
  state: ItemsState = {
  }

  render() {
    return (
      <Grid>
        <Grid.Row>

          <Grid.Column width={5}>
            <Segment inverted> {this.props.name}</Segment>
          </Grid.Column>

          <Grid.Column width={3}>
            <Segment inverted  >{this.props.weight}</Segment>
          </Grid.Column>

          <Grid.Column width={3}>
            <Segment inverted  >{this.props.price}</Segment>
          </Grid.Column>

          <Grid.Column width={3}>
              <Image bordered
                size="small"
                src={this.props.attachmentUrl}
                alt=""
                className={
                  this.props.attachment? '' : 'no-src'
                }
              />
          </Grid.Column>

        </Grid.Row>
      </Grid>
    )
  }

}
