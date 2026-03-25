import gql from "graphql-tag";

export const ITEMS_LIST_QUERY = gql`
  query ItemsList(
    $filter: ItemFilter!
    $sorting: [ItemSort!]
    $paging: OffsetPaging!
  ) {
    items(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        name
        avatarUrl
        dealsAggregate {
          sum {
            value
          }
        }
      }
    }
  }
`;

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateItem($input: CreateOneItemInput!) {
    createOneItem(input: $input) {
      id
      salesOwner {
        id
      }
    }
  }
`;
