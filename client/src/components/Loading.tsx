import React from 'react'
import { Segment, Loader } from 'semantic-ui-react'

interface LoadingProps {
}

export class Loading extends React.PureComponent<LoadingProps> {
  
  render() {
    return (
      <Segment basic>
        <Loader inverted active indeterminate content='Loading' />
      </Segment>
    )
  }
}

export default Loading
