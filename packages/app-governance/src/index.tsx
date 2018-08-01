// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

import CouncilVotingProposalsHOC from './CouncilVotingProposalsHOC';
import DemocracyProposalsHOC from './DemocracyProposalsHOC';
import DemocracyProposalsRxAPI from './DemocracyProposalsRxAPI';
import MultipleProposalsRxAPI from './MultipleProposalsRxAPI';
import ProposalsData from './ProposalsData';
import Test from './Test';

export default class App extends React.PureComponent<any> {
  render () {
    return (
      <div>
        {/* <CouncilVotingProposalsHOC />
        <DemocracyProposalsHOC />
        <DemocracyProposalsRxAPI /> */}
        {/* <MultipleProposalsRxAPI /> */}
        {/* <ProposalsData /> */}
        <Test />
      </div>
    );
  }
}

// import { I18nProps } from '@polkadot/ui-app/types';
// import { StorageQuery } from './types';

// import './index.css';

// import React from 'react';

// import classes from '@polkadot/ui-app/util/classes';

// import Queries from './Queries';
// import Selection from './Selection';
// import translate from './translate';

// type Props = I18nProps & {};

// type State = {
//   queue: Array<StorageQuery>
// };

// class GovernanceApp extends React.PureComponent<Props, State> {
//   state: State = {
//     queue: [],
//   };

//   render () {
//     const { className, style } = this.props;
//     const { queue } = this.state;

//     return (
//       <div
//         className={classes('governance--App', className)}
//         style={style}
//       >
//         <Selection onAdd={this.onAdd} />
//         <Queries
//           onRemove={this.onRemove}
//           value={queue}
//         />
//       </div>
//     );
//   }

//   onAdd = (query: StorageQuery): void => {
//     this.setState(
//       (prevState: State): State => ({
//         queue: [query].concat(prevState.queue)
//       })
//     );
//   }

//   onRemove = (id: number): void => {
//     this.setState(
//       (prevState: State): State => ({
//         queue: prevState.queue.filter((item) => item.id !== id)
//       })
//     );
//   }
// }

// export default translate(GovernanceApp);
