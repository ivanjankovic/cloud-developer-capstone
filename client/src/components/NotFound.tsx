import * as React from 'react'
import { Segment, Loader } from 'semantic-ui-react'

interface NotFoundProps {
}

interface NotFoundState {
}

export class NotFound extends React.PureComponent<NotFoundProps, NotFoundState> {
  render() {
    return (
    <Segment basic inverted >
      <h4>Not Found</h4>
    </Segment>
    )
    
  }
}
